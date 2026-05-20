"use client";

import { useRouter } from "next/navigation";

export default function HomeCards() {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      
      {/* Card 1 */}
      <div className="flex-1 border rounded-xl shadow-md p-4 flex flex-col items-center text-center bg-white hover:shadow-lg transition">
        <div className="text-4xl mb-4">📋</div>
        <h2 className="text-xl font-bold mb-2">Create a Job Skills Profile</h2>
        <p className="text-gray-600 mb-6">
          Build a job-specific skills profile, share it with candidates for
          self-rating, and compare their skills against your profile and each other.
        </p>
        <button
          onClick={() => router.push("/jsp-profile")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full"
        >
          Create Profile
        </button>
      </div>

      {/* Card 2 */}
      <div className="flex-1 border rounded-xl shadow-md p-4 flex flex-col items-center text-center bg-white hover:shadow-lg transition">
        <div className="text-4xl mb-4">🎧</div>
        <h2 className="text-xl font-bold mb-2">Run an AI Audio Interview</h2>
        <p className="text-gray-600 mb-6">
          Turn any job description into an AI-powered audio interview link you can
          share with candidates for quick screening.
        </p>
        <button
          onClick={() => router.push("/jd-interview/interview-details")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full"
        >
          Start Audio Screening
        </button>
      </div>
    </div>
  );
}
