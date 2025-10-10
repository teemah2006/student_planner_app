/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../utils/firebase';
import toast from 'react-hot-toast';
import { useUserStore } from '../api/stores/useUserStore';
import { signIn } from "next-auth/react";
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useState, useEffect } from 'react';
import { get } from 'http';



    export default async function signUpWithEmail(data: {
        name: string;
        age: string;
        phone: string;
        country: string;
        region: string;
        educationLevel: string;
        grade: string;
        fieldOfStudy?: string;
        email: string;
        password: string;
    }, router: AppRouterInstance) {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );

            const user = userCredential.user;
            await updateProfile(user, {
                displayName: data.name,
            });
           

            // Save additional user data to Firestore
            await setDoc(doc(db, 'accounts', user.uid), {
                uid: user.uid,
                name: data.name,
                age: data.age,
                phone: data.phone,
                country: data.country,
                region: data.region,
                educationLevel: data.educationLevel,
                grade: data.grade,
                fieldOfStudy: data.fieldOfStudy ? data.fieldOfStudy : '',
                email: user.email,
                createdAt: new Date(),
            });

            await signIn("credentials", {
                redirect: false,
                email: user.email,
                password: data.password,
            });

            const { setUser } = useUserStore.getState();

            setUser({
                name: data.name,
                age: data.age,
                phone: data.phone,
                country: data.country,
                region: data.region,
                educationLevel: data.educationLevel,
                grade: data.grade,
                fieldOfStudy: data.fieldOfStudy ? data.fieldOfStudy : '',
                email: data.email
            })

            console.log('User created and saved to Firestore!');
            toast.success('Account created successfuly!');
            router.push("/Home")
        } catch (error: any) {
            const errorCode = error.code;

            let errorMessage = "";

            switch (errorCode) {
                case "auth/email-already-in-use":
                    errorMessage = "This email is already registered.";
                    break;
                case "auth/weak-password":
                    errorMessage = "Password must be at least 6 characters.";
                    break;
                case "auth/invalid-email":
                    errorMessage = "Please enter a valid email address.";
                    break;
                default:
                    errorMessage = error.message;
            }

            // Show errorMessage in your UI
            toast.error(errorMessage); // or setError(errorMessage);
        }
    }