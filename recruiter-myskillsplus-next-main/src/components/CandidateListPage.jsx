"use client";

import React, { useEffect, useState } from "react";
import JSPBreadcrumb from "@/components/JSPBreadcrumb";

const CandidateListPage = ({ jobId, jobTitle }) => {
  const [jobSkills, setJobSkills] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [singleComparisonCandidate, setSingleComparisonCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await fetch(
          // `${process.env.NEXT_PUBLIC_BASE_URL}/get-candidate-details/${jobId}/`
          `https://api.myskillsplus.com/get-candidate-details/${jobId}/`
        );
        const data = await res.json();

        const jobSkillsData = (data?.job_skills || []).map((s) => ({
          skill_id: s.isot_file_id,
          skill_name: s.isot_file.name,
          rating: s.rating?.[0]?.rating || 0,
        }));
        setJobSkills(jobSkillsData);

        const candidatesData = (data?.candidate_profiles || []).map((c) => {
          let skills = [];
          if (Array.isArray(c.candidate_skills)) {
            skills = c.candidate_skills.map((skill) => ({
              skill_id: skill.isot_file_id,
              skill_name: skill.isot_file?.name || "",
              rating: skill.rating?.[0]?.rating || 0,
            }));
          }
          return {
            ...c,
            candidate_skills: skills,
          };
        });

        setCandidates(candidatesData);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };

    if (jobId) fetchCandidates();
  }, [jobId]);

  const calculateMatchPercentage = (candidateSkills) => {
    let expectedTotal = 0;
    let actualTotal = 0;

    for (let skill of jobSkills) {
      expectedTotal += skill.rating;
      const candidateSkill = candidateSkills.find(
        (s) => s.skill_id === skill.skill_id
      );
      const actual = candidateSkill ? Math.min(candidateSkill.rating, skill.rating) : 0;
      actualTotal += actual;
    }

    return expectedTotal > 0
      ? Math.round((actualTotal / expectedTotal) * 100)
      : 0;
  };

  const toggleCandidateSelection = (email) => {
    setSingleComparisonCandidate(null);
    if (selectedCandidates.includes(email)) {
      setSelectedCandidates((prev) => prev.filter((e) => e !== email));
    } else if (selectedCandidates.length < 5) {
      setSelectedCandidates((prev) => [...prev, email]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedCandidates.length === 5 || selectedCandidates.length === candidates.length) {
      setSelectedCandidates([]);
    } else {
      const firstFiveEmails = candidates.slice(0, 5).map((c) => c.email);
      setSelectedCandidates(firstFiveEmails);
    }
    setSingleComparisonCandidate(null);
  };

  const isDisabled = (email) =>
    !selectedCandidates.includes(email) && selectedCandidates.length >= 5;

  const getRatingImage = (rating) => {
    if (rating <= 1) return "/images/percentage/0rate.png";
    if (rating === 2) return "/images/percentage/25.png";
    if (rating === 3) return "/images/percentage/50.png";
    if (rating === 4) return "/images/percentage/75.png";
    if (rating >= 5) return "/images/percentage/100.png";
    return "/images/percentage/0rate.png";
  };

  const filteredCandidates = candidates
    .filter((c) => c.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const aMatch = calculateMatchPercentage(a.candidate_skills);
      const bMatch = calculateMatchPercentage(b.candidate_skills);
      return sortOrder === "asc" ? aMatch - bMatch : bMatch - aMatch;
    });

  return (
    <>
      <JSPBreadcrumb
        items={[
          { label: "Job Skills Profile", href: "/jsp-profile" },
          { label: "Candidates List" },
        ]}
      />

      <div className="p-6 bg-white rounded-lg">
        <h2 className="text-2xl font-bold mb-6">{jobTitle}</h2>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by candidate name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-4 py-2 rounded w-full md:w-1/3"
          />

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border px-4 py-2 rounded w-full md:w-1/4"
          >
            <option value="desc">Percentage High to Low</option>
            <option value="asc">Percentage Low to High</option>
          </select>
        </div>

        <div className="mb-4 border rounded shadow overflow-auto">
          <table className="w-full table-auto text-sm border">
            <thead className="bg-indigo-100 text-gray-700">
              <tr>
                <th className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedCandidates.length === candidates.length || selectedCandidates.length === 5}
                    onChange={toggleSelectAll}
                    className="cursor-pointer"
                  />
                </th>
                <th className="p-3 text-left">Applicants</th>
                <th className="p-3 text-center">Assessment Score</th>
                <th className="p-3 text-center">Match %</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((candidate, idx) => {
                const match = calculateMatchPercentage(candidate.candidate_skills);
                const isChecked = selectedCandidates.includes(candidate.email);

                return (
                  <tr
                    key={idx}
                    className={`border-t hover:bg-gray-50 ${isDisabled(candidate.email) ? "opacity-50" : ""}`}
                  >
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={isDisabled(candidate.email)}
                        onChange={() => toggleCandidateSelection(candidate.email)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td
                      className="p-3 font-bold text-blue-600 cursor-pointer underline"
                      onClick={() => {
                        setSingleComparisonCandidate(candidate.email);
                        setSelectedCandidates([]);
                      }}
                    >
                      {candidate.name}
                    </td>
                    <td
                      className={`p-3 text-center font-semibold ${
                        !candidate.assessment_score
                          ? "text-[#9E9E9E]"
                          : candidate.assessment_score?.toLowerCase() === "low"
                          ? "text-[#E53935]"
                          : candidate.assessment_score?.toLowerCase() === "medium"
                          ? "text-blue-600"
                          : candidate.assessment_score?.toLowerCase() === "high"
                          ? "text-green-600"
                          : "text-[#757575]"
                      }`}
                    >
                      {candidate.assessment_score
                        ? candidate.assessment_score
                        : "Interview Not Taken"}
                    </td>
                    <td
                      className={`p-3 text-center font-semibold ${
                        match < 40
                          ? "text-[#E53935]"
                          : match < 80
                          ? "text-blue-600"
                          : "text-green-600"
                      }`}
                    >
                      {match}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-md font-md text-black mb-6">Compare Applicants <span className="text-red font-bold">(Maximum 5)</span></p>

        {(selectedCandidates.length > 0 || singleComparisonCandidate) && (
          <div className="mb-6 rounded-md overflow-auto border shadow-sm">
            <table className="w-full text-sm border">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="p-2 border text-left">Skill Name</th>
                  <th className="p-2 border text-center">Expected Proficiency</th>
                  {(selectedCandidates.length > 0 ? selectedCandidates : [singleComparisonCandidate]).map(
                    (email) => {
                      const c = candidates.find((c) => c.email === email);
                      const percent = calculateMatchPercentage(c?.candidate_skills || []);
                      return (
                        <th key={email} className="p-2 border text-center">
                          {c?.name || email} ({percent}%)
                        </th>
                      );
                    }
                  )}
                </tr>
              </thead>
              <tbody>
                {jobSkills.map((skill) => (
                  <tr key={skill.skill_id}>
                    <td className="p-2 border text-[16px] text-black font-normal">{skill.skill_name}</td>
                    <td className="text-center align-middle p-2 border">
                      <div className="flex items-center justify-center gap-2 min-h-[40px]">
                        <img
                          src={getRatingImage(skill.rating)}
                          alt={`Rating ${skill.rating}`}
                          className="w-[40px] h-[40px]"
                        />
                      </div>
                    </td>
                    {(selectedCandidates.length > 0 ? selectedCandidates : [singleComparisonCandidate]).map(
                      (email) => {
                        const candidate = candidates.find((c) => c.email === email);
                        const cs = candidate?.candidate_skills.find(
                          (s) => s.skill_id === skill.skill_id
                        );
                        return (
                          <td key={email} className="text-center align-middle p-2 border">
                            <div className="flex items-center justify-center gap-2 min-h-[40px]">
                              <img
                                src={getRatingImage(cs?.rating)}
                                alt={`Rating ${cs?.rating}`}
                                className="w-[40px] h-[40px]"
                              />
                            </div>
                          </td>
                        );
                      }
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default CandidateListPage;