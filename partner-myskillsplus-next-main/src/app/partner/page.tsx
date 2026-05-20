"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  partnerType: string;
  otherPartnerType: string;
  channelName: string;
  preferredReferralCode: string;
  country: string;
  briefBio: string;
  website: string;
  password: string;
  confirmPassword: string;
}

export default function Home() {
  const router = useRouter();
  const statusMessageRef = useRef<HTMLDivElement>(null);
  const formFieldRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    partnerType: "",
    otherPartnerType: "",
    channelName: "",
    preferredReferralCode: "",
    country: "",
    briefBio: "",
    website: "",
    password: "",
    confirmPassword: ""
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

  // Scroll to first error field
  useEffect(() => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      const firstErrorField = errorKeys[0];
      const fieldRef = formFieldRefs.current[firstErrorField];
      if (fieldRef) {
        fieldRef.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
  }, [errors]);

  // Scroll to success message
  useEffect(() => {
    if (statusMessage?.type === 'success' && statusMessageRef.current) {
      statusMessageRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [statusMessage]);

  const setFieldRef = (fieldName: string) => (ref: HTMLDivElement | null) => {
    formFieldRefs.current[fieldName] = ref;
  };

  const partnerTypes = [
    "Training Provider",
    "Recruitment Services",
    "University / Campus",
    "HR Consultant",
    "Others"
  ];

  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia",
    "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin",
    "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
    "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia",
    "Comoros", "Congo (Brazzaville)", "Congo (Kinshasa)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
    "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea",
    "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany",
    "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary",
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", "Laos", "Latvia",
    "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi",
    "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
    "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
    "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan",
    "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
    "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa",
    "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone",
    "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain",
    "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand",
    "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda",
    "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu",
    "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email)) newErrors.email = "Email address is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.partnerType) newErrors.partnerType = "Partner type is required";
    if (formData.partnerType === "Others" && !formData.otherPartnerType.trim()) {
      newErrors.otherPartnerType = "Please specify partner type";
    }
    if (!formData.country) newErrors.country = "Country is required";

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

    const payload = {
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      confirm_password: formData.confirmPassword,
      phone: formData.phone,
      partner_type:
        formData.partnerType === "Others" ? formData.otherPartnerType : formData.partnerType,
      channel_name: formData.channelName,
      website_link: formData.website,
      bio: formData.briefBio,
      country: formData.country,
      preferred_referral_code: formData.preferredReferralCode
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/partner/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        setStatusMessage({ type: "error", text: errorData.detail || "Unknown error occurred." });
      } else {
        const data = await response.json();
        setStatusMessage({ type: "success", text: "Application submitted successfully!" });
        resetForm();
      }
    } catch (err) {
      console.error("Submission error:", err);
      setStatusMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      partnerType: "",
      otherPartnerType: "",
      channelName: "",
      preferredReferralCode: "",
      country: "",
      briefBio: "",
      website: "",
      password: "",
      confirmPassword: ""
    });
    setErrors({});
    // Keep statusMessage for user to see
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-[#212121] text-center mb-8">
            Become a MySkillsPlus Partner
          </h1>

          {/* Status Message */}
          {statusMessage && (
            <div
              ref={statusMessageRef}
              className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
                statusMessage.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-[#FFCDD2] text-[#C62828]"
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-black">
            <InputField 
              id="fullName" 
              label="Full Name *" 
              value={formData.fullName} 
              onChange={handleInputChange} 
              error={errors.fullName}
              ref={setFieldRef("fullName")}
            />
            <InputField 
              id="email" 
              type="email" 
              label="Email Address *" 
              value={formData.email} 
              onChange={handleInputChange} 
              error={errors.email}
              ref={setFieldRef("email")}
            />
            <InputField 
              id="password" 
              type="password" 
              label="Password *" 
              value={formData.password} 
              onChange={handleInputChange} 
              error={errors.password}
              ref={setFieldRef("password")}
            />
            <InputField 
              id="confirmPassword" 
              type="password" 
              label="Confirm Password *" 
              value={formData.confirmPassword} 
              onChange={handleInputChange} 
              error={errors.confirmPassword}
              ref={setFieldRef("confirmPassword")}
            />
            <InputField 
              id="phone" 
              label="Mobile Number" 
              value={formData.phone} 
              onChange={handleInputChange}
              ref={setFieldRef("phone")}
            />
            <SelectField 
              id="partnerType" 
              label="Partner Type *" 
              value={formData.partnerType} 
              onChange={handleInputChange} 
              options={partnerTypes} 
              error={errors.partnerType}
              ref={setFieldRef("partnerType")}
            />
            {formData.partnerType === "Others" && (
              <InputField 
                id="otherPartnerType" 
                label="Please Specify *" 
                value={formData.otherPartnerType} 
                onChange={handleInputChange} 
                error={errors.otherPartnerType}
                ref={setFieldRef("otherPartnerType")}
              />
            )}
            <InputField 
              id="channelName" 
              label="Channel/Group/Company Name" 
              value={formData.channelName} 
              onChange={handleInputChange}
              ref={setFieldRef("channelName")}
            />
            <InputField 
              id="preferredReferralCode" 
              label="Preferred Referral Code" 
              value={formData.preferredReferralCode} 
              onChange={handleInputChange}
              ref={setFieldRef("preferredReferralCode")}
            />
            <SelectField 
              id="country" 
              label="Country *" 
              value={formData.country} 
              onChange={handleInputChange} 
              options={countries} 
              error={errors.country}
              ref={setFieldRef("country")}
            />

            <div ref={setFieldRef("briefBio")}>
              <label htmlFor="briefBio" className="block text-sm font-medium text-[#616161] mb-2">
                Brief Bio or Motivation
              </label>
              <textarea
                id="briefBio"
                name="briefBio"
                value={formData.briefBio}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell us about yourself and your motivation to become a partner"
              />
            </div>

            <InputField 
              id="website" 
              label="Website" 
              type="url" 
              value={formData.website} 
              onChange={handleInputChange}
              ref={setFieldRef("website")}
            />

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="gdprConsent"
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-[#E0E0E0] rounded"
                required
              />
              <label htmlFor="gdprConsent" className="text-sm text-[#616161]">
                I consent to storing and using my data for partner program purposes, in accordance with the privacy policy.
              </label>
            </div>

            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-[#E0E0E0] text-[#616161] rounded-lg hover:bg-[#FAFAFA] focus:ring-2 focus:ring-blue-500"
              >
                Reset Form
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 flex items-center justify-center gap-2 ${
                  isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                } text-white rounded-lg focus:ring-2 focus:ring-blue-500`}
              >
                {isSubmitting && (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                )}
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#757575]">
            Already have an account?{" "}
            <Link 
              href="/partner/login" 
              className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Reusable InputField with ref forwarding
const InputField = React.forwardRef<HTMLDivElement, {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
}>(({ id, label, value, onChange, error, type = "text" }, ref) => (
  <div ref={ref}>
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
));

InputField.displayName = 'InputField';

// Reusable SelectField with ref forwarding
const SelectField = React.forwardRef<HTMLDivElement, {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  error?: string;
}>(({ id, label, value, onChange, options, error }, ref) => (
  <div ref={ref}>
    <label htmlFor={id} className="block text-sm font-medium text-[#616161] mb-2">
      {label}
    </label>
    <div className="relative">
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none ${
          error ? "border-[#F44336]" : "border-[#E0E0E0]"
        }`}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-[#BDBDBD] pointer-events-none" />
    </div>
    {error && <p className="text-[#F44336] text-sm mt-1">{error}</p>}
  </div>
));

SelectField.displayName = 'SelectField';




