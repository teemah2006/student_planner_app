"use client"; 

import { signIn } from "next-auth/react"; // Import sign-in function
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-black">Welcome to <span className="text-blue-700">StudyEase</span></h1>
      <p className="mb-6 text-gray-600">Sign in to continue</p>

      <button
        onClick={() => signIn("google", { callbackUrl: "/Home" })} // Redirects to homepage after login
        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        Sign in with Google
      </button>

      
    </div>
  );
}
