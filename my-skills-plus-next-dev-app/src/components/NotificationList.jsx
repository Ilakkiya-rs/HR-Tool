"use client";
import React, { useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";

const NotificationList = () => {
  const [activeNotifs, setActiveNotifs] = useState([]);
  const [closedNotifs, setClosedNotifs] = useState([]);
  const [filterPbp, setFilterPbp] = useState(false);
  const [filterPcp, setFilterPcp] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReasons, setRejectionReasons] = useState([]);
  const [rejectionNote, setRejectionNote] = useState("");
  const [rejectingNotif, setRejectingNotif] = useState(null);

  const userDetails = JSON.parse(localStorage.getItem("loginUserDetail"));
  const userId = userDetails?.individual_profile_id;

  const reasonOptions = [
    "The JSP (Job Skills Profile) is not interesting",
    "The JBP (Job Background Profile) is not interesting",
    "Can't give time for the recruitment process now",
    "Others",
  ];

  useEffect(() => {
    if (userId) {
      const fetchAll = async () => {
        const [activeRes, closedRes] = await Promise.all([
          fetch(`https://api.myskillsplus.com/notifications/${userId}`),
          fetch(`https://api.myskillsplus.com/closed-messages/${userId}`),
        ]);
        const activeData = await activeRes.json();
        const closedData = await closedRes.json();
        setActiveNotifs(activeData);
        setClosedNotifs(closedData);
      };
      fetchAll();
    }
  }, [userId]);

  const filtered = (list) =>
    list.filter(
      (n) =>
        (!filterPbp && !filterPcp) ||
        (filterPbp && n.message_type === "pbp") ||
        (filterPcp && n.message_type === "pcp")
    );

  const handleResponse = async (notifId, senderId, jobId, messageType, action) => {
    await fetch(`https://api.myskillsplus.com/notification-responds/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receiver_id: userId,
        notification_id: notifId,
        sender_id: senderId,
        job_id: jobId,
        message_type: messageType,
        status: action === "accept" ? "approved" : "rejected",
      }),
    });
    const activeRes = await fetch(`https://api.myskillsplus.com/notifications/${userId}`);
    const closedRes = await fetch(`https://api.myskillsplus.com/closed-messages/${userId}`);
    setActiveNotifs(await activeRes.json());
    setClosedNotifs(await closedRes.json());
  };

  const handleRejectSubmit = async () => {
    try {
      const res = await fetch('https://api.myskillsplus.com/notifications/reject-reason/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiver_id: userId,
          notification_id: rejectingNotif.id,
          sender_id: rejectingNotif.sender_id,
          job_id: rejectingNotif.job_id,
          reasons: rejectionReasons,
          other_note: rejectionNote
        })
      });
  
      if (!res.ok) {
        throw new Error('Failed to save rejection reason');
      }
  
      await handleResponse(
        rejectingNotif.id,
        rejectingNotif.sender_id,
        rejectingNotif.job_id,
        rejectingNotif.message_type,
        "reject"
      );
  
      setShowRejectModal(false);
      setRejectionNote("");
      setRejectionReasons([]);
    } catch (error) {
        console.error("Rejection reason error:", error);
        setShowRejectModal(false);
        setRejectionNote("");
        setRejectionReasons([]);
        alert("Failed to save rejection reason. Please try again.");
    }
  };

  const renderCards = (list, isActive = true) =>
    list.map((notif) => (
      <div key={notif.id} className="bg-white border border-[#EEEEEE] rounded-xl p-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
          <div>
            <div className="font-bold text-lg text-[#212121]">
              {notif.sender_id}
            </div>
            <div className="text-xs text-[#9E9E9E] flex items-center gap-1 mt-1">
              <FaRegCalendarAlt className="text-[#BDBDBD]" />
              <span>
                {new Date(notif.created_at).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                })}
              </span>
            </div>
        </div>
        {isActive && (
            <div className="flex gap-3 sm:mt-0 mt-3">
            <button
                onClick={() => {
                setRejectingNotif(notif);
                setShowRejectModal(true);
                }}
                className="px-4 py-1 rounded-full bg-red hover:bg-[#F04949] text-white text-sm font-medium"
            >
                Reject
            </button>
            <button
                onClick={() => handleResponse(notif.id, notif.sender_id, notif.job_id, notif.message_type, "accept")}
                className="px-4 py-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
            >
                Accept
            </button>
            </div>
        )}
        {!isActive && (
          notif.status === "approved" ? (
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
          )
        )}
        </div>
        <div className="text-sm space-y-2 text-[#616161]">
          {notif.job_name && (
            <div><strong>Job Title:</strong> {notif.job_name}</div>
          )}
          {notif.job_profile_url && (
            <div><strong>Job Profile Link:</strong> <a href={notif.job_profile_url} target="_blank" className="text-blue-600 underline">View</a></div>
          )}
          {notif.job_background_url && (
            <div><strong>Job Background Profile:</strong> <a href={notif.job_background_url} target="_blank" className="text-blue-600 underline">View</a></div>
          )}
          <div><strong>Message:</strong> {notif.message || "N/A"}</div>
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={filterPbp} onChange={() => setFilterPbp(!filterPbp)} />
          <span className="text-sm font-medium text-[#616161]">New Background View Interest</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={filterPcp} onChange={() => setFilterPcp(!filterPcp)} />
          <span className="text-sm font-medium text-[#616161]">New Contact Interest</span>
        </label>
      </div>

      <div className="bg-white p-4 rounded-xl">
        <h2 className="text-xl font-bold text-[#212121] mb-3">Active Requests</h2>
        {filtered(activeNotifs).length > 0 ? renderCards(filtered(activeNotifs), true) : <p className="text-[#9E9E9E]">No active notifications</p>}
      </div>

      <div className="bg-white p-4 rounded-xl">
        <h2 className="text-xl font-bold text-[#212121] mb-3">Closed Requests</h2>
        {filtered(closedNotifs).length > 0 ? renderCards(filtered(closedNotifs), false) : <p className="text-[#9E9E9E]">No closed notifications</p>}
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative shadow-lg">
            <button
              onClick={() => setShowRejectModal(false)}
              className="absolute top-2 right-2 text-[#9E9E9E] hover:text-black text-2xl"
            >
              &times;
            </button>
            <h3 className="font-semibold text-lg mb-4 text-[#424242]">Reason for Declining</h3>
            <div className="space-y-2">
              {reasonOptions.map((reason) => (
                <label key={reason} className="flex items-center gap-2 text-sm text-[#616161]">
                  <input
                    type="checkbox"
                    value={reason}
                    checked={rejectionReasons.includes(reason)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setRejectionReasons([...rejectionReasons, reason]);
                      } else {
                        setRejectionReasons(rejectionReasons.filter((r) => r !== reason));
                      }
                    }}
                  />
                  {reason}
                </label>
              ))}
              {rejectionReasons.includes("Others") && (
                <textarea
                  placeholder="Please share info"
                  className="w-full border border-[#E0E0E0] rounded-md p-2 mt-2 text-sm"
                  rows={3}
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                />
              )}
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleRejectSubmit}
                  className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
