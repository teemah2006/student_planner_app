"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Dashboardpg from "./Dashboard/page";
export default function LoginHome() {
  const router = useRouter();
  const { data: session, status } = useSession();
  console.log(session);
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/authentication");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }


  return (
    <div className="bg-gray-100 min-h-screen w-full">
      <Dashboardpg/>
    </div>
  )
}