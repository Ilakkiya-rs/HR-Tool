"use client";
import React from "react";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/Header/HomeHeader";
import Image from "next/image";

const FriendsFeedback = () => {
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
                <h1 className="mb-6 text-3xl font-bold text-black dark:text-white">Get Honest Feedback on Your Skills-For Free!</h1>
                <h2 className="mb-4 text-xl">Unlock real insights from the people who know you best.</h2>
                <hr className="mb-4 text-slate-300"></hr>
                <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">Gather feedback from those who matter most:</h2>
                <ul className="mb-6 list-disc pl-5">
                    <li className="text-lg">Invite current and past managers, peers, or team members.</li>
                    <li className="text-lg">It&apos;s anonymous, so you get the honest feedback you deserve.</li>
                </ul>
                <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">Discover how others view your skills:</h2>
                <ul className="mb-6 list-disc pl-5">
                    <li className="text-lg">See how your self-assessment compares to the feedback from your friends and colleagues.</li>
                </ul>
                <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">How it works:</h2>
                <ul className="mb-6 list-disc pl-5">
                    <li className="text-lg">Create your Skills Profile to get started.</li>
                    <li className="text-lg">Then, log in and invite friends or colleagues to share their feedback on your skills.</li>
                </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FriendsFeedback;