"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../app/auth/endpoints";
import Link from "next/link";

interface SkillData {
  id: number;
  isot_path_addr: string;
  skill_name: string;
  user_rating: number;
  peer_avg_rating: number;
  tags: {
    _id: string;
    title: string;
  }[];
}

export default function ReviewFeedback(): JSX.Element {
  const [skillsData, setSkillsData] = useState<SkillData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const token = JSON.parse(localStorage.getItem("tokenData") || "{}").access;
  const apiUrl = `${API.getPeersFeedback}`;

  const order = [
    "tags/1", "tags/2", "tags/3", "tags/4", "tags/5", "tags/6", "tags/7",
    "tags/8", "tags/9", "tags/10", "tags/11", "tags/12", "tags/13", "tags/14",
    "tags/15", "tags/16", "tags/17", "tags/18", "tags/19", "tags/20", "tags/21",
    "tags/22", "tags/23", "tags/24", "tags/25", "tags/26"
  ];

  useEffect(() => {
    const fetchSkillsData = async () => {
      try {
        const response = await axios.get<{ all_user_skills: SkillData[] }>(
          apiUrl,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const sortedSkills = response.data.all_user_skills.sort((a, b) => {
          const tagIdA = a.tags[0]?._id;
          const tagIdB = b.tags[0]?._id;

          // If either skill has no tag, it should come after those with tags
          if (!tagIdA || !tagIdB) return !tagIdA ? 1 : -1;

          return order.indexOf(tagIdA) - order.indexOf(tagIdB);
        });

        setSkillsData(sortedSkills);
        setLoading(false);
        console.log("skillsData", sortedSkills);
      } catch (error) {
        console.error("Error fetching skills data:", error);
        setLoading(false);
      }
    };

    fetchSkillsData();
  }, [apiUrl, token]);

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                {skillsData.length === 0 ? (
                  <div className="my-5 flex w-full flex-col items-center justify-center gap-10">
                    <h1 className="text-center text-lg">
                      You need at least three individuals to provide feedback on
                      your profile before it can be displayed here.
                    </h1>
                    <div>
                      <Link
                        href="/request-360-feedback"
                        className="rounded-xl bg-primary p-3 px-4 text-white"
                      >
                        Request Feedback Here
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 bg-white border border-slate-300 rounded-xl">
                    <table className="text-surface min-w-full border border-neutral-200 bg-white text-center text-sm font-light dark:border-white/10">
                      <thead className="border-b border-neutral-200 font-medium dark:border-white/10">
                        <tr className="bg-blue-50 text-lg text-primary">
                          <th
                            scope="col"
                            className="w-8/12 border-e border-neutral-200 px-6 py-4 text-left dark:border-white/10"
                          >
                            Skill Name
                          </th>
                          <th
                            scope="col"
                            className="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                          >
                            <span className="info-icon mr-2 text-gray-500 cursor-pointer">
                              &#9432;
                              <span className="tooltip-text">
                                Your Current Ratings
                              </span>
                            </span>
                            My Rating
                          </th>
                          <th scope="col" className="px-6 py-4">
                            <span className="info-icon mr-2 text-gray-500 cursor-pointer">
                              &#9432;
                              <span className="tooltip-text">
                                Average Rating Given by your peers
                              </span>
                            </span>
                            Peer Rating
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {skillsData.map((skill, index) => (
                          <tr
                            key={skill.id}
                            className="border-b border-neutral-200 text-lg dark:border-white/10"
                          >
                            <td
                              className="whitespace-nowrap border-e border-neutral-200 text-left dark:border-white/10"
                              style={{
                                padding: "10px 10px",
                                fontFamily: "system-ui",
                                fontWeight: "400",
                                color: "#4f4f4f",
                              }}
                            >
                              {skill.skill_name}
                            </td>
                            <td
                              className="whitespace-nowrap border-e border-neutral-200 dark:border-white/10"
                              style={{
                                padding: "10px 10px",
                                fontFamily: "system-ui",
                              }}
                            >
                              {skill.user_rating === 0 ||
                              skill.user_rating === 1 ? (
                                <img
                                  src={"/images/percentage/1.svg"}
                                  width="40px"
                                  height="40px"
                                  style={{ margin: "auto" }}
                                  alt="0"
                                />
                              ) : (
                                skill.user_rating >= 2 &&
                                skill.user_rating <= 5 && (
                                  <img
                                    src={`/images/percentage/${skill.user_rating}.png`}
                                    width="40px"
                                    height="40px"
                                    style={{ margin: "auto" }}
                                    alt={`${skill.user_rating}`}
                                  />
                                )
                              )}
                            </td>
                            <td
                              className="whitespace-nowrap border-e border-neutral-200 dark:border-white/10"
                              style={{
                                padding: "10px 10px",
                                fontFamily: "system-ui",
                              }}
                            >
                              {skill.peer_avg_rating === 0 ||
                              skill.peer_avg_rating === 1 ? (
                                <img
                                  src={"/images/percentage/1.svg"}
                                  width="40px"
                                  height="40px"
                                  style={{ margin: "auto" }}
                                  alt="0"
                                />
                              ) : (
                                skill.peer_avg_rating >= 2 &&
                                skill.peer_avg_rating <= 5 && (
                                  <img
                                    src={`/images/percentage/${skill.peer_avg_rating}.png`}
                                    width="40px"
                                    height="40px"
                                    style={{ margin: "auto" }}
                                    alt={`${skill.peer_avg_rating}`}
                                  />
                                )
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
