"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  const [formData, setFormData] = useState({
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
    const token = localStorage.getItem("adminToken");

    if (token) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/admin/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setStatusMessage({ type: "error", text: errorData.detail || "Login failed" });
      } else {
        const data = await response.json(); 

        // ✅ Store token and username
        localStorage.setItem("adminToken", data.access_token);
        localStorage.setItem("adminUsername", formData.username);

        setStatusMessage({ type: "success", text: "Login successful!" });

        // ✅ Redirect to dashboard
        router.push("/admin/dashboard");
      }
    } catch (err) {
      setStatusMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ username: "", password: "" });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-[#212121] text-center mb-8">
            Admin Login
          </h1>

          {statusMessage && (
            <div
              className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
                statusMessage.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-[#f69697] text-[#D32F2F]"
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              id="username"
              label="Username *"
              value={formData.username}
              onChange={handleInputChange}
              error={errors.username}
            />

            <InputField
              id="password"
              type="password"
              label="Password *"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
            />

            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-[#E0E0E0] text-[#616161] rounded-lg hover:bg-[#FAFAFA] focus:ring-2 focus:ring-blue-500"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white rounded-lg focus:ring-2 focus:ring-blue-500`}
              >
                {isSubmitting && (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                )}
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// InputField component
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
    <label htmlFor={id} className="block text-sm font-medium text-[#616161] mb-2">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
        error ? "border-[#F44336]" : "border-[#E0E0E0]"
      }`}
      placeholder={label}
    />
    {error && <p className="text-[#F44336] text-sm mt-1">{error}</p>}
  </div>
);