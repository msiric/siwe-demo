import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-72px)]">
      <h1 className="text-3xl mb-5">{`Welcome ${
        session ? "back" : ""
      } to the SIWE demo application`}</h1>
      {!session ? (
        <p className="text-xl mb-5">Log in to access the profile page</p>
      ) : (
        <p className="text-xl mb-5">
          Good to see your again. Go to your{" "}
          <Link href="/profile" className="text-purple-500">
            Profile Page
          </Link>
          .
        </p>
      )}
      {!session && (
        <a href="/login" className="p-2 bg-purple-500 text-white rounded">
          Log In
        </a>
      )}
    </div>
  );
}
