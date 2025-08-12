/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FaRegEyeSlash } from "react-icons/fa6";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../utils/firebase";
import { useUserStore } from "../api/stores/useUserStore";
type FormValues = {
    email: string;
    password: string;
}
export default function Signin({ show }: { show: () => void }) {
    const { data: session } = useSession();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormValues>();

    const router = useRouter();
    useEffect(() => {
        if (session) { router.push("/Home") };
    }, [session, router]);


    const handleLogin = async (data: { email: string, password: string }) => {
        setLoading(true);

        const auth = getAuth();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;
            await signIn("credentials", {
                email: user.email,
                password: data.password,
                redirect: false,
            });

            const { setUser } = useUserStore.getState()

            const UserRef = doc(db, 'accounts', user.uid);
            const UserSnap = await getDoc(UserRef);
            if (UserSnap.exists()) {
                const userData = UserSnap.data();
                setUser({
                    name: userData.name,
                    age: userData.age,
                    phone: userData.phone,
                    country: userData.country,
                    region: userData.region,
                    educationLevel: userData.educationLevel,
                    grade: userData.grade,
                    email: userData.email
                })
            }
            console.log("Logged in user:", user);
            router.push('/Home')
            // redirect user or fetch their data from Firestore
        } catch (error: any) {
            const errorCode = error.code;
            console.log(errorCode)

            let errorMessage = "";

            switch (errorCode) {
                case "auth/user-not-found":
                    errorMessage = "No account found with this email.";
                    break;
                case "auth/wrong-password":
                    errorMessage = "Incorrect password. Please try again.";
                    break;
                case "auth/invalid-credential":
                    errorMessage = "Incorrect password or email. Please try again.";
                    break;
                case "auth/invalid-email":
                    errorMessage = "Please enter a valid email address.";
                    break;
                default:
                    errorMessage = "Something went wrong. Please try again later.";
            }

            toast.error(errorMessage);
        }
        setLoading(false)
    };


    const onSubmit = (data: FormValues) => {
        handleLogin(data)
    }


    if (!session) {
        return (
            <div className="flex flex-col items-center bg-gray-100">
                <form onSubmit={handleSubmit(onSubmit)}
                    className="text-black md:w-sm lg:w-lg w-xs p-4 space-y-4">
                    {/* Email */}
                    <div>
                        <label className="label">Email</label>
                        <input
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Invalid email format"
                                }
                            })}
                            className="input w-full"
                            placeholder="mail@site.com"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    {/* password */}
                    <div>
                        <label className="label">Password</label>
                        <label className="input validator w-full flex items-center gap-2">
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                                placeholder="Password"
                                className="w-full"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-500">
                                {showPassword ? <FaRegEyeSlash /> : <MdOutlineRemoveRedEye />}
                            </button>
                        </label>
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    <button type="submit" className="btn w-full btn-primary" disabled={loading}>
                        Login
                    </button>
                </form>
                <div className="text-blue-800 p-2 text-right w-full m-2">
                    Don't have an account?{" "}
                    <button onClick={() => show()} className="link link-hover font-semibold">
                        Create account
                    </button>
                </div>
            </div>
        )
    }

}