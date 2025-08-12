/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/app/api/stores/useUserStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { doc, updateDoc } from "firebase/firestore";
// import { User, Mail, Phone, Globe, GraduationCap, MapPin } from "lucide-react";
import { db, auth } from "../../../../utils/firebase";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
export default function ProfilePage() {
  const { user, updateUser } =useUserStore();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(user);
  const User = auth.currentUser
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/authentication");
    }
  }, [status, router]);

  if(!formData){
    return(
        <div className="flex h-screen w-full bg-white flex-col items-center justify-center">
  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
  <p className="mt-2 text-gray-500">Loading profile...</p>
</div>
    )
  }


  const handleChange = (e:any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveChanges = async () => {
    if (!User) {
    toast.error("User not authenticated");
    return;
  }
    const userRef = doc(db,'accounts', User.uid );
    try{
        await updateDoc(userRef,
            {...formData}
        )
        updateUser(formData);
        toast.success('Profile updated successfully!')
        
    
    }catch(err){
        console.log(err)
        toast.error('couldnt save changes. Try again')
    }
    setEditMode(false);
  };

  
  return (
    <div className="flex justify-center w-full py-2 bg-blue-50 min-h-screen">
      <Card className="w-full max-w-2xl shadow-lg border-blue-300">
        <CardHeader className="bg-blue-600 text-white rounded-t-xl">
          <CardTitle className="text-xl font-semibold">
            User Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 mt-4">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-400 capitalize">
                {key}
              </label>
              {editMode ? (
                <Input
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-800">{value || "-"}</p>
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            {editMode ? (
              <>
                <Button
                  onClick={saveChanges}
                  className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditMode(false)}
                  className="border-blue-400 text-blue-600 hover:bg-blue-100 cursor-pointer"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setEditMode(true)}
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
