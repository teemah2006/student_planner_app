"use client";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { useEffect, useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import signUpWithEmail from "./createUser";
import Signin from "./signin";
type FormValues = {
  name: string;
  age: string;
  phone: string;
  country: string;
  region: string;
  educationLevel: string;
  grade: string;
  email: string;
  password: string;
};

export default function AuthPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [newAccount, setNewAccount] = useState(true)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormValues>();

  const educationLevel = watch("educationLevel");

  const primaryGrades = ["Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6"];
  const secondaryGrades = ["JSS1 / Grade 7", "JSS2 / Grade 8", "SS1 / Grade 10", "SS2 / Grade 11", "SS3 / Grade 12"];
  const tertiaryGrades = ["100 Level", "200 Level", "300 Level", "400 Level", "Postgraduate"];

  const educationLevels = [
    "Primary / Elementary School",
    "Secondary / High School",
    "Tertiary / University / College",
    "Other"
  ];

  useEffect(() => {
    if (session) router.push("/Home");
  }, [session, router]);

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    signUpWithEmail(data,router)
    // You can send this data to Firebase or your backend
  };

  const changeView = () =>{
    setNewAccount(!newAccount)
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-black">
          Welcome to <span className="text-blue-700">Study</span>
          <span className="text-yellow-500">Ease</span>
        </h1>
        <p className="mb-6 text-gray-600">Sign up to continue</p>

        {
          newAccount? 
        
        <div className="signup_methods flex flex-col items-center bg-gray-100 rounded-lg">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="fieldset bg-transparent text-black md:w-sm lg:w-lg w-xs p-4 space-y-4"
          >
            {/* Name */}
            <div>
              <label className="label">Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                className="input w-full"
                placeholder="John Doe"
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
                  setRegion(""); // reset region when country changes
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

            {/* Password */}
            <div>
              <label className="label">Set Password</label>
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

            {/* Submit */}
            <button type="submit" className="btn btn-primary w-full">
              Sign Up
            </button>
          </form>

          <div className="text-blue-800 p-2 text-right w-full m-2">
            Have an account?{" "}
            <button onClick={()=>changeView()} className="link link-hover font-semibold">
              Sign in
            </button>
          </div>
        </div>
      : <Signin show={changeView}/>}
      </div>
    );
  }

  return null;
}
