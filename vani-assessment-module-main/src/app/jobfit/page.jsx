import React from "react";

export default function RecruiterLandingPage() {

  const steps = [
    { id: 1, stepNo: "Step 1", heading: "Upload Job Description", description: "Paste the job details to generate a customized interview." },
    { id: 2, stepNo: "Step 2", heading: "Generate Interview", description: "Our platform creates an interactive interview automatically." },
    { id: 3, stepNo: "Step 3", heading: "Share the Link", description: "Send the unique interview link to your candidates effortlessly." }
  ]

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center p-8 pt-15">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-5xl font-bold text-blue-900 mb-10">
          Smart Interview Platform
        </h1>
        <p className="text-lg mb-10">
          Create automated interviews based on your job description. Share a link with candidates and let the platform handle the rest.
        </p>
        <a href="/jobfit/login" className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white font-semibold px-6 py-3 rounded-xl text-lg hover:cursor-pointer">
          Get Started
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-16">

        {steps.map((item, index) => (
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center" key={index}>
            <div className="text-blue-600 text-xl font-semibold mb-2">{item.stepNo}</div>
            <h3 className="text-2xl font-bold text-[#424242] mb-2">{item.heading}</h3>
            <p className="text-[#757575]">{item.description}</p>
          </div>
        ))}
      </div>
    </div >
  );
}
