"use client";

import React, { useState, useEffect, useRef } from "react";
import { Award, FileText, Zap, Download } from "lucide-react";
import domtoimage from "dom-to-image-more";
import { useLocation } from "react-router-dom";

const DisplayResult = ({ results }) => {

  const location = useLocation();
  const pathname = location.pathname;

  const [isVisible, setIsVisible] = useState(false);
  const resultRef = useRef(null);
  const exportRef = useRef(null);

  const RTL_LANGS = ["ur-IN"];

  const getTextDirection = (languageCode) =>
    RTL_LANGS.includes(languageCode) ? "rtl" : "ltr";

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleDownload = async () => {
    if (!exportRef.current) return;
    try {
      const dataUrl = await domtoimage.toPng(exportRef.current, {
        bgcolor: "#f9fafb", // light background
        filter: (node) => node.tagName !== "BUTTON",
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "assessment-results.png";
      link.click();
    } catch (err) {
      console.error("Error exporting image:", err);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Visible UI */}
      <div className="relative z-10 p-6 max-w-6xl mx-auto" ref={resultRef}>
        {/* Header */}
        <div
          className={`text-center mb-10 transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"
            }`}
        >
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="relative p-4 rounded-2xl bg-indigo-600 shadow-2xl">
              <Award className="w-10 h-10 text-white z-10" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-[#212121]">Assessment Results</h1>
              <p className="text-[#9E9E9E] text-xl mt-2">
                Your comprehensive skills evaluation
              </p>
            </div>
          </div>
        </div>

        {/* Score */}
        <div
          className={`relative bg-indigo-50 border-2 border-indigo-200 rounded-3xl p-8 mb-10 shadow-2xl transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"
            }`}
        >
          <div className="flex items-center gap-6">
            <div className="relative p-6 rounded-2xl bg-indigo-600">
              <Zap className="w-16 h-16 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-indigo-700 mb-2">
                {pathname.includes('/jobfit/') ? "Job Fit Score:" : "Credibility Score:"} {results.Result.overall_score}
              </h2>
              <div className="inline-flex px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                {results.Result.overall_score}
              </div>
            </div>
          </div>
        </div>

        {/* Remarks */}
        <div
          className={`mb-10 transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"
            }`}
        >
          <div className="relative bg-white rounded-2xl shadow-xl border border-[#EEEEEE] overflow-hidden">
            <div className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="relative p-3 rounded-xl bg-indigo-600">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#424242] mb-2">
                    Assessment Feedback
                  </h3>
                  <p className="text-[#757575]">Detailed analysis of your performance</p>
                </div>
              </div>
              <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
                <p className="text-[#616161] leading-relaxed text-lg">
                  {results.Result.remarks}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Q&A */}
        <div
          className={`mb-10 transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"
            }`}
        >
          <div className="relative bg-white rounded-2xl shadow-xl border border-[#EEEEEE] overflow-hidden">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-[#424242] mb-4">Your Responses</h3>
              <div className="space-y-6">
                {results.Result.data.map((item, index) => (
                  <div
                    key={index}
                    className="bg-indigo-50 rounded-xl p-6 border border-indigo-200"
                  >
                    <p className="font-semibold text-[#424242]" dir={getTextDirection(results.Result.language)}>
                      Q{index + 1}: {item.question_translated}
                    </p>
                    <div className="bg-white rounded-lg border border-[#F5F5F5] p-4 mt-2">
                      <p className="text-[#616161]" dir={getTextDirection(results.Result.language)}>{item.answer_original}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Export Version */}
      <div style={{ position: "absolute", top: "-9999px" }}>
        <div
          ref={exportRef}
          style={{
            width: "1200px",
            padding: "40px",
            // backgroundColor: "#f9fafb",
            backgroundColor: "linear-gradient(to bottom right, rgb(248,250,252), rgb(239,246,255), rgb(224,231,255))",
            color: "#1f2937",
            fontFamily: "sans-serif",
          }}
        >
          <h1 style={{ fontSize: "3rem", fontWeight: 700, marginBottom: "20px", padding: "10px", textAlign: "center", border: "none", lineHeight: '1', color: "#111827" }}>
            Assessment Results
          </h1>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", backgroundColor: " #eef2ff", color: "#4338ca", border: "1px solid #c7d2fe", borderRadius: "0.75rem", padding: "1.5rem", lineHeight: "2rem" }}>
            Job Fit Score: {results.Result.overall_score}
          </h2>
          <div style={{ backgroundClip: "#fff", borderRadius: "0.75rem", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", borderColor: "#e5e7eb", borderWidth: "1px", padding: "2rem", marginBottom: "2rem" }}>
            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{ fontSize: "1.5rem", lineHeight: "2rem", fontWeight: 700, color: "#1f2937", marginBottom: "0.5rem", border: "none" }}>
                Assessment Feedback
              </h3>
            </div>
            <p style={{ fontSize: "1.125rem", backgroundColor: " #eef2ff", color: "#374151", border: "1px solid #c7d2fe", borderRadius: "0.75rem", padding: "1.5rem", lineHeight: "1.75rem" }}>{results.Result.remarks}</p>
          </div>

          <div style={{ backgroundClip: "#fff", borderRadius: "0.75rem", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", borderColor: "#e5e7eb", borderWidth: "1px", padding: "2rem", marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.5rem", lineHeight: "2rem", fontWeight: 700, color: "#1f2937", marginBottom: "2rem", border: "none" }}>
              Your Responses
            </h3>
            {results.Result.data.map((item, index) => (
              <div key={index} style={{ fontSize: "1.125rem", backgroundColor: " #eef2ff", color: "#374151", border: "1px solid #c7d2fe", borderRadius: "0.75rem", padding: "1.5rem", lineHeight: "1.75rem", marginBottom: "2rem" }}>
                <p dir={getTextDirection(results.Result.language)} style={{ fontWeight: 600, border: "none", padding: "10px" }}>Q{index + 1}: {item.question_translated}</p>
                <p dir={getTextDirection(results.Result.language)} style={{ padding: "1.5rem", border: "none" , backgroundColor:'#fff', borderRadius: "0.75rem" }}>{item.answer_original}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="flex justify-center mt-10">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-10 py-4 mb-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:cursor-pointer"
        >
          <Download className="w-6 h-6" />
          Save as Image
        </button>
      </div>
    </div>
  );
};

export default DisplayResult;

