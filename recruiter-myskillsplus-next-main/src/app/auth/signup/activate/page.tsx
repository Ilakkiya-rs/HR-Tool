"use client";
import React from "react";
import Link from "next/link";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-material-symbols/rounded";
import Header from "@/components/Header/HomeHeader";
import Image from "next/image";

const ActivationSuccessPage = () => {

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
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Successfully Activated Your Account
              </h2>
              <div className="mt-6 text-center">
                <Link href="/auth/signin" className="text-base px-4 py-2 font-medium text-white dark:text-gray-300 bg-primary dark:bg-gray-600 rounded-lg dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-white border border-white">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
  
export default ActivationSuccessPage;
