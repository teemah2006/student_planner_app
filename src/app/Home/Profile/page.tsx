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
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";

type FormValues = {
  name: string;
  age: string;
  phone: string;
  country: string;
  region: string;
  educationLevel: string;
  grade: string;
  fieldOfStudy?: string;
  email: string;
  profileUrl?: string;
};

export default function ProfilePage() {
  const { user, updateUser } = useUserStore();
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [country, setCountry] = useState(user?.country || "");
  const [region, setRegion] = useState(user?.region || "");
  const User = auth.currentUser;
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: user ? user : {} // <-- set initial values from user
  });

  useEffect(() => {
    // If user changes (e.g. after update), reset form values
    reset(user ? user : {});
    setCountry(user?.country || "");
    setRegion(user?.region || "");
  }, [user, reset]);

  const educationLevel = watch("educationLevel");

  const primaryGrades = ["Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6"];
  const secondaryGrades = ["JSS1 / Grade 7", "JSS2 / Grade 8", "JSS3 / Grade 9", "SS1 / Grade 10", "SS2 / Grade 11", "SS3 / Grade 12"];
  const tertiaryGrades = ["100 Level", "200 Level", "300 Level", "400 Level", "500 Level", "600 Level", "Postgraduate"];

  const educationLevels = [
    "Primary / Elementary School",
    "Secondary / High School",
    "Tertiary / University / College",
    "Other"
  ];

  const tertiaryFields = [
    "Engineering",
    "Medicine",
    "Accounting",
    "Law",
    "Computer Science",
    "Business Administration",
    "Education",
    "Agriculture",
    "Arts",
    "Sciences",
    "Social Sciences",
    "Other"
  ];
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/authentication");
    }
  }, [status, router]);



  const saveChanges = async (data: FormValues) => {
    if (!User) {
      toast.error("User not authenticated");
      return;
    }
    setSaving(true);
    if (data.educationLevel !== "Tertiary / University / College" && data.fieldOfStudy) {
      delete (data as { fieldOfStudy?: string }).fieldOfStudy; // remove fieldOfStudy if not tertiary
    }

    const userRef = doc(db, 'accounts', User.uid);
    try {
      await updateDoc(userRef,
        { ...data }
      )
      updateUser(data); // update Zustand store
      toast.success('Profile updated successfully!')


    } catch (err) {
      console.log(err)
      toast.error('couldnt save changes. Try again')
    }
    setSaving(false);
    setEditMode(false);
  };

  // console.log(user)

  return (
    <div className="flex justify-center w-full py-2 bg-blue-50 min-h-screen">
      <Card className="w-full max-w-2xl shadow-lg border-blue-300">
        <CardHeader className="bg-blue-600 text-white rounded-t-xl">
          <CardTitle className="text-xl font-semibold">
            User Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 mt-4">
          {editMode ? (
            <form
              onSubmit={handleSubmit(saveChanges)}
              className="fieldset bg-transparent text-black md:w-sm lg:w-lg w-xs p-4 space-y-4"
            >
              {/* Name */}
              <div>
                <label className="label">Name</label>
                <Input
                  {...register("name", { required: "Name is required" })}
                  className="input w-full"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              {/* Age */}
              <div>
                <label className="label">Age</label>
                <select {...register("age", { required: "Age is required" })} className="select w-full">
                  <option value="">Pick age range</option>
                  <option>10-12</option>
                  <option>13-15</option>
                  <option>16-18</option>
                  <option>18-20</option>
                  <option>older</option>
                </select>
                {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="label">Phone</label>
                <PhoneInput
                  country={"ng"}
                  value={watch("phone")}
                  onChange={(value) => setValue("phone", value)}
                  inputClass="w-full"
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
              </div>

              {/* Country */}
              <div>
                <label className="label">Country</label>
                <CountryDropdown
                  value={country}
                  onChange={(val) => {
                    setCountry(val);
                    setValue("country", val);
                    setRegion("");
                    setValue("region", "");
                  }}
                  className="select w-full"
                />
                {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
              </div>

              {/* Region */}
              <div>
                <label className="label">Region</label>
                <RegionDropdown
                  country={country}
                  value={region}
                  onChange={(val) => {
                    setRegion(val);
                    setValue("region", val);
                  }}
                  className="select w-full"
                />
                {errors.region && <p className="text-red-500 text-sm">{errors.region.message}</p>}
              </div>

              {/* Education Level */}
              <div>
                <label className="label">Education Level</label>
                <select
                  {...register("educationLevel", { required: "Education level is required" })}
                  className="select w-full"
                >
                  <option value="" disabled>Select Education level</option>
                  {educationLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                {errors.educationLevel && <p className="text-red-500 text-sm">{errors.educationLevel.message}</p>}
              </div>

              {/* Study Field for Tertiary */}
              {educationLevel === "Tertiary / University / College" && (
                <div>
                  <label className="label">Field of Study</label>
                  <select {...register("fieldOfStudy", { required: "Field of Study is required" })}
                    className="select w-full"
                  >
                    <option value="">Select Field of Study</option>
                    {tertiaryFields.map(field => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </select>
                  {errors.fieldOfStudy && <p className="text-red-500 text-sm">{errors.fieldOfStudy.message}</p>}
                </div>
              )}

              {/* Grade */}
              <div>
                <label className="label">Grade</label>
                <select {...register("grade", { required: "Grade is required" })} className="select w-full">
                  <option value="" disabled>Select Class / Grade</option>
                  {educationLevel === "Primary / Elementary School" &&
                    primaryGrades.map((grade) => <option key={grade}>{grade}</option>)}
                  {educationLevel === "Secondary / High School" &&
                    secondaryGrades.map((grade) => <option key={grade}>{grade}</option>)}
                  {educationLevel === "Tertiary / University / College" &&
                    tertiaryGrades.map((grade) => <option key={grade}>{grade}</option>)}
                </select>
                {errors.grade && <p className="text-red-500 text-sm">{errors.grade.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="label">Email</label>
                <Input
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

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:cursor-wait"
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
              </div>
            </form>
          ) : (
            // Render static profile info in view mode
            <>
              {Object.entries(user || {}).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-400 capitalize">
                    {key}
                  </label>
                  <p className="text-gray-800">{value || "-"}</p>
                </div>
              ))}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                >
                  Edit Profile
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
