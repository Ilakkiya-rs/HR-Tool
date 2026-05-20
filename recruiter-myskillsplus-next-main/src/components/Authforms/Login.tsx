"use client";
import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const contactId = params.get("contactId");
    if (contactId) {
      localStorage.setItem("contactId", contactId);
    }
  }, []);

  const afterLoginProcess = async () => {
    const skills = JSON.parse(localStorage.getItem("jobSkills") || "[]");
    const jobTitle = localStorage.getItem("jobTitle");
    const shortlistedProfiles = JSON.parse(localStorage.getItem("shortlistedProfiles") || "[]");
    const findMatchRequest = JSON.parse(localStorage.getItem("findMatchRequest") || "{}");
    const matchingProfiles = JSON.parse(localStorage.getItem("matchingProfiles") || "[]");
    const contactId = localStorage.getItem("contactId");
  
    const userData = localStorage.getItem("logedinUserDetail");
  
    if (!userData) return;
    const user = JSON.parse(userData);

    if (contactId) {
      console.log("Handling contactId:", contactId);
      try {
        // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/individual-profile-details/${contactId}/`);
        const res = await fetch(`https://api.myskillsplus.com/users/individual-profile-details/${contactId}/`);
        if (!res.ok) throw new Error("Failed to fetch contact details");
  
        const contactDetails = await res.json();

        const savePayload = {
          user_id: user.individual_profile_id,
          contact_id: contactId,
          contactDetails: {
            user_id: contactDetails.individual_profile_id,
            vsp_details: contactDetails.vsp_details,
            pbp_is_paid: false,
            pbp_msg_status: null,
            pcp_is_paid: false,
            pcp_msg_status: null
          }
        };
  
        // const saveRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/api/save-direct-contact/`, {
        const saveRes = await fetch("https://api.myskillsplus.com/users/api/save-direct-contact/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(savePayload),
        });
  
        if (!saveRes.ok) throw new Error("Failed to save direct contact");
        console.log("✅ Contact details saved successfully");
  
        localStorage.removeItem("contactId");
        window.location.href = '/direct-contact';
      } catch (err) {
        console.error("❌ Error handling contactId:", err);
      }
    }

    if (!jobTitle || !skills.length || !shortlistedProfiles.length) return;

    if (skills.length > 0 && jobTitle) {
      const payload = {
        job_title: jobTitle,
        user_id: `${user.individual_profile_id}`,
        user_name: `${user.first_name} ${user.last_name}`,
        user_email: user.email,
        userRatedSkills: skills,
      };
  
      try {
        // const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/save-job-profile/`, {
        const response = await fetch("https://api.myskillsplus.com/save-job-profile/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
  
        if (!response.ok) {
          console.error("Job creation failed");
          return;
        }
        const data = await response.json();

        const onload = {
          user_id: `${user.individual_profile_id}`,
          job_id: `${data.job_id}`,
          job_title: `${data.job_title}`,
          findMatch: findMatchRequest,
          matched_profiles: matchingProfiles,
          shortlisted_profiles: shortlistedProfiles,
        };
      
        // const shortlist = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/shortlist-profiles/`, {
        const shortlist = await fetch("https://api.myskillsplus.com/shortlist-profiles/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(onload),
        });
      
        if (!shortlist.ok) throw new Error("Shortlist failed");
        alert("Profiles shortlisted successfully");

        localStorage.removeItem("jobTitle");
        localStorage.removeItem("jobSkills");
        localStorage.removeItem("shortlistedProfiles");
        localStorage.removeItem("findMatchRequest");
        localStorage.removeItem("matchingProfiles");    

        window.location.href = `/job-skill-profile?viewMatches=true&jobId=${data.job_id}`;
      } catch (err) {
        console.error("Error saving job after login:", err);
      }
    }
    else{
      console.log("No skills or job title found in local storage");
      window.location.href = "/job-skill-profile";
    }
  };  
  
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.warn("Please fill all fields");
      return;
    }

    setSubmitting(true); // Set submitting state to true

    const formData = {
      username: email,
      password: password,
      redirect: false,
      type: "recruiter",
    };

    try{
      await HandleLogin(formData)
      .then(async (response: LoginError | any) => {
        if (response.status === 200) {
          setLocalStorage("tokenData", response.data);
          console.log("tokenData", response.data);
          setCookie("iysauth.session-token", response.data, { path: "/" });
          await HandleGetUserByToken()
            .then(async (userRes: UserData | any) => {
              setLocalStorage("logedinUserDetail", userRes.data);
              if (userRes.status === 200) {
                console.log("logedinUserDetail", userRes.data)
                if(userRes.data.verified==true)
                {
                  toast.success("Login successfully! Redirecting to dashboard...");
                  const userId = userRes.data.id;
                  const jobTitle = localStorage.getItem("jobTitle");
                  const jobSkills = localStorage.getItem("jobSkills");
                  const shortlistedProfiles = localStorage.getItem("shortlistedProfiles");
                  const contactId = localStorage.getItem("contactId");

                  if (jobTitle && jobSkills && shortlistedProfiles || contactId) {
                    afterLoginProcess();
                  } 
                  else {
                    setTimeout(() => {
                      // document.location.href = "/job-skill-profile";
                      document.location.href = "/";
                    }, 3000);
                  }
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
        } else if (response?.response?.status === 400) {
          const errMsg = `Are you sure you have created an account / signed up on "job.myskillsplus.com"?
              Note: This site requires a separate sign-up / account creation.`;
          toast.warn(errMsg);
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
      // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/auth/google/`, {
      const res = await fetch("https://api.myskillsplus.com/users/auth/google/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleToken, type: "recruiter" }),
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
            setLocalStorage("logedinUserDetail", userRes.data);
            if (userRes.status === 200) {
              console.log("logedinUserDetail", userRes.data)
              if(userRes.data.verified==true)
              {
                toast.success("Login successfully! Redirecting to dashboard...");
                const userId = userRes.data.id;
                const jobTitle = localStorage.getItem("jobTitle");
                const jobSkills = localStorage.getItem("jobSkills");
                const shortlistedProfiles = localStorage.getItem("shortlistedProfiles");
                const contactId = localStorage.getItem("contactId");

                if (jobTitle && jobSkills && shortlistedProfiles || contactId) {
                  afterLoginProcess();
                } 
                else {
                  setTimeout(() => {
                    // document.location.href = "/job-skill-profile";
                    document.location.href = "/";
                  }, 3000);
                }
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

                <div className="mt-6 flex items-center justify-center mb-5">
                  <div className="h-px w-1/4 bg-stroke dark:bg-strokedark"></div>
                  <span className="mx-4 text-base font-medium text-black dark:text-white">
                    or
                  </span>
                  <div className="h-px w-1/4 bg-stroke dark:bg-strokedark"></div>
                </div>
                {/* Google Login Component */}
                <div className="flex justify-center mt-6">
                  <div className="rounded-lg p-1 transition">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleFailure}
                      theme="outline"
                      size="large"
                      text="signin_with"
                    />
                  </div>
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
