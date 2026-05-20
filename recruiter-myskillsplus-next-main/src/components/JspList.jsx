"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import JSPBreadcrumb from "@/components/JSPBreadcrumb";

const JobSkillsProfileList = () => {
  const [jspList, setJspList] = useState([]);
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("logedinUserDetail"));
    setUserDetails(user);
    if (user?.individual_profile_id) fetchJSPs(user.individual_profile_id);
    localStorage.removeItem("userRatedSkills");
  }, []);

  const fetchJSPs = async (userId) => {
    try {
      // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/job-titles/${userId}`);
      const res = await fetch(`https://api.myskillsplus.com/job-titles/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch Job Skills Profiles");
      const data = await res.json();
      setJspList(data.job_profiles || []);
    } catch (err) {
      console.error("Error fetching JSPs:", err);
      setJspList([]);
    }
  };

  const copyLink = (jobId, jobTitle) => {
    const url = `${window.location.origin}/job-apply/${jobId}/${jobTitle}`;
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  };

  const deleteJSP = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this job profile?');
    if (!confirmed) return;

    try {
      setDeleting(true);
      // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/delete/jsp/${id}`, {
      const res = await fetch(`https://api.myskillsplus.com/delete/jsp/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Job profile deleted successfully.');
        fetchJSPs(userDetails?.individual_profile_id);
      } else {
        alert('Failed to delete job profile.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredList = jspList.filter((jsp) =>
    jsp.job_title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
        <JSPBreadcrumb
            items={[
                { label: "Job Skills Profile" },
            ]}
        />
        <div className="p-6 bg-white rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
                Job Skills Profile (JSP) List
            </h2>
            <Link
                href="/jsp-profile/create"
                className="bg-blue-700 hover:bg-blue-800 text-white font-medium px-4 py-1 rounded-lg"
            >
                Create Job Skills Profile (JSP)
            </Link>
        </div>

        <div className="flex items-center gap-2 mb-4">
            <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 w-1/3"
            />
            <button
            onClick={() => setSearch("")}
            className="px-4 py-1 bg-gray-200 rounded border hover:bg-gray-300"
            >
            Reset
            </button>
        </div>

        <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
            <thead className="bg-gray-100 text-gray-800">
                <tr>
                <th className="border px-4 py-2 text-left">JSP Title</th>
                <th className="border px-4 py-2 text-left">Action</th>
                </tr>
            </thead>
            <tbody>
                {filteredList.length > 0 ? (
                filteredList.map((jsp) => (
                    <tr key={jsp.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2 font-medium">{jsp.job_title}</td>
                    <td className="border px-4 py-2 space-x-3 text-blue-600">
                        <Link 
                            href={`/jsp-profile/view/${jsp.id}/${jsp.job_title}`}
                        >
                            <span title="View" className="hover:text-blue-800 cursor-pointer">👁️</span>
                        </Link>
                        {jsp.applied_candidates_count > 0 ? (
                          <span title="Candidates have applied to this JSP. You can't edit at this stage." className="text-gray-400 cursor-not-allowed">
                            ✏️
                          </span>
                        ) : (
                          <Link href={`/jsp-profile/edit/${jsp.id}/${jsp.job_title}`}>
                            <span title="Edit" className="hover:text-green-600 cursor-pointer">✏️</span>
                          </Link>
                        )}
                        <span
                            onClick={() => deleteJSP(jsp.id)}
                            title="Delete"
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                        >🗑️
                        </span>
                        <span
                            onClick={() => copyLink(jsp.id,jsp.job_title)}
                            title="Copy Link"
                            className="hover:text-purple-600 cursor-pointer"
                        >📋
                        </span>
                        {(jsp.applied_candidates_count || 0) > 0 ? (
                          <Link href={`/jsp-profile/candidate/${jsp.id}/${jsp.job_title}`}>
                            <span title="Candidates" className="text-indigo-700 hover:underline cursor-pointer">
                              (👥 {jsp.applied_candidates_count} Candidates Applied)
                            </span>
                          </Link>
                        ) : (
                          <span className="text-gray-400 cursor-not-allowed">
                            (👥 0 Candidates Applied)
                          </span>
                        )}
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan="2" className="text-center py-4 text-gray-500">
                    No Job Skills Profiles found.
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>

        <p className="text-sm text-gray-500 mt-4">
            Showing {filteredList.length} of {jspList.length} entries
        </p>
        </div>
    </>
  );
};

export default JobSkillsProfileList;
