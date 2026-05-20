"use client";

import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react'
import ErrorDialog from '../../../components/ErrorDialog';
import Loader from '../../../components/Loader';

export default function Dashboard() {

    const navigate = useNavigate();
    const [recruiterId, setRecruiterId] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState("")
    const [type, setType] = useState('success');
    const [jobDescription, setJobDescription] = useState("");
    const [link, setLink] = useState("");
    const [copied, setCopied] = useState(false);
    const [email, setEmail] = useState("");
    const [emails, setEmails] = useState([]);


    useEffect(() => {
        const fetchDashboard = async () => {
        try {
            const res = await fetch('https://api.myskillsplus.com/jobfit/dashboard/', {
            // const res = await fetch('http://127.0.0.1:8000/jobfit/dashboard/', {
                credentials: "include"
            });

            const data = await res.json();

            if (!res.ok) {
                navigate("/jobfit/login");
                return;
            }
 
            setRecruiterId(data.recruiter_id);

        } catch (err) {
            console.error("Error fetching dashboard:", err);
            navigate("/jobfit/login");
        }
    };
    fetchDashboard();  
    }, [])

    useEffect(() => {
        if (recruiterId !== null) {
            console.log("State Updated...");
        }
    }, [recruiterId]);
    

    const handleLogout = async () => {
        setIsProcessing(true);
        try {
            const response = await fetch('https://api.myskillsplus.com/jobfit/logout/', {
            // const response = await fetch('http://127.0.0.1:8000/jobfit/logout/', {
                method: "POST",
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setType('success')
                setIsProcessing(false)
                navigate("/jobfit/login");
            } else {
                setMessage("Logout failed.");
                setType('error')
                setIsProcessing(false)
            }
        } catch (error) {
            setMessage("An error occured. Please try again....");
            setType('error')
        } finally {
            setIsProcessing(false)
        }
    };


    const handleGenerate = async () => {
        if (!jobDescription.trim()) {
            setMessage("Please enter a job description.");
            setType('error')
            return;
        }

        setIsProcessing(true);
        setMessage("");

        try {
            const response = await fetch('https://api.myskillsplus.com/jobfit/generate/', {
            // const response = await fetch('http://127.0.0.1:8000/jobfit/generate/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", 
                body: JSON.stringify({
                    job_description: jobDescription,
                    recruiter_id: recruiterId,
                    emails: emails
                }),
            });

            const data = await response.json();
            setLink(data.link)

            if (!response.ok) {
                setMessage(data.error);
                setType('error')
            }
        } catch (err) {
            console.error("Error:", err);
            setMessage("Server error. Please try again later.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCopy = async () => {
        if (!link) return; // prevent copying if link is empty

        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const addEmail = () => {
    const trimmed = email.trim();
    if (trimmed && !emails.includes(trimmed)) {
      setEmails([...emails, trimmed]);
      setEmail("");
    }
  };

  const removeEmail = (emailToRemove) => {
    setEmails(emails.filter((e) => e !== emailToRemove));
  };

  if (isProcessing) {
    return (
      <div className="w-screen bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-[#616161]">Interview Link is being generated....</h2>
          <p className="text-[#9E9E9E] mt-2">Thanks for your patience....</p>
        </div>
      </div>
    );
  }

    return (
        <div className='w-screen h-screen pt-10 flex flex-col items-center'>
            <div className="bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-purple-50/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl mb-12 border border-white/30 w-[75%] flex justify-between">
                <h1 className="text-3xl font-bold text-blue-900">Welcome back!</h1>
                <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:cursor-pointer text-white px-4 py-2 rounded hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800"
                >
                    Logout
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto h-20">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                        Step 1: Paste Your Job Description
                    </h2>
                    <p className="mb-4 text-blue-700">
                        Paste the job description here for which you wanna generate interview link
                    </p>
                    <textarea
                        placeholder="Paste job description here..."
                        className="w-full p-4 border border-[#E0E0E0] rounded-xl mb-4 resize-none min-h-[150px]"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    ></textarea>

          
                    {/* Step 2 */}
                    <p className="mb-4 text-blue-700">
                        Enter the emails of interviewees you'll share the link with
                    </p>
                    <div className="flex mb-4 gap-2">
                      <input
                        type="email"
                        placeholder="Enter interviewee email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-grow p-3 border border-[#E0E0E0] rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={addEmail}
                        className="hover:cursor-pointer bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white font-semibold px-4 rounded-xl"
                      >
                        Add
                      </button>
                    </div>

                    {/* Email Chips */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {emails.map((em) => (
                        <span
                          key={em}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2  hover:cursor-pointer"
                        >
                          {em}
                          <button
                            type="button"
                            onClick={() => removeEmail(em)}
                            className="text-[#F44336] font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    <button
                        className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white font-semibold py-3 rounded-xl hover:cursor-pointer"
                        onClick={handleGenerate}
                        disabled={isProcessing}
                    >
                        {isProcessing ? "Generating..." : "Generate Interview Link"}
                    </button>
                </div>
                

                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                        Step 2: Share the Interview Link
                    </h2>
                    <p className="mb-4 text-blue-700">
                        After generation, you'll receive a unique link to send to candidates.
                    </p>
                    <input
                        readOnly
                        placeholder="Your link will appear here..."
                        value={link}
                        className="w-full p-3 border border-[#E0E0E0] rounded-xl mb-4 bg-[#F5F5F5] text-[#616161]"
                    />
                    <button onClick={handleCopy} className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-xl hover:cursor-pointer">
                        {copied ? "Copied!" : "Copy Link"}
                    </button>
                </div>
            </div>
            <Loader isLoading={isProcessing} />
            <ErrorDialog message={message} type={type} onClose={() => setMessage('')} />
        </div>
    )
}

