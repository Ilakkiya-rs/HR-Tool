'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
  } from "@stripe/react-stripe-js";
  import { loadStripe } from "@stripe/stripe-js";
  
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const DirectContact = () => {
  const [viewMode, setViewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const userDetails = JSON.parse(localStorage.getItem("logedinUserDetail"));
  const userId = userDetails?.individual_profile_id;
  const [profiles, setProfiles] = useState([]);
  const [shortlistedProfiles, setShortlistedProfiles] = useState([]);
  const router = useRouter("");
  const [pbpMessageText, setPbpMessageText] = useState("");
  const [pcpMessageText, setPcpMessageText] = useState("");
  const [popupTarget, setPopupTarget] = useState({ userId: null, type: null });
  const [tooltipTarget, setTooltipTarget] = useState({ userId: null, type: null });
  const [showPbpPaymentModal, setShowPbpPaymentModal] = useState(false);
  const [showPcpPaymentModal, setShowPcpPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState({ userId: null, amount: 0, msgType:"", contactId: null });

  const openPaymentModal = (userId, amount, msgType, contactId) => {
    if(msgType == "pbp") {
      setSelectedPayment({ userId, amount, msgType, contactId });
      setShowPbpPaymentModal(true);
    }
    else if(msgType == "pcp") {
      setSelectedPayment({ userId, amount, msgType, contactId });
      setShowPcpPaymentModal(true);
    }
  };
  
  const closePaymentModal = (msgType) => {
    if(msgType === "pcp") {
      setShowPcpPaymentModal(false);
      setSelectedPayment({ userId: null, amount: 0, msgType:"", contactId: null });
    } else if(msgType === "pbp") {
      setShowPbpPaymentModal(false);
      setSelectedPayment({ userId: null, amount: 0, msgType:"", contactId: null });
    }
  };
  
  const fetchShortlistedProfiles = async () => {
    try {
    //   const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/api/get-direct-contacts/${userId}`);
      const res = await fetch(`https://api.myskillsplus.com/users/api/get-direct-contacts/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch shortlisted users");
  
      const data = await res.json();

      const flattenedProfiles = data.map(item => {
        const contact = item.direct_contacts || {};
        return {
          ...contact,
          ...contact.shortlisted_profiles,
        };
      });
  
      setProfiles(flattenedProfiles);
      return flattenedProfiles;
    } catch (error) {
      console.error("Error fetching shortlisted profiles:", error);
    }
  };  

  useEffect(() => {
    setLoading(true);
    fetchShortlistedProfiles();
    setViewMode(true);
    setLoading(false);

  }, []);

  const handleInitialMessage = async (userId, type, content) => {
    try {
    //   const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/initiate-message/`, {
      const res = await fetch('https://api.myskillsplus.com/initiate-message/', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            recruiter_id: userDetails?.individual_profile_id,
            user_id: userId,
            message_type: type,
            message: content,
        }),
      });
  
      if (!res.ok) throw new Error("Failed to send message");
  
      fetchShortlistedProfiles();
      alert("Message sent successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to send message");
    }
  };

  return loading ? (
    <p>Loading...</p>
  ) : viewMode ? (
    <>
        <div className="p-4 sm:p-6 rounded-xl bg-white shadow">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-center border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 border">Shortlisted Profile</th>
                            {/* PBP Columns */}
                            <th className="p-3 border">PBP View Fee</th>
                            <th className="p-3 border">Pay PBP View Fee</th>
                            <th className="p-3 border">Message for PBP</th>
                            <th className="p-3 border">Status of PBP</th>

                            {/* PCP Columns */}
                            <th className="p-3 border">PCP View Fee</th>
                            <th className="p-3 border">Pay PCP View Fee</th>
                            <th className="p-3 border">Message for PCP</th>
                            <th className="p-3 border">Status of PCP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profiles.map((profile) => {
                            return (
                                <tr key={profile.contact_id} className="border-t">
                                    <td
                                      className="p-3 border font-medium text-blue-600"
                                    >
                                      {profile.contact_id}
                                    </td>
                                    {/* PBP Fee */}
                                    <td className="p-3 border">
                                        {profile.vsp_details?.pbpFee || "-"} $
                                    </td>
                                    {/* PBP Pay */}
                                    <td className="p-3 border">
                                        {profile.pbp_is_paid ? (
                                        <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">Paid</span>
                                        ) : (
                                        <button
                                            onClick={() => openPaymentModal(profile.recruiter_id, profile.vsp_details?.pbpFee || 0,"pbp", profile.contact_id)}
                                            className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full"
                                        >
                                            Pay
                                        </button>
                                        )}
                                        {showPbpPaymentModal && (
                                            <>
                                                {/* Overlay */}
                                                <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => closePaymentModal("pbp")} />
                                                {/* Modal Content */}
                                                <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white w-[90%] sm:w-[400px] p-6 rounded-xl shadow-xl">
                                                <h2 className="text-lg font-semibold mb-4">Complete PBP Payment</h2>
                                                  <Elements stripe={stripePromise}>
                                                      <CheckoutForm
                                                        userId={selectedPayment.userId}
                                                        amount={selectedPayment.amount}
                                                        msgType={selectedPayment.msgType}
                                                        contactId={selectedPayment.contactId}
                                                        onClose={() => closePaymentModal("pbp")}
                                                      />
                                                  </Elements>
                                                </div>
                                            </>
                                        )}
                                    </td>
                                    {/* PBP Message */}
                                    <td className="p-3 border">
                                        {profile.pbp_is_paid ? (
                                            <div className="relative inline-block">
                                                <button 
                                                    onClick={() => {
                                                    if (profile.pbp_msg_status === "approved") {
                                                        router.push("/messages");
                                                    } else if (profile.pbp_msg_status === "rejected") {
                                                        setTooltipTarget({ userId: profile.recruiter_id, type: "pbp" });
                                                        setTimeout(() => setTooltipTarget({ userId: null, type: null }), 3000);
                                                    } else if (profile.pbp_msg_status === "pending") {
                                                        setTooltipTarget({ userId: profile.recruiter_id, type: "pbp" });
                                                        setTimeout(() => setTooltipTarget({ userId: null, type: null }), 3000);
                                                    } else {
                                                        setPopupTarget({ userId: profile.recruiter_id, type: "pbp" });
                                                    }
                                                    }}
                                                    className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full"
                                                >
                                                    Message
                                                </button>

                                                {/* Tooltip for pending status */}
                                                {tooltipTarget.userId === profile.recruiter_id && tooltipTarget.type === "pbp" && (
                                                    <div className="absolute -top-2/3 left-1/2 transform -translate-x-1/2 w-64 text-center text-xs bg-yellow-100 border border-yellow-300 text-yellow-800 rounded shadow p-2 z-50">
                                                        Waiting for user approval to start conversation...
                                                    </div>
                                                )}

                                                {tooltipTarget.userId === profile.recruiter_id && tooltipTarget.type === "noBackgroundProfile" && (
                                                  <div className="absolute -top-2/3 left-1/2 transform -translate-x-1/2 w-64 text-center text-xs bg-red-100 border border-red-300 text-red-800 rounded shadow p-2 z-50">
                                                    User has not submitted a background profile for this job.
                                                  </div>
                                                )}
                                                {/* Modal popup for first-time message */}
                                                {popupTarget.userId === profile.recruiter_id && popupTarget.type === "pbp" && (
                                                    <>
                                                    {/* Background Blur Overlay */}
                                                    <div
                                                        className="fixed inset-0 bg-black bg-opacity-40 z-40"
                                                        onClick={() => setPopupTarget({ userId: null, type: null })}
                                                    />
                                                    {/* Centered Modal */}
                                                    <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white w-[90%] sm:w-[400px] p-6 rounded-xl shadow-xl">
                                                        <h3 className="text-lg font-semibold mb-2">Send Message</h3>
                                                        <textarea
                                                            value={pbpMessageText}
                                                            onChange={(e) => setPbpMessageText(e.target.value)}
                                                            placeholder="Enter message..."
                                                            className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none"
                                                            rows={4}
                                                        />
                                                        <div className="flex justify-end gap-2 mt-4">
                                                            <button
                                                                onClick={() => {
                                                                handleInitialMessage(profile.contact_id, "pbp", pbpMessageText);
                                                                setPopupTarget({ userId: null, type: null });
                                                                setPbpMessageText("");
                                                                }}
                                                                className="bg-green-500 text-white px-5 py-1 rounded-full hover:bg-green-700"
                                                            >
                                                                Send
                                                            </button>
                                                            <button
                                                                onClick={() => setPopupTarget({ userId: null, type: null })}
                                                                className="bg-gray text-black px-3 py-1 rounded-full hover:bg-gray-800"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            <button
                                                className="bg-gray-300 text-gray-800 text-xs px-3 py-1 rounded-full cursor-not-allowed"
                                                disabled
                                            >
                                                Message
                                            </button>
                                        )}
                                    </td>
                                    {/* PBP Status */}
                                    <td className="p-3 border">
                                        {profile.pbp_msg_status === "approved" ? (
                                            <span className={"text-xs px-3 py-1 rounded-full bg-green-200 text-green-700"}>
                                                {profile.pbp_msg_status}
                                             </span>
                                        ) : profile.pbp_msg_status === "rejected" ?(
                                            <span className="bg-[#F0494929] text-[#F04949] text-xs px-3 py-1 rounded-full">{profile.pbp_msg_status}</span>
                                        ) : profile.pbp_msg_status === "pending" ? (
                                            <span className="bg-yellow-200 text-yellow-700 text-xs px-3 py-1 rounded-full">{profile.pbp_msg_status}</span>
                                        ) : (
                                            <span className="text-gray-400 text-xs">---</span>
                                        )}
                                    </td>

                                    {/* PCP Fee */}
                                    <td className="p-3 border">
                                        {profile.vsp_details?.pcpFee || "-"} $
                                    </td>
                                    {/* PCP Pay */}
                                    <td className="p-3 border">
                                        {profile.pcp_is_paid ? (
                                        <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">Paid</span>
                                        ) : (
                                        <button
                                            onClick={() => openPaymentModal(profile.recruiter_id, profile.vsp_details?.pcpFee || 0, "pcp", profile.contact_id)}
                                            className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full"
                                        >
                                            Pay
                                        </button>
                                        )}
                                        {showPcpPaymentModal && (
                                            <>
                                                {/* Overlay */}
                                                <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => closePaymentModal("pcp")} />
                                                {/* Modal Content */}
                                                <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white w-[90%] sm:w-[400px] p-6 rounded-xl shadow-xl">
                                                <h2 className="text-lg font-semibold mb-4">Complete PCP Payment</h2>
                                                  <Elements stripe={stripePromise}>
                                                      <CheckoutForm
                                                        userId={selectedPayment.userId}
                                                        amount={selectedPayment.amount}
                                                        msgType={selectedPayment.msgType}
                                                        contactId={selectedPayment.contactId}
                                                        onClose={() => closePaymentModal("pcp")}
                                                      />
                                                  </Elements>
                                                </div>
                                            </>
                                        )}
                                    </td>
                                    {/* PCP Message */}
                                    <td className="p-3 border">
                                        {profile.pcp_is_paid ? (
                                            <div className="relative inline-block">
                                                <button 
                                                    onClick={() => {
                                                    if (profile.pcp_msg_status === "approved") {
                                                        router.push("/messages");
                                                    } else if (profile.pcp_msg_status === "rejected") {
                                                        setTooltipTarget({ userId: profile.recruiter_id, type: "pcp" });
                                                        setTimeout(() => setTooltipTarget({ userId: null, type: null }), 3000);
                                                    } else if (profile.pcp_msg_status === "pending") {
                                                        setTooltipTarget({ userId: profile.recruiter_id, type: "pcp" });
                                                        setTimeout(() => setTooltipTarget({ userId: null, type: null }), 3000);
                                                    } else {
                                                        setPopupTarget({ userId: profile.recruiter_id, type: "pcp" });
                                                    }
                                                    }}
                                                    className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full"
                                                >
                                                    Message
                                                </button>

                                                {/* Tooltip for pending status */}
                                                {tooltipTarget.userId === profile.recruiter_id && tooltipTarget.type === "pcp" && (
                                                    <div className="absolute -top-2/3 left-1/2 transform -translate-x-1/2 w-64 text-center text-xs bg-yellow-100 border border-yellow-300 text-yellow-800 rounded shadow p-2 z-50">
                                                        Waiting for user approval to start conversation...
                                                    </div>
                                                )}

                                                {/* Modal popup for first-time message */}
                                                {popupTarget.userId === profile.recruiter_id && popupTarget.type === "pcp" && (
                                                    <>
                                                    {/* Background Blur Overlay */}
                                                    <div
                                                        className="fixed inset-0 bg-black bg-opacity-40 z-40"
                                                        onClick={() => setPopupTarget({ userId: null, type: null })}
                                                    />
                                                    {/* Centered Modal */}
                                                    <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white w-[90%] sm:w-[400px] p-6 rounded-xl shadow-xl">
                                                        <h3 className="text-lg font-semibold mb-2">Send Message</h3>
                                                        <textarea
                                                            value={pcpMessageText}
                                                            onChange={(e) => setPcpMessageText(e.target.value)}
                                                            placeholder="Enter message..."
                                                            className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none"
                                                            rows={4}
                                                        />
                                                        <div className="flex justify-end gap-2 mt-4">
                                                            <button
                                                                onClick={() => {
                                                                handleInitialMessage(profile.contact_id, "pcp", pcpMessageText);
                                                                setPopupTarget({ userId: null, type: null });
                                                                setPcpMessageText("");
                                                                }}
                                                                className="bg-green-500 text-white px-5 py-1 rounded-full hover:bg-green-700"
                                                            >
                                                                Send
                                                            </button>
                                                            <button
                                                                onClick={() =>   setPopupTarget({ userId: null, type: null })}
                                                                className="bg-gray text-black px-3 py-1 rounded-full hover:bg-gray-800"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            <button
                                                className="bg-gray-300 text-gray-800 text-xs px-3 py-1 rounded-full cursor-not-allowed"
                                                disabled
                                            >
                                                Message
                                            </button>
                                        )}
                                    </td>
                                    {/* PCP Status */}
                                    <td className="p-3 border">
                                        {profile.pcp_msg_status === "approved" ? (
                                            <span className={"text-xs px-3 py-1 rounded-full bg-green-200 text-green-700"}>
                                                {profile.pcp_msg_status}
                                            </span>
                                        ) : profile.pcp_msg_status === "rejected" ?(
                                            <span className="bg-[#F0494929] text-[#F04949] text-xs px-3 py-1 rounded-full">{profile.pcp_msg_status}</span>
                                        ) : profile.pcp_msg_status === "pending" ? (
                                            <span className="bg-yellow-200 text-yellow-700 text-xs px-3 py-1 rounded-full">{profile.pcp_msg_status}</span>
                                        ) : (
                                            <span className="text-gray-400 text-xs">---</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </>
  ) : null;
};

const CheckoutForm = ({ userId, amount, msgType, contactId, onClose }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
    
      const tokenData = localStorage.getItem("tokenData");
      const accessToken = tokenData ? JSON.parse(tokenData)?.access : null;
    
      try {
        if (!stripe || !elements) throw new Error("Stripe is not ready");
    
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/create-payment-intent/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId, amount }),
        });
    
        if (!res.ok) {
          const errorData = await res.text();
          throw new Error(`Backend error: ${res.status} - ${errorData}`);
        }
    
        const data = await res.json();
        const clientSecret = data.clientSecret;
        if (!clientSecret) throw new Error("No clientSecret received");
    
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });
    
        if (result.error) {
          setStatusMessage({ type: "error", text: result.error.message });
        } else if (result.paymentIntent.status === "succeeded") {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/handle-payment-success/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: userId,
              payment_intent_id: result.paymentIntent.id,
              message_type: msgType,
              contact_id: contactId,
            }),
          });
    
          setStatusMessage({ type: "success", text: "🎉 Payment successful!" });
          onClose();
          // fetchShortlistedProfiles();
        }
      } catch (err) {
        console.error(err);
        setStatusMessage({ type: "error", text: err.message });
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {statusMessage && (
          <div className={`px-4 py-2 rounded ${statusMessage.type === "success" ? "bg-green-100" : "bg-red-100"}`}>
            {statusMessage.text}
          </div>
        )}
        <CardElement className="border p-2 rounded" />
        <button
          type="submit"
          disabled={!stripe || loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {loading ? "Processing..." : `Pay $${amount}`}
        </button>
      </form>
    );
};
export default DirectContact;