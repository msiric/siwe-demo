import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginWrapper from "./wrapper";

export default async function Login({
  searchParams,
}: {
  searchParams: {
    callbackUrl?: string | null;
    error?: string;
  };
}) {
  const session = await getServerSession(authOptions);
  const callbackUrl = searchParams.callbackUrl;

  if (session) {
    if (callbackUrl && URL.canParse(callbackUrl)) {
      const pathname = new URL(callbackUrl ?? "").pathname;
      return redirect(pathname);
    }
    return redirect("/");
  }

  return <LoginWrapper />;
}
