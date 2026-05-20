"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HandleResetPassword } from "@/services/auth";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import Header from "@/components/Header/HomeHeader";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    if (email === "" || newPassword === "" || confirmPassword === "") {
      return false;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
  
    if (!validate()) {
      toast.warn("Please fill all fields correctly.");
      return;
    }
  
    setSubmitting(true);
  
    const formData = {
      email,
      new_password: newPassword,
    };
  
    try {
        const response = await HandleResetPassword(formData);      
        if (response && response.status === 200) {
          toast.success("Password reset successfully! Redirecting to login...");
          setTimeout(() => {
            document.location.href = "/auth/signin";
          }, 3000);
        } else {
          toast.error("User with this email does not exist.");
        }
    }
    catch (error) {
        toast.error("An error occurred while resetting the password.");
    }      
    finally {
      setSubmitting(false);
    }
  };
  

  return (
    <>
      <Header sidebarOpen={false} />

      <ToastContainer />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
            <div className="hidden w-full xl:block xl:w-1/2">
                <div className="px-26 py-17.5 text-center">
                <Link className="mb-5.5 inline-block" href="/">
                    <Image
                    src={"/images/Infographic-10.svg"}
                    alt="Logo"
                    width={100}
                    height={32}
                    style={{ width: "100%" }}
                    />
                </Link>
                </div>
            </div>

            <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
                <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                    <h2 className="mb-8 text-3xl font-semibold text-black dark:text-white">
                    Reset Password
                    </h2>

                    <form onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div className="mb-4">
                        <label className="mb-2 block font-medium text-black dark:text-white">
                        Email
                        </label>
                        <div className="relative">
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <span className="absolute right-4 top-4">
                            <MaterialSymbol icon="email" size={24} />
                        </span>
                        </div>
                    </div>

                    {/* New Password Input */}
                    <div className="mb-4">
                        <label className="mb-2 block font-medium text-black dark:text-white">
                        New Password
                        </label>
                        <div className="relative">
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="Enter new password"
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <span className="absolute right-4 top-4">
                            <MaterialSymbol icon="key" size={24} />
                        </span>
                        </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="mb-6">
                        <label className="mb-2 block font-medium text-black dark:text-white">
                        Confirm Password
                        </label>
                        <div className="relative">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm new password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <span className="absolute right-4 top-4">
                            <MaterialSymbol icon="key" size={24} />
                        </span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mb-5">
                        <button
                        type="submit"
                        className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                        disabled={submitting}
                        >
                        {submitting ? "Resetting..." : "Reset Password"}
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="mt-2">
                        <Link href="/auth/signin" className="text-primary underline">
                            Back to Sign In
                        </Link>
                        </p>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    </>
  );
};

export default ForgotPassword;