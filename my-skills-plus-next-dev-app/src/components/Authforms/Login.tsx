"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCookies } from "react-cookie";
import { HandleGetUserByToken, HandleLogin } from "@/services/auth";
import { setLocalStorage } from "@/common/token";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import { useRouter } from "next/navigation";
import Header from "@/components/Header/HomeHeader";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

interface LoginError {
  response: {
    data: string;
  };
}

interface UserData {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  verified:boolean;
}

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie] = useCookies(["iysauth.session-token"]);
  const [submitting, setSubmitting] = useState(false); // New state for tracking submission status
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    if (email === "" || password === "") {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.warn("Please fill all fields");
      return;
    }

    setSubmitting(true); // Set submitting state to true
    const currentExperienceLevel = localStorage.getItem("current_experience_level");
    const formData : any= {
      username: email,
      password: password,
      redirect: false,
      type: "user",
    };
    if (currentExperienceLevel) formData.current_experience_level = JSON.parse(currentExperienceLevel);
    try{
      await HandleLogin(formData)
      .then(async (response: LoginError | any) => {
        if (response.status === 200) {
          setLocalStorage("tokenData", response.data);
          console.log("tokenData", response.data);
          setCookie("iysauth.session-token", response.data, { path: "/" });
          await HandleGetUserByToken()
            .then(async (userRes: UserData | any) => {
              setLocalStorage("loginUserDetail", userRes.data);
              if (userRes.status === 200) {
                console.log("loginUserDetail", userRes.data)
                if(userRes.data.verified==true)
                {
                  toast.success("Login successfully! Redirecting to dashboard...");
                  setTimeout(() => {
                    document.location.href = "/create-skill-profile";
                  }, 3000);
                }
                else {
                  toast.warn("You are not verified. Go to resend verification page...");
                  setTimeout(() => {
                    router.push("/auth/activate-account");
                  }, 3000);
                }
              }
            })
            .catch((error) => {
              toast.error("Error" + error);
            });
        } else if (response?.response?.status === 401) {
          toast.error(response?.response?.data.detail);
        } else {
        }
      })
    }
    catch (error) {
      console.log(error, "signin error");
      toast.error("An error occurred during login.");
    } finally {
      setSubmitting(false); 
    }
  };

  // Google Sign-In handler
  const handleGoogleSuccess = async (credentialResponse: any) => {
    const googleToken = credentialResponse.credential;

    try {
      const res = await fetch("https://api.myskillsplus.com/users/auth/google/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleToken, type: "user" }),
      });

      const data: { access: string; refresh: string } = await res.json();
      console.log("Backend response:", data);

      if (res.status === 200) {
        // Save both access and refresh tokens
        const tokenData = {
          access: data.access,
          refresh: data.refresh,
        };

        setLocalStorage("tokenData", tokenData);
        setCookie("iysauth.session-token", tokenData, { path: "/" });

        // Fetch user data using access token
        await HandleGetUserByToken()
          .then(async (userRes: UserData | any) => {
            setLocalStorage("loginUserDetail", userRes.data);
            if (userRes.status === 200) {
              console.log("loginUserDetail", userRes.data)
              if(userRes.data.verified==true)
              {
                toast.success("Login successfully! Redirecting to dashboard...");
                setTimeout(() => {
                  document.location.href = "/create-skill-profile";
                }, 3000);
              }
              else {
                toast.warn("You are not verified. Go to resend verification page...");
                setTimeout(() => {
                  router.push("/auth/activate-account");
                }, 3000);
              }
            }
        })
      } else {
        toast.error("Google login failed");
      }
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error("Google login failed");
    }
  }; 

  const handleGoogleFailure = () => {
    toast.error("Google Sign-In was unsuccessful.");
  };

  return (
    <>
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
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
              <span className="mb-1.5 block font-medium">Start for free</span>
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign In to MySkillsPlus
              </h2>
              {/* Google Login Component */}
              <div className="w-full mt-6">
                <div className="w-full rounded-lg p-1 transition border border-black dark:border-white">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleFailure}
                    theme="outline"
                    size="large"
                    text="signin_with"
                    logo_alignment="center"
                  />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-center mb-5">
                <div className="h-px w-1/4 bg-stroke dark:bg-strokedark"></div>
                <span className="mx-4 text-base font-medium text-black dark:text-white">
                  or
                </span>
                <div className="h-px w-1/4 bg-stroke dark:bg-strokedark"></div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
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

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />

                    <span
                      className="absolute right-4 top-4 cursor-pointer"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      <MaterialSymbol icon={showPassword ? "visibility" : "visibility_off"} size={24} />
                    </span>
                  </div>
                </div>

                <div className="mb-5">
                  <button
                    type="submit"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                    disabled={submitting} // Disable button while submitting
                  >
                    {submitting ? "Signing you in..." : "Sign In"}
                  </button>
                </div>
                <div className="mt-6 text-center">
                  <p>
                    Don’t have any account?{" "}
                    <Link href="/auth/signup" className="text-primary">
                      Sign Up
                    </Link>
                  </p>
                  <p className="mt-2">
                    <Link href="/auth/forgot-password" className="text-primary underline">
                      Forgot Password?
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
    </>
  );
};

export default Login;
