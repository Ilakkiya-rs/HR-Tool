"use client";
import React, { SyntheticEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HandleRegister } from "@/services/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import Header from "@/components/Header/HomeHeader";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { HandleGetUserByToken } from "@/services/auth";
import { setLocalStorage } from "@/common/token";
import { useCookies } from "react-cookie";

interface RegisterError {
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

const Register = () => {
  const [fname, setfname] = useState("");
  const [lname, setlname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const router = useRouter();
  const validate = () => {
    if (
      fname === "" ||
      lname === "" ||
      email === "" ||
      password === ""
      // phoneNumber === ""
    ) {
      return false;
    }
    return true;
  };
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasMinLength: false,
  });
  const [cookies, setCookie] = useCookies(["iysauth.session-token"]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.warn("Please fill all fields");
      return;
    }
    const isPasswordValid =
    passwordValidation.hasUppercase &&
    passwordValidation.hasLowercase &&
    passwordValidation.hasNumber &&
    passwordValidation.hasMinLength;

    if (!isPasswordValid) {
      toast.warn("Password does not meet all requirements.");
      return;
    }
    const reqData = {
      first_name: fname,
      last_name: lname,
      email: email,
      password: password,
      // phone_number: phoneNumber,
      type: "recruiter",
    };
    await HandleRegister(reqData).then((response: RegisterError | any) => {
      if (response && response.status === 201) {
        // toast.success("Registered successfully! Redirecting to login page...");
        // setTimeout(() => {
        //   router.push("/auth/signin");
        // }, 3000);
        router.push("/auth/signup/activation-message");
      } else {
        Object.keys(response.response.data).forEach((field: string) => {
          const errors = response.response.data[field];
          errors.forEach((error: string) => {
            toast.error(`${field.toUpperCase()}: ${error}`);
          });
        });
      }
    });
  };

  // Google Sign-Up handler
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
            setLocalStorage("loginUserDetail", userRes.data);
            if (userRes.status === 200) {
              console.log("loginUserDetail", userRes.data)
              if(userRes.data.verified==true)
              {
                toast.success("Login successfully! Redirecting to dashboard...");
                setTimeout(() => {
                  document.location.href = "/";
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
        {/* {modalIsOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md w-96">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Activation Link Sent</h3>
                <p className="text-gray-600 dark:text-gray-300">Activation link has been sent to your email. Please activate your account.</p>
                <div className="mt-6 flex justify-end">
                  <button onClick={() => setModalIsOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 border border-black">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )} */}
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
                  Sign Up to MySkillsPlus
                </h2>
                {/* Google SignUp Component */}
                <div className="w-full mt-6">
                  <div className="w-full rounded-lg p-1 transition border border-black dark:border-white">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleFailure}
                      theme="outline"
                      size="large"
                      text="signup_with"
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
                <form>
                  <div className="flex flex-col gap-4 md:flex-row">
                    <div className="mb-4 w-full lg:w-1/2">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        First Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="first_name"
                          placeholder="First Name"
                          onChange={(e) => setfname(e.target.value)}
                          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />

                        <span className="absolute right-4 top-4">
                          <MaterialSymbol icon="person" size={24} />
                        </span>
                      </div>
                    </div>
                    <div className="mb-4 w-full lg:w-1/2">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Last Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="last_name"
                          placeholder="Last Name"
                          onChange={(e) => setlname(e.target.value)}
                          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />

                        <span className="absolute right-4 top-4">
                          <MaterialSymbol icon="person" size={24} />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />

                      <span className="absolute right-4 top-4">
                        <MaterialSymbol icon="email" size={24} />
                      </span>
                    </div>
                  </div>

                  {/* <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <PhoneInput
                        placeholder="Enter phone number"
                        value={phoneNumber}
                        onChange={(value) => setPhoneNumber(value)}
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <span className="absolute right-4 top-4">
                        <MaterialSymbol icon="phone" size={24} />
                      </span>
                    </div>
                  </div> */}

                  <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        onChange={(e) => {
                          const val = e.target.value;
                          setPassword(val);
                          setPasswordValidation({
                            hasUppercase: /[A-Z]/.test(val),
                            hasLowercase: /[a-z]/.test(val),
                            hasNumber: /[0-9]/.test(val),
                            hasMinLength: val.length >= 8,
                          });
                        }}
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
                  <div>
                    <p className="mt-2 mb-1 text-sm font-medium text-gray-600">Password must contain:</p>
                    <div className="grid grid-cols-2 gap-y-1 gap-x-4 mt-2 text-sm text-[#616161]">
                      <p className={`flex items-center gap-2 ${passwordValidation.hasUppercase ? 'text-green-600' : 'text-[#BDBDBD]'}`}>
                        <span>✓</span> One uppercase character
                      </p>
                      <p className={`flex items-center gap-2 ${passwordValidation.hasLowercase ? 'text-green-600' : 'text-[#BDBDBD]'}`}>
                        <span>✓</span> One lowercase character
                      </p>
                      <p className={`flex items-center gap-2 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-[#BDBDBD]'}`}>
                        <span>✓</span> One numerical character
                      </p>
                      <p className={`flex items-center gap-2 ${passwordValidation.hasMinLength ? 'text-green-600' : 'text-[#BDBDBD]'}`}>
                        <span>✓</span> 8 characters minimum
                      </p>
                    </div>
                  </div>
                  <div className="mb-5 pt-5">
                    <input
                      type="submit"
                      value="Create account"
                      onClick={handleSubmit}
                      className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                    />
                  </div>

                  <div className="mt-6 text-center">
                    <p>
                      Already have an account?{" "}
                      <Link href="/auth/signin" className="text-primary">
                        Sign in
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

export default Register;
