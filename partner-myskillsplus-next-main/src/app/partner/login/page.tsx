"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LoginForm {
  username: string;
  password: string;
}

export default function PartnerLoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginForm>({
    username: "",
    password: ""
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("partnerToken");
    if (token) {
      router.push("/partner/dashboard");
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/partner/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatusMessage({ type: "error", text: data.detail || "Login failed." });
      } else {
        localStorage.setItem("partnerToken", data.access_token);
        localStorage.setItem("partnerId",data.partner_id);
        setStatusMessage({ type: "success", text: "Login successful!" });
        router.push("/partner/dashboard");
      }
    } catch (err) {
      setStatusMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-[#424242] mb-6">Partner Login</h2>

        {statusMessage && (
          <div
            className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
              statusMessage.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-[#f69697] text-[#D32F2F]"
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            id="username"
            type="text"
            label="Username"
            value={formData.username}
            onChange={handleInputChange}
            error={errors.username}
          />
          <InputField
            id="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 text-white rounded-lg ${
              isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } focus:ring-2 focus:ring-blue-500`}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Signup Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#757575]">
            Don't have an account?{" "}
            <Link 
              href="/partner" 
              className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const InputField = ({
  id,
  label,
  value,
  onChange,
  error,
  type = "text"
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-[#616161] mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
        error ? "border-[#F44336]" : "border-[#E0E0E0]"
      }`}
      placeholder={label}
    />
    {error && <p className="text-[#F44336] text-sm mt-1">{error}</p>}
  </div>
);