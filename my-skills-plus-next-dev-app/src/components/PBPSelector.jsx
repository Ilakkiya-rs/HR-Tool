"use client";

import { useState } from "react";
import { Upload, FileText } from "lucide-react";
import PersonalBackgroundProfile from "./PersonalBackgroundProfile";

export default function PBPSelector() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    // Replace with your own API endpoint
    const res = await fetch("/api/clean-linkedin-pdf", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setPdfUrl(data.cleanedUrl);
    } else {
      alert("Failed to clean PDF");
    }
  };

  return (
    <>
        {/* Conditional rendering based on selected option */}
        <div className="p-6 bg-white shadow rounded-lg">
            <h2 className="text-xl font-bold mb-4">Create Your PBP (Personal Background Profile)</h2>
            <p className="mb-4">You have two options to create your PBP:</p>
            <div className="space-y-3 mb-6">
                <label className="flex items-center gap-2">
                <input
                    type="radio"
                    name="pbp_option"
                    value="form"
                    checked={selectedOption === "form"}
                    onChange={() => setSelectedOption("form")}
                />
                Use the online form provided on this site
                </label>

                <label className="flex items-center gap-2">
                <input
                    type="radio"
                    name="pbp_option"
                    value="linkedin"
                    checked={selectedOption === "linkedin"}
                    onChange={() => setSelectedOption("linkedin")}
                />
                Upload your LinkedIn profile PDF
                </label>
            </div>
        </div>
        
        {/* LinkedIn option Select */}
        {selectedOption === "linkedin" && (
            <div className="mt-6 p-6 space-y-4 bg-white shadow rounded-lg">
                {/*Step 1*/}
                <p className="text-[#616161]">
                    <strong>If you choose the LinkedIn route, follow these steps:</strong>
                </p>
                <h3 className="font-semibold text-md mt-4">Step 1: Download your LinkedIn profile as a PDF</h3>
                <ol className="list-decimal list-inside text-sm space-y-2">
                    <li>Go to your LinkedIn profile.</li>
                    <li>Click the More button (next to the Message button).</li>
                    <li>Select Save to PDF from the dropdown.</li>
                </ol>
                <p className="text-sm text-[#616161]">
                    This PDF will include your name, contact details (if public), headline, summary, experience, education, and skills.
                </p>

                {/*Step 2*/}
                <h3 className="font-semibold text-md mt-4">Step 2: Upload the PDF here</h3>
                <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer">
                    <Upload className="mr-2" size={16} /> Upload PDF
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleUpload}
                        className="hidden"
                    />
                </label>
                {pdfUrl && (
                    <div className="mt-4 border rounded p-4 bg-[#FAFAFA]">
                        <h4 className="text-sm font-semibold mb-2">Cleaned PDF Preview:</h4>
                        <iframe src={pdfUrl} className="w-full h-96 border" />
                    </div>
                )}

                {/*Step 3*/}
                <h3 className="font-semibold text-md mt-4">Step 3: We protect your privacy</h3>
                <p className="text-[#616161]">
                    Before we use your data, MySkillsPlus will automatically<strong> remove the following information </strong>from the PDF
                </p>
                <ul className="list-disc list-inside text-sm text-[#616161]">
                    <li>Email addresses</li>
                    <li>Phone numbers</li>
                    <li>LinkedIn profile links</li>
                    <li>Any website URLs</li>
                    <li>Full name</li>
                    <li>Title block (typically the top section on Page 1)</li>
                </ul>
                <p className="text-[#616161]">
                This ensures your profile is cleaned of personally identifiable information (PII) before processing.
                </p>
            </div>
        )}

        {/* Form option Select */}
        {selectedOption === "form" && (
            <PersonalBackgroundProfile />
        )}
    </>
  );
}
