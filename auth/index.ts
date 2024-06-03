import prisma from "@/lib/prisma";
import type { NextAuthOptions, User } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "siwe",
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials, req) {
        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials?.message || "{}")
          );
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL ?? "");

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req: { headers: req?.headers } }),
          });

          if (result.success) {
            return {
              id: siwe.address,
            } as User;
          }
          return null;
        } catch (err) {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    signIn: async ({ user, account }) => {
      if (!account?.provider || !user?.id || account.provider !== "siwe") {
        return false;
      }

      try {
        const providerAccountId = user.id;
        const provider = account.provider;

        let accountRecord = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider,
              providerAccountId,
            },
          },
          include: {
            user: true,
          },
        });

        if (!accountRecord) {
          const newUser = await prisma.user.create({
            data: {
              id: user.id,
              address: user.id,
              accounts: {
                create: {
                  provider,
                  providerAccountId,
                },
              },
            },
            include: { accounts: true },
          });

          user.id = newUser.id;
          user.accountId = newUser.accounts[0].id;
          user.providerAccountId = newUser.accounts[0].providerAccountId;
        } else {
          user.id = accountRecord.user.id;
          user.accountId = accountRecord.id;
          user.providerAccountId = accountRecord.providerAccountId;
        }

        return true;
      } catch (error) {
        return false;
      }
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.id = token.uid as string;
        session.userId = token.userId as string;
        session.provider = token.provider as string;
        session.providerAccountId = token.providerAccountId as string;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        const account = await prisma.account.findUnique({
          where: { providerAccountId: user.id },
          include: { user: true },
        });

        if (account) {
          token.uid = account.id;
          token.providerAccountId = account.providerAccountId;
          token.userId = account.user.id;
          token.provider = account.provider;
        }
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
