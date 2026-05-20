"use client";
import { useEffect, useState } from "react";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { Wallet, Users, AlertCircle, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const InterviewDetails = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [jobList, setJobList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState(null);
  const router = useRouter();

  // NEW: Wallet state
  const [credits, setCredits] = useState(0);
  const [currencyCode, setCurrencyCode] = useState("INR");
  const [candidates, setCandidates] = useState(0);

  const userData = JSON.parse(localStorage.getItem("logedinUserDetail")) || {};
  const recruiterId = userData?.individual_profile_id;

   // fetch wallet balance
   const fetchWallet = async () => {
    const tokenData = localStorage.getItem("tokenData");
    const accessToken = tokenData ? JSON.parse(tokenData)?.access : null;
    try {
      const res = await fetch(`https://api.myskillsplus.com/users/wallet/`, {
      // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/wallet/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        setCredits(data.balance || 0);
        setCurrencyCode(data.currency || "INR");
        setCandidates(Math.floor((data.balance || 0) / 100)); // Example: 1 candidate = 100 credits
      }
    } catch (err) {
      console.error("Failed to fetch wallet", err);
    }
  };

  const getCurrencySymbol = (code) => {
    switch (code) {
      case "INR":
        return "₹";
      case "USD":
        return "$";
      case "EUR":
        return "€";
      default:
        return "$";
    }
  };

  const fetchJobList = async () => {
    if (!recruiterId) return;
    try {
      const res = await fetch(
        `https://api.myskillsplus.com/recruiter-assessment/${recruiterId}`
        // `${process.env.NEXT_PUBLIC_BASE_URL}/recruiter-assessment/${recruiterId}`
      );
      const data = await res.json();
      if (res.ok) {
        setJobList(data || []);
      } else {
        console.error("Failed to fetch job list", data?.message);
      }
    } catch (error) {
      console.error("Error fetching job list:", error);
    }
  };

  function DescriptionCell({ text }) {
    const [expanded, setExpanded] = useState(false);
    const maxLength = 80;
  
    if (!text) return "-";
  
    return (
      <div>
        {expanded ? text : text.slice(0, maxLength) + (text.length > maxLength ? "..." : "")}
        {text.length > maxLength && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-500 ml-2 underline text-sm"
          >
            {expanded ? "View Less" : "View More"}
          </button>
        )}
      </div>
    );
  }

  useEffect(() => {
    fetchJobList();
    fetchWallet();
  }, [recruiterId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recruiterId) return;

    const jobDetails = {
      recruiter_id: recruiterId,
      job_title: jobTitle,
      job_description: description,
    };

    setLoading(true);

    try {
      const res = await fetch(
        `https://api.myskillsplus.com/jobfit/generate-assessment/`,
        // `${process.env.NEXT_PUBLIC_BASE_URL}/jobfit/generate-assessment/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jobDetails),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setJobTitle("");
        setDescription("");
        setShowForm(false);
        await fetchJobList();
        alert("Job successfully submitted.");
      } else {
        alert(`Submission failed: ${data?.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setQuestions(null);
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
          className="absolute top-3 right-3 text-[#757575] hover:text-[#F44336] text-xl"
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

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-lg space-y-6">
      {/* Wallet Credits Info */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-blue-200 rounded-2xl p-6 shadow-md">
        {/* Credits Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="text-blue-600 w-6 h-6" />
            <h3 className="text-lg font-bold text-[#424242]">Wallet Balance</h3>
          </div>
          <span className="text-xl font-extrabold text-blue-700">
            {getCurrencySymbol(currencyCode)} {credits}
          </span>
        </div>

        {/* Candidates Info */}
        <div className="flex items-center gap-2 mb-3">
          <Users className="text-green-600 w-5 h-5" />
          <p className="text-[#616161] text-sm">
            <strong>{candidates}</strong> candidate{candidates !== 1 ? "s" : ""} can be interviewed
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-white border-l-4 border-yellow-400 p-3 rounded-md flex items-start gap-2 mb-4">
          <AlertCircle className="text-yellow-500 w-5 h-5 mt-0.5" />
          <p className="text-[#757575] text-sm">
            To interview more candidates, please <strong>buy additional credits</strong>.
          </p>
        </div>

        {/* Warning Note */}
        <p className="text-[#E53935] text-sm font-bold flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          If you send interview links beyond this limit, reports will be locked until credits are bought.
        </p>

        {/* Add Credits Button */}
        <div className="mt-5">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            onClick={() => router.push("/payments/wallet")}
          >
            <PlusCircle className="w-5 h-5" />
            Buy More Credits
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <h1 className="text-xl font-bold text-[#424242]">Interview Jobs</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow"
        >
          {showForm ? "Back" : "+ Add Job"}
        </button>
      </div>

      {/* Form */}
      {showForm ? (
        <form
          onSubmit={handleSubmit}
          className="bg-[#FAFAFA] p-4 rounded-lg space-y-4 shadow-inner"
        >
          <div>
            <label className="block text-sm font-medium text-[#616161] mb-1">
              Job Title
            </label>
            <input 
              type="text" 
              onChange={(e) => setJobTitle(e.target.value)} 
              className="w-full border rounded-lg p-3 outline-none mb-4"
            />
            <label className="block text-sm font-medium text-[#616161] mb-1">
              Job Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg p-3 outline-none"
              rows="4"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      ) : (
        /* Table */
        <div className="overflow-x-auto">
          <table className="table-fixed w-full border-collapse border border-[#EEEEEE]">
            <thead className="bg-[#F5F5F5]">
              <tr>
                <th className="px-4 py-2 border w-[120px]">Date</th>
                <th className="px-4 py-2 border w-[110px]">Job ID</th>
                <th className="px-4 py-2 border w-[140px]">Title</th>
                <th className="px-4 py-2 border w-[250px]">Description</th>
                <th className="px-4 py-2 border w-[100px]">Questions</th>
                <th className="px-4 py-2 border w-[220px]">Interview Link</th>
              </tr>
            </thead>
            <tbody>
              {jobList.length > 0 ? (
                jobList.map((job) => (
                  <tr key={job.job_id} className="hover:bg-[#FAFAFA]">
                    <td className="px-4 py-2 border text-sm">
                      {new Date(job.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-2 border text-sm">{job.job_id}</td>
                    <td className="px-4 py-2 border text-center text-sm max-w-xs">
                      <DescriptionCell text={job.job_title} />
                    </td>
                    <td className="px-4 py-2 border text-sm max-w-xs">
                      <DescriptionCell text={job.job_description} />
                    </td>
                    <td className="px-4 py-2 border text-center">
                      <button
                        onClick={() => setQuestions(job.questions)}
                        className="text-xs text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                      >
                        View
                      </button>
                    </td>
                    <td className="px-4 py-2 border">
                      {job.interview_link ? (
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-blue-600 text-sm max-w-[170px]">
                            {job.interview_link}
                          </span>
                          <DocumentDuplicateIcon
                            className="w-5 h-5 text-[#FAFAFA]0 cursor-pointer hover:text-[#616161] flex-shrink-0"
                            onClick={() => {
                              navigator.clipboard.writeText(job.interview_link);
                              alert("Interview link copied!");
                            }}
                          />
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="px-4 py-2 border text-center text-[#FAFAFA]0"
                    colSpan="6"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Modal for Transcript */}
          {questions && (
            <Modal
              title="Questions"
              content={questions.map((q, i) => (
                <div
                  key={i}
                  className="bg-[#F5F5F5] p-4 rounded border border-[#EEEEEE]"
                >
                  {q.id && q.question && (
                    <p>
                      {q.id}. {q.question}
                    </p>
                  )}
                </div>
              ))}
            />
          )}

        </div>
      )}
    </div>
  );
};

export default InterviewDetails;


