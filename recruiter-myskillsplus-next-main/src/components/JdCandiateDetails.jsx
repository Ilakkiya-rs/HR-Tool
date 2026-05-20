"use client";
import React, { useEffect, useState } from "react";

const AssessmentHistory = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRemarks, setSelectedRemarks] = useState(null);
  const [selectedTranscript, setSelectedTranscript] = useState(null);

  const user = JSON.parse(localStorage.getItem("logedinUserDetail"));
  const userId = user?.individual_profile_id;

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const res = await fetch(
          // `${process.env.NEXT_PUBLIC_BASE_URL}/get-job-assessment/${userId}`
          `https://api.myskillsplus.com/get-job-assessment/${userId}`
        );
        const data = await res.json();
        setAssessments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching assessment history", err);
      } finally {
        setLoading(false);<table className="min-w-full text-sm border-collapse border border-[#E0E0E0] shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-blue-200 to-blue-100 text-[#616161] uppercase text-xs tracking-wider">
            <tr>
                <th className="p-3 border">Assessment Date</th>
                <th className="p-3 border">Assessment ID</th>
                <th className="p-3 border">Job Id</th>
                <th className="p-3 border">Candidate Email</th>
                <th className="p-3 border">Overall Score</th>
                <th className="p-3 border">Remarks</th>
                <th className="p-3 border">Transcript</th>
                <th className="p-3 border">Download</th>
            </tr>
        </thead>
        <tbody>
            {filtered.map((item, index) => (
            <tr
                key={index}
                className="border-t even:bg-[#FAFAFA] hover:bg-blue-50 transition"
            >
                <td className="px-4 py-2 border">
                  {new Date(item.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="p-3 border">{item.assessment_id}</td>
                <td className="p-3 border">{item.job_id}</td>
                <td className="p-3 border">{item.candidate_email}</td>
                <td className="p-3 text-center border font-bold text-blue-700">
                    {item.overall_score}
                </td>
                <td className="p-3 text-center border">
                <button
                    onClick={() =>
                    setSelectedRemarks([
                        {
                        transcript: item.remarks || "No remarks available.",
                        },
                    ])
                    }
                    className="text-xs text-white bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                >
                    View
                </button>
                </td>
                <td className="p-3 text-center border">
                <button
                    onClick={() => setSelectedTranscript(item.answers)}
                    className="text-xs text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                >
                    View
                </button>
                </td>
                <td className="p-3 text-center border">
                <button
                    onClick={() => handlePrint(item)}
                    className="text-xs text-white bg-[#616161] px-3 py-1 rounded hover:bg-black"
                >
                    Print
                </button>
                </td>
            </tr>
            ))}
        </tbody>
    </table>
      }
    };

    if (userId) fetchAssessments();
  }, [userId]);

  const handlePrint = (item) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const transcriptHTML =
      item.answers?.map(
        (q) => `
      <div style="margin-bottom: 16px;">
        <p><strong>Question ID:</strong> ${q.id}</p>
        <p><strong>Question:</strong> ${q.question}</p>
        <p><strong>Transcript:</strong> ${q.answer}</p>
      </div>
    `
      ).join("") || "<p>No transcript available.</p>";

    const htmlContent = `
      <html>
      <head>
        <title>Assessment Report</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          h2 { color: #2563eb; }
          .section { margin-bottom: 24px; }
        </style>
      </head>
      <body>
        <h2>Assessment Report</h2>
        <div class="section">
          <p><strong>Job ID:</strong> ${item.job_id}</p>
          <p><strong>Assessment ID:</strong> ${item.assessment_id}</p>
          <p><strong>Overall Score:</strong> ${item.overall_score}</p>
          <p><strong>Remarks:</strong> ${item.remarks || "N/A"}</p>
        </div>
        <div class="section">
          <h3>Transcript</h3>
          ${transcriptHTML}
        </div>
        <script>
          window.onload = function () {
            window.print();
            window.onafterprint = function () {
              window.close();
            }
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const filtered = assessments.filter((a) => {
    const term = searchTerm.toLowerCase();
    return (
      a.is_paid === true && ( // ✅ only paid records
        String(a.assessment_id).toLowerCase().includes(term) ||
        String(a.overall_score).toLowerCase().includes(term)
      )
    );
  });  

  const closeModal = () => {
    setSelectedTranscript(null);
    setSelectedRemarks(null);
  };

  const Modal = ({ title, content }) => (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-xl max-w-xl w-full p-6 shadow-lg relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-[#757575] hover:text-red-500 text-xl"
        >
          ✖
        </button>
        <h3 className="text-xl font-bold mb-4 text-blue-700">{title}</h3>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {content}
        </div>
      </div>
    </div>
  );

  if (loading) return <p className="text-center">Loading...</p>;
  if (!assessments.length)
    return (
      <p className="text-center text-[#9E9E9E]">No assessment history found.</p>
    );

  return (
    <div className="p-4 overflow-x-auto">
      <input
        type="text"
        placeholder="Search by Assessment Id or Score..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 px-4 py-2 border rounded w-full max-w-sm"
      />

        <table className="min-w-full text-sm border-collapse border border-[#E0E0E0] shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-blue-200 to-blue-100 text-[#616161] uppercase text-xs tracking-wider">
                <tr>
                    <th className="p-3 border">Assessment Date</th>
                    <th className="p-3 border">Assessment ID</th>
                    <th className="p-3 border">Job Id</th>
                    <th className="p-3 border">Candidate Email</th>
                    <th className="p-3 border">Overall Score</th>
                    <th className="p-3 border">Remarks</th>
                    <th className="p-3 border">Transcript</th>
                    <th className="p-3 border">Download</th>
                </tr>
            </thead>
            <tbody>
                {filtered.map((item, index) => (
                <tr
                    key={index}
                    className="border-t even:bg-[#FAFAFA] hover:bg-blue-50 transition"
                >
                    <td className="px-4 py-2 border">
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="p-3 border">{item.assessment_id}</td>
                    <td className="p-3 border">{item.job_id}</td>
                    <td className="p-3 border">{item.candidate_email}</td>
                    <td className="p-3 text-center border font-bold text-blue-700">
                        {item.overall_score}
                    </td>
                    <td className="p-3 text-center border">
                    <button
                        onClick={() =>
                        setSelectedRemarks([
                            {
                            transcript: item.remarks || "No remarks available.",
                            },
                        ])
                        }
                        className="text-xs text-white bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                    >
                        View
                    </button>
                    </td>
                    <td className="p-3 text-center border">
                    <button
                        onClick={() => setSelectedTranscript(item.answers)}
                        className="text-xs text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                    >
                        View
                    </button>
                    </td>
                    <td className="p-3 text-center border">
                    <button
                        onClick={() => handlePrint(item)}
                        className="text-xs text-white bg-[#616161] px-3 py-1 rounded hover:bg-black"
                    >
                        Print
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
        </table>


      {/* Modal for Remarks */}
      {selectedRemarks && (
        <Modal
          title="Remarks"
          content={selectedRemarks.map((q, i) => (
            <div
              key={i}
              className="bg-[#F5F5F5] p-4 rounded border border-[#EEEEEE]"
            >
              <p>{q.transcript}</p>
            </div>
          ))}
        />
      )}

      {/* Modal for Transcript */}
      {selectedTranscript && (
        <Modal
          title="Transcript"
          content={selectedTranscript.map((q, i) => (
            <div
              key={i}
              className="bg-[#F5F5F5] p-4 rounded border border-[#EEEEEE]"
            >
              {q.id && (
                <p>
                  <strong>Question ID:</strong> {q.id}
                </p>
              )}
              {q.question && (
                <p>
                  <strong>Question:</strong> {q.question}
                </p>
              )}
              <p>
                <strong>Transcript:</strong> {q.answer}
              </p>
            </div>
          ))}
        />
      )}
    </div>
  );
};

export default AssessmentHistory;