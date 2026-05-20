import React, { useEffect, useState } from "react";

interface Partner {
  partner_id: string;
  name: string;
  email: string;
  partner_type: string;
}

interface Props {
  partnerId: string;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

export default function AdminStripeCheckout({ partnerId, onClose, onSuccess }: Props) {
  const [amount, setAmount] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [partner, setPartner] = useState<Partner | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const adminToken = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  // Helper function to handle token expiration
  const handleTokenExpiration = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUsername");
    window.location.href = "/admin";
  };

  // Helper function to make authenticated API calls
  const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      handleTokenExpiration();
      return null;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    // Handle token expiration/unauthorized access
    if (response.status === 401) {
      handleTokenExpiration();
      return null;
    }

    return response;
  };

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const response = await makeAuthenticatedRequest(`${process.env.NEXT_PUBLIC_API_URL}users/admin/partners/`);
        
        if (!response) {
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch partners");
        }

        const data = await response.json();
        const matched = data.find((p: any) => p.partner_id === partnerId);
        
        if (matched) {
          setPartner(matched);
        } else {
          setError("Partner not found.");
        }
      } catch (err: any) {
        setError("Failed to load partner.");
      }
    };

    fetchPartner();
  }, [partnerId]);

  const handlePayment = async () => {
    if (!adminToken || !amount || !partnerId) {
      setError("All fields are required.");
      return;
    }

    if (amount <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    try {
      setPaying(true);
      setError(null);

      console.log("Starting payment process...", { partnerId, amount, notes });

      const response = await makeAuthenticatedRequest(`${process.env.NEXT_PUBLIC_API_URL}users/admin/payouts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          partner_id: partnerId,
          amount: amount,
          notes: notes || "",
        }),
      });

      if (!response) {
        return;
      }

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errData = await response.json();
        console.log("Error response:", errData);
        throw new Error(errData.detail || "Payment failed");
      }

      const responseData = await response.json();
      console.log("Payment successful:", responseData);

      const successMsg = `💰 Payment of $${amount} sent successfully to ${partner?.name}!`;
      setSuccessMessage(successMsg);

      // Call parent success callback
      if (onSuccess) {
        onSuccess(successMsg);
      }

      // Reset form
      setAmount(0);
      setNotes("");

      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  if (!partner) {
    return (
      <>
        <div className="fixed inset-0 bg-[#212121] bg-opacity-50 z-40" onClick={onClose}></div>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-auto p-6">
            <div className="text-center">
              <p className="text-[#757575]">Loading partner details...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Modal Overlay */}
      <div 
        className="fixed inset-0 bg-[#212121] bg-opacity-50 z-40"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-auto transform transition-all">
          <div className="px-6 py-4 border-b border-[#EEEEEE]">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-[#212121]">
                Pay {partner.name}
              </h2>
              <button
                onClick={onClose}
                className="text-[#BDBDBD] hover:text-[#757575] text-2xl font-bold leading-none"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Partner Info Display */}
            <div className="bg-[#FAFAFA] p-4 rounded-md mb-4">
              <h4 className="text-sm font-medium text-[#616161] mb-2">Partner Details</h4>
              <div className="space-y-1 text-sm text-[#757575]">
                <p><span className="font-medium">Name:</span> {partner.name}</p>
                <p><span className="font-medium">Email:</span> {partner.email}</p>
                <p><span className="font-medium">Type:</span> {partner.partner_type}</p>
              </div>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{successMessage}</span>
                </div>
                <p className="text-sm mt-1">Closing automatically...</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-[#FFCDD2] border border-[#EF5350] text-[#D32F2F] rounded-md">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#616161] mb-2">
                  Amount ($) <span className="text-[#F44336]">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={amount || ""}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  placeholder="Enter amount"
                  disabled={paying || !!successMessage}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#616161] mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this payout..."
                  rows={3}
                  disabled={paying || !!successMessage}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handlePayment}
                  disabled={paying || !!successMessage || !amount || amount <= 0}
                  className={`flex-1 px-4 py-2 rounded-md text-white font-medium transition-colors ${
                    paying || !!successMessage || !amount || amount <= 0
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  }`}
                >
                  {paying ? "Processing Payment..." : successMessage ? "Payment Completed ✓" : "Send Payment"}
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-[#EEEEEE] text-[#616161] rounded-md hover:bg-[#E0E0E0] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#FAFAFA]0 focus:ring-offset-2"
                >
                  {successMessage ? "Close" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}



