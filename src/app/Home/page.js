"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { signOut } from "next-auth/react";
export default function LoginHome() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/authentication");
    }
  }, [session, status, router]);

  if (!session) {
    return <p>Redirecting...</p>;
  }


  return (
    <div className="bg-white min-h-screen">
      <p className="text-3xl text-black">Welcome, {session.user.name}!</p>
      <button
        onClick={() => signOut("google", { callbackUrl: "/" })} 
        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        Sign out 
      </button>
    </div>
  )
}