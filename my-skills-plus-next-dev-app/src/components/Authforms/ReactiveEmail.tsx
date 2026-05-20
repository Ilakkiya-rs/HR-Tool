"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-material-symbols/rounded";
import Header from "@/components/Header/HomeHeader";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

const ActivateAccount = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResendClick = async () => {
    setLoading(true);
    try {
      const response = await axios.post("https://api.myskillsplus.com/users/api/resend-verification-email/", {
        email: email,
      });

      if (response.status === 200) {
        toast.success("Activation email resent successfully!");
        setTimeout(() => {
          router.push("/auth/signup/activation-message");
        }, 3000);
      } else {
        toast.error(response.data.detail);
      }
    } catch (error) {
      toast.error("An error occurred while resending the activation email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    
      <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none print:hidden">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link className="block flex-shrink-0" href="/">
            <img
              width={32}
              height={32}
              src={"/images/logo/myskillspluslogo.png"}
              alt="Logo"
            />
          </Link>
          <b className="text-xl">My Skills Plus</b>
        </div>
      </div>
      </header>

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
              <h2 className="mb-8 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 text-center">
                Your Account was not activated
              </h2>
              <span className="mb-2 block font-medium text-center">To check your register mail, To activate your account</span>
              <span className="block font-medium text-center">(OR)</span>
              <span className="mb-12 block font-medium text-center">Click here to Resend, to resend it</span>
              
              <div className="mb-6 text-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="text-base px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div className="text-center">
                <button
                  onClick={handleResendClick}
                  disabled={loading}
                  className="text-base px-4 py-2 font-medium text-white dark:text-gray-300 bg-primary dark:bg-gray-600 rounded-lg dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-white border border-white"
                >
                  {loading ? "Resending..." : "Resend"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActivateAccount;
