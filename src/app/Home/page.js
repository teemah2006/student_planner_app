"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Dashboardpg from "./Dashboard/page";
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
    <div className="bg-gray-100 min-h-screen w-full">
      <Dashboardpg/>
    </div>
  )
}