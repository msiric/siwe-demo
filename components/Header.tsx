"use client";

import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useAccount, useDisconnect } from "wagmi";

export function Header() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const pathname = usePathname();

  const handleSignOut = () => {
    disconnect();
    signOut();
  };

  return (
    <header className="flex items-center justify-end p-6">
      {isConnected ? (
        <button onClick={handleSignOut}>Log out</button>
      ) : pathname !== "/login" ? (
        <a href="/login">Log in</a>
      ) : null}
    </header>
  );
}
