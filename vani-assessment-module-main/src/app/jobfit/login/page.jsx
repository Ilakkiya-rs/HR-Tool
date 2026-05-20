"use client";

import React, { useState } from "react";
import Loader from "../../../components/Loader";
import ErrorDialog from "../../../components/ErrorDialog";
import { useNavigate } from "react-router-dom";

export default function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState("")
    const [type, setType] = useState('success');

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

        if (!formData.email.trim()) newErrors.email = "This field is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = "Invalid email format";

        if (!formData.password.trim()) {
            newErrors.password = "This field is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        if (!validateForm()) {
            setIsProcessing(false);
            return;
        }

        try {
            const response = await fetch('https://api.myskillsplus.com/jobfit/login/', {
            // const response = await fetch('http://127.0.0.1:8000/jobfit/login/', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
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
                setIsProcessing(false);
                setTimeout(() => {
                    navigate("/jobfit/dashboard");
                }, 500);
            }
        } catch (err) {
            setMessage("An error occured. Please try again....");
            setType('error')
        } finally {
            setIsProcessing(false)
        }
    };

    return (
        <div className="w-screen min-h-screen flex items-center justify-center bg-[#FAFAFA] py-12">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center text-[#424242] mb-6">
                    Log In to Continue
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">

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

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[#616161] mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? "border-[#F44336]" : "border-[#E0E0E0]"
                                }`}
                            placeholder="Enter Password"
                        />
                        {errors.password && <p className="text-[#F44336] text-sm mt-1">{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isProcessing}
                        className={`w-full py-2 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white font-bold text-xl rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 focus:ring-2 focus:ring-blue-500 hover:cursor-pointer`}
                    >
                        {isProcessing ? "Processing..." : "Login"}
                    </button>
                </form>
                <p className="mt-4 text-sm text-center text-[#757575]">
                    Don't have an account?
                    <a href="/jobfit/register" className="text-blue-600 hover:underline font-medium hover:cursor-pointer">Register</a>
                </p>
                <Loader isLoading={isProcessing} />
                <ErrorDialog message={message} type={type} onClose={() => setMessage('')} />
            </div>
        </div>
    );
}
