'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminStripeCheckout from "@/components/AdminStripeCheckout";

interface Partner {
  partner_id: string;
  name: string;
  email: string;
  phone?: string;
  partner_type: string;
  country: string;
  status: "pending" | "approved" | "rejected";
}

export default function AdminDashboard() {
  const router = useRouter();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminUsername, setAdminUsername] = useState<string>("Admin");
  const [checkoutPartnerId, setCheckoutPartnerId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Helper function to handle token expiration
  const handleTokenExpiration = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUsername");
    router.push("/admin");
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
        // Authorization: `Bearer ${token}`,
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
    const token = localStorage.getItem("adminToken");
    const username = localStorage.getItem("adminUsername");

    if (!token) {
      router.push("/admin");
      return;
    }

    setAdminToken(token);
    setAdminUsername(username || "Admin");

    const fetchPartners = async () => {
      try {
        setLoading(true);
        const response = await makeAuthenticatedRequest(`${process.env.NEXT_PUBLIC_API_URL}users/admin/partners/`);
        
        // If response is null, it means token expired and user was redirected
        if (!response) {
          return;
        }

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail || "Failed to fetch partners");
        }

        const data = await response.json();
        const normalizedData: Partner[] = data.map((partner: any) => ({
          ...partner,
          status: partner.status.toLowerCase().trim() as "pending" | "approved" | "rejected",
        }));
        console.log(normalizedData);
        setPartners(normalizedData);
      } catch (err: any) {
        console.log("error fetching partners");
        setError(err.message || "Error fetching partners");
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, [router]);

  useEffect(() => {
    // Auto-hide success message after 5 seconds
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleAction = async (partnerId: string, action: "approve" | "reject") => {
    if (!adminToken) return;

    setActionLoading((prev) => ({ ...prev, [partnerId]: true }));

    try {
      const endpoint = `${process.env.NEXT_PUBLIC_API_URL}users/admin/partners/${partnerId}/${action}/`;

      const response = await makeAuthenticatedRequest(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // If response is null, it means token expired and user was redirected
      if (!response) {
        return;
      }

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || `Failed to ${action} partner`);
      }

      setPartners((prev) =>
        prev.map((p) =>
          p.partner_id === partnerId
            ? { ...p, status: action === "approve" ? "approved" : "rejected" }
            : p
        )
      );
    } catch (err: any) {
      setError(err.message || `Failed to ${action} partner`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [partnerId]: false }));
    }
  };

  const handleLogout = async () => {
    if (!adminToken) return;

    try {
      const response = await makeAuthenticatedRequest(`${process.env.NEXT_PUBLIC_API_URL}admin/logout`, {
        method: "POST",
      });

      // Even if the logout request fails (e.g., due to expired token), 
      // we still want to clear local storage and redirect
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUsername");
      router.push("/admin");
    } catch (err: any) {
      // Clear local storage and redirect even on error
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUsername");
      router.push("/admin");
    }
  };

  const handlePayoutSuccess = (message: string) => {
    setSuccessMessage(message);
    setCheckoutPartnerId(null); // Close the checkout modal
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#616161] text-lg">
        Loading partners...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#E53935] text-lg px-4 text-center">
        {error}
        <button 
          onClick={() => setError(null)}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 px-4 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-[#212121] mb-6">Admin Dashboard</h1>
      <div className="flex justify-between items-center mb-8">
        <p className="text-xl">
          Welcome, <span className="font-semibold">{adminUsername}</span>
        </p>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red text-white rounded hover:bg-[#D32F2F]"
        >
          Logout
        </button>
      </div>

      {/* Global Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{successMessage}</span>
            </div>
            <button 
              onClick={() => setSuccessMessage(null)}
              className="text-green-700 hover:text-green-900 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Partners Management */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[#212121] mb-4">Partners Management</h2>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow p-6">
        <table className="min-w-full divide-y divide-[#EEEEEE]">
          <thead className="bg-[#F5F5F5]">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[#616161]">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[#616161]">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[#616161]">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[#616161]">Partner Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[#616161]">Country</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[#616161]">Status</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-[#616161]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEEEEE]">
            {partners.map((partner) => (
              <tr key={partner.partner_id} className="hover:bg-[#FAFAFA]">
                <td className="px-6 py-4 text-sm text-[#212121]">{partner.name}</td>
                <td className="px-6 py-4 text-sm text-[#212121]">{partner.email}</td>
                <td className="px-6 py-4 text-sm text-[#212121]">{partner.phone || "-"}</td>
                <td className="px-6 py-4 text-sm text-[#212121]">{partner.partner_type}</td>
                <td className="px-6 py-4 text-sm text-[#212121]">{partner.country}</td>
                <td
                  className={`px-6 py-4 text-sm font-semibold ${
                    partner.status === "approved"
                      ? "text-green-600"
                      : partner.status === "rejected"
                      ? "text-[#E53935]"
                      : "text-yellow-600"
                  }`}
                >
                  {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  {partner.status === "pending" ? (
                    <>
                      <button
                        disabled={actionLoading[partner.partner_id]}
                        onClick={() => handleAction(partner.partner_id, "approve")}
                        className={`px-3 py-1 rounded text-white text-sm ${
                          actionLoading[partner.partner_id]
                            ? "bg-green-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        Approve
                      </button>
                      <button
                        disabled={actionLoading[partner.partner_id]}
                        onClick={() => handleAction(partner.partner_id, "reject")}
                        className={`px-3 py-1 rounded text-white text-sm ${
                          actionLoading[partner.partner_id]
                            ? "bg-red cursor-not-allowed"
                            : "bg-red hover:bg-[#D32F2F]"
                        }`}
                      >
                        Reject
                      </button>
                    </>
                  ) : partner.status === "approved" ? (
                    <button
                      onClick={() => setCheckoutPartnerId(partner.partner_id)}
                      className="px-3 py-1 rounded text-white bg-blue-600 hover:bg-blue-700 text-sm"
                    >
                      Pay
                    </button>
                  ) : (
                    <span className="text-[#BDBDBD] italic">No actions available</span>
                  )}
                </td>
              </tr>
            ))}

            {partners.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-[#FAFAFA]0">
                  No partners found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* AdminStripeCheckout Component */}
      {checkoutPartnerId && (
        <AdminStripeCheckout
          partnerId={checkoutPartnerId}
          onClose={() => setCheckoutPartnerId(null)}
          onSuccess={handlePayoutSuccess}
        />
      )}
    </div>
  );
}




