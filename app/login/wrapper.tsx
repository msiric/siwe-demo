"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useSignMessage } from "wagmi";

export default function LoginWrapper() {
  const { openConnectModal } = useConnectModal();
  const { data: session } = useSession();
  const { address, isConnected, chain } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = useCallback(async () => {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Log in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      await signIn("siwe", {
        message: JSON.stringify(message),
        redirect: true,
        signature,
      });
      setMessage("Logged in successfully");
    } catch (error) {
      setError("Failed to log in");
    }
    setLoading(false);
  }, [address, chain?.id, signMessageAsync]);

  useEffect(() => {
    if (isConnected && !session) {
      handleLogin();
    }
  }, [handleLogin, isConnected, session]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (message) {
      timer = setTimeout(() => {
        setMessage("");
      }, 1500);
    }

    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-72px)]">
      <h1 className="text-2xl mb-5">Login</h1>
      <button
        onClick={openConnectModal}
        disabled={loading}
        className="p-2 bg-purple-500 text-white rounded"
      >
        {loading ? "Connecting..." : "Log in with Ethereum"}
      </button>
      {message && <p className="mt-4 text-green-500">{message}</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
