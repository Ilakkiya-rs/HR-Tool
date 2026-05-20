"use client";
import React, { useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";

const NotificationList = () => {
    const [notifications, setNotifications] = useState([]);
    const userDetails = JSON.parse(localStorage.getItem("loginUserDetail"));
    const userId = userDetails?.individual_profile_id;

    const [pbpNotifs, setPbpNotifs] = useState([]);
    const [pcpNotifs, setPcpNotifs] = useState([]);

    useEffect(() => {
        if (userId) fetchNotifications();
    }, [userId]);

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`https://api.myskillsplus.com/closed-messages/${userId}`);
            if (!res.ok) throw new Error("Failed to fetch notifications");
            const data = await res.json();
            setNotifications(data);
            const pbp = data.filter(n => n.message_type === "pbp");
            const pcp = data.filter(n => n.message_type === "pcp");
            setPbpNotifs(pbp);
            setPcpNotifs(pcp);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const renderCards = (list) =>
        list.map((notif) => (
            <div key={notif.id} className="border border-[#C1C8D2] rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                    <div>
                        <div className="font-semibold text-base text-gray-800">
                            {encodeUserName(notif.sender_name || "Unknown Sender")}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1 gap-1">
                            <FaRegCalendarAlt className="text-gray-400" />
                            <span>
                                {new Date(notif.created_at).toLocaleDateString("en-US", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-3 sm:mt-0">
                        {notif.status === "approved" ? (
                            <button
                                className="px-4 py-1 rounded-full bg-[#1F9D6B29] text-[#1F9D6B] text-sm cursor-none"
                            >
                                Accepted
                            </button>
                        ): (
                            <button
                                className="px-4 py-1 rounded-full bg-[#F0494929] text-[#F04949] text-sm cursor-default"
                            >
                                Rejected
                            </button>
                        )}
                    </div>
                </div>
                <div className="flex items-center text-sm mb-2 gap-20">
                    {notif.job_name && (
                        <div>
                            <h3 className="text-black font-semibold mb-1">Job Name</h3>
                            <span>{notif.job_name}</span>
                        </div>
                    )}
                    {notif.job_profile_url && (
                        <div>
                            <h3 className="text-black font-semibold mb-1">Job Profile Link</h3>
                            <a
                                href={notif.job_profile_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                Click here
                            </a>
                        </div>
                    )}
                </div>
                <div className="text-sm">
                    <h3 className="text-black font-semibold mb-1">Message</h3>
                    <span>{notif.message}</span>
                </div>
            </div>
        ));
    
    const encodeUserName = (name) => {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let hash = 0;
    
        for (let i = 0; i < name.length; i++) {
            hash = (hash << 5) - hash + name.charCodeAt(i);
            hash = hash & hash;
        }
        
        let num = Math.abs(hash);
        let encoded = '';
        
        while (num > 0) {
            encoded = chars[num % 62] + encoded;
            num = Math.floor(num / 62);
        }
        
        return encoded || '0';
    };

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Share my PBP Section */}
      <div className="bg-white p-6 rounded-2xl min-h-[75vh] text-[#24303F] flex flex-col">
        <h2 className="text-base font-bold text-black mb-4">PBP Messages</h2>
        {pbpNotifs.length > 0 ? renderCards(pbpNotifs) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <img src="/images/logo/no-message.png" alt="No Data" className="w-48 mb-4" />
            <h3 className="font-semibold text-black text-lg">No closed messages yet.</h3>
            <p className="text-gray-500 text-xs text-center">Once your conversations are completed or archived, they&apos;ll appear here.</p>
          </div>
        )}
      </div>

        {/* Share my PCP Section */}
        <div className="bg-white p-6 rounded-2xl min-h-[75vh] text-[#24303F] flex flex-col">
            <h2 className="text-base font-bold text-black mb-4">PCP Messages</h2>

            {pcpNotifs.length > 0 ? (
                renderCards(pcpNotifs)
            ) : (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <img src="/images/logo/no-message.png" alt="No Data" className="w-48 mb-4" />
                    <h3 className="font-semibold text-black text-lg">No closed messages yet.</h3>
                    <p className="text-gray-500 text-xs">Once your conversations are completed or archived, they&apos;ll appear here.</p>
                </div>
            )}
        </div>

    </div>
  );
};

export default NotificationList;