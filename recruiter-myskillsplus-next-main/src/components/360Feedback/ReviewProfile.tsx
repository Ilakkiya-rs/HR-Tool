"use client";
import React, { useState, useEffect } from "react";
import { API } from "../../app/auth/endpoints";
import axios from "axios";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { getLocalStorage, setLocalStorage } from "@/common/token";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ExportProps = {
  params: {
    token: string | number;
  };
};

const PublicProfile = ({ params }: ExportProps) => {
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API.getReviewProfile}/` + params.token.toString(),
        );
        setUserData(response.data);
        const processedSkills = processSkillsData(response.data.data);
        setLocalStorage("userRatedSkills", processedSkills);

        console.warn(response.data);

        console.dir(response.data.data, { maxArrayLength: null });
      } catch (error) {
        setError((error as Error).message);
      }
    };

    localStorage.setItem('iys', JSON.stringify({
      page:"Feedback",
      tap: "profile",
      profile_view: "all",
      isEdit: true,
      isDelete: false,
      doughnt: true, 
      experience: false
    }));

    fetchData();

    return () => {
      localStorage.removeItem('config');
    };

  }, [params.token]);

  // const processSkillsData = (skillsData: any[]) => {
  //   let filteredSkills: any[] = [];
  
  //   skillsData.forEach((skill) => {
  //     const skillTags = skill.isot_file?.tags || [];
      
  //     const hasAreaOrDomainTag = skillTags.some(
  //       (tag: { title: string; }) => tag.title === "Area" || tag.title === "Domain"
  //     );
  
  //     if (!hasAreaOrDomainTag) {
  //       filteredSkills.push(skill);
  //     }
  //   });
  
  //   return filteredSkills;
  // };  

  const processSkillsData = (skillsData: any[]) => {
    const excludedRatingIds = ["ratings/1", "ratings/2", "ratings/3"];
  
    return skillsData.filter((skill) => {
      const skillRatings = skill.isot_file?.ratings || [];
      const hasExcludedRatings = skillRatings.some(
        (rating: { _id: string }) => excludedRatingIds.includes(rating._id)
      );
  
      return !hasExcludedRatings;
    });
  };
  
  const handleSubmit = async () => {
    const submitData = getLocalStorage("userRatedSkills");

    try {
      const formattedData = {
        skills: submitData,
      };

      console.log("formattedData: ", formattedData);

      const response = await axios.post(
        `${API.submitReview}/${params.token.toString()}/`,
        formattedData,
      );
      toast.success("Review Submitted Succesfully");
      setIsFormSubmitted(true);
    } catch (error) {
      setError((error as Error).message);
      console.error("Submission failed: ", error);
    }
  };

  return (
    <div>
      <ToastContainer />

      {error ? (
        <p>Error: {error}</p>
      ) : userData ? (
        !isFormSubmitted ? (
          <>
            <Breadcrumb pageName={userData.full_name} />
            Please review {userData.full_name}&apos;s skills profile and provide
            your feedback.
            <div className="col-12 mt-5" style={{ height: "78vh" }}>
              {/* src="/plugins/360review/360review.html" */}
              <iframe
                style={{ borderRadius: "10px", height: "100%", width: "100%" }}
                src="/plugins/allinone/index.html"
                title="IYS Plugin Rating"
              />
            </div>
            <div className="absolute bottom-10 right-10 gap-3">
              <button
                onClick={handleSubmit}
                className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="h- flex items-center justify-center">
              <div>
                <div className="flex flex-col items-center space-y-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-28 w-28 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h1 className="text-4xl font-bold">
                    Review Submitted Successfully!
                  </h1>
                  <p>Thank you for submitting your review.</p>
                </div>
              </div>
            </div>
          </>
        )
      ) : (
        <p>Getting Profile Details...</p>
      )}
    </div>
  );
};

export default PublicProfile;
