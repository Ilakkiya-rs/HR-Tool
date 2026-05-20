"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface VerificationForm {
  email: string;
  code: string;
}

export default function EmailVerificationPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<VerificationForm>({
    email: "",
    code: ""
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.code.trim()) newErrors.code = "Verification code is required";

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/partner/verify-email/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setStatusMessage({ type: "error", text: data.detail || "Verification failed." });
      } else {
        setStatusMessage({ type: "success", text: "Email successfully verified!" });
        setTimeout(() => router.push("/partner/login"), 2000); // Optional redirect
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
        <h2 className="text-2xl font-bold text-center text-[#424242] mb-6">
          Email Verification
        </h2>

        {statusMessage && (
          <div
            className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
              statusMessage.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-[#FFCDD2] text-[#C62828]"
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            id="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
          />
          <InputField
            id="code"
            type="text"
            label="Verification Code"
            value={formData.code}
            onChange={handleInputChange}
            error={errors.code}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 text-white rounded-lg ${
              isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } focus:ring-2 focus:ring-blue-500`}
          >
            {isSubmitting ? "Verifying..." : "Verify Email"}
          </button>
        </form>
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
