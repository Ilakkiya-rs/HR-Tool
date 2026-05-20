"use client";

import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import ErrorDialog from "../../../_components/ErrorDialog";
import Loader from "../../../_components/Loader";
import ResumeInterview from "../../../_components/ResumeInterview";
import EmailVerification from "../../../_components/EmailVerification";
import TermsAndConditions from "../../../_components/TermsAndConditions";

export default function Verify() {

  const { token } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("")
  const [type, setType] = useState('success');
  const [mode, setMode] = useState("form")

  const handleInputChange = (e) => {
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
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.name.trim()) newErrors.name = "Name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    if (!token) return;

    if (!validateForm()) {
      setIsProcessing(false);
      return;
    }

    try {
      const response = await fetch(`https://api.myskillsplus.com/interview-link/${token}/`, {
      // const response = await fetch(`http://127.0.0.1:8000/interview-link/${token}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error);
        setType('error')
        setIsProcessing(false)
      } else {
        setMessage(data.message)
        setType('success')
        setIsProcessing(false)
        setTimeout(() => {
          if(data){
            setMode(data.phase)
          } 
        }, 2000);
      }
    } catch (err) {
      setMessage("An error occured. Please try again....");
      setType('error')
    } finally {
      setIsProcessing(false)
    }
  };

  if(mode === "form"){
    return (
      <div className="w-screen min-h-screen flex items-center justify-center bg-[#FAFAFA] py-12">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center text-[#424242] mb-6">
            Enter Your Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#616161] mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? "border-[#F44336]" : "border-[#E0E0E0]"
                  }`}
                placeholder="Enter Name"
              />
              {errors.name && <p className="text-[#F44336] text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#616161] mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? "border-[#F44336]" : "border-[#E0E0E0]"
                  }`}
                placeholder="Enter Email"
              />
              {errors.email && <p className="text-[#F44336] text-sm mt-1">{errors.email}</p>}
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-2 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white font-bold text-xl rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 focus:ring-2 focus:ring-blue-500 hover:cursor-pointer`}
            >
              {isProcessing ? "Submitting..." : "Submit"}
            </button>
          </form>
          <Loader isLoading={isProcessing}/>
          <ErrorDialog message={message} type={type} onClose={() => setMessage('')} />
        </div>
      </div>
    );
  }

  if(mode === "start"){
    return <EmailVerification  token={token}/>
  }

  if(mode === "resume"){
    return <ResumeInterview  token={token} email={formData.email} name={formData.name}/>
  }

  if(mode=== "continue"){
    return <TermsAndConditions token={token} email={formData.email}/>
  }

}