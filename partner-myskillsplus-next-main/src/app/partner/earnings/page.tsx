'use client';
import Sidebar from "@/components/Sidebar";
import React, { useState, useEffect } from "react";

interface PayoutHistoryItem {
  payout_id: string;
  payout_date: string;
  amount: string;
  status: string;
  notes: string;
}

interface DashboardData {
  total_signups: number;
  active_paying_users: number;
  total_earnings: string;
  available_for_payout: string;
  referral_link: string;
  partner_name: string;
  partner_type: string;
}

export default function PartnerEarnings() {
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [payoutHistory, setPayoutHistory] = useState<PayoutHistoryItem[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard summary data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('partnerToken');
        const partnerId = localStorage.getItem("partnerId");
        if (!token) {
          throw new Error('No partner token found');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/partner/dashboard-summary/${partnerId}/`, {
          method: 'GET',
          headers: {
            // 'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch dashboard data: ${response.status}`);
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch payout history data
  useEffect(() => {
    const fetchPayoutHistory = async () => {
      try {
        const token = localStorage.getItem('partnerToken');
        const partnerId = localStorage.getItem("partnerId");
        if (!token) {
          throw new Error('No partner token found');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/partner/payouts/${partnerId}/`, {
          method: 'GET',
          headers: {
            // 'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch payout history: ${response.status}`);
        }

        const data = await response.json();
        setPayoutHistory(data);
      } catch (err) {
        console.error('Error fetching payout history:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPayoutHistory();
  }, []);

  // Filter payouts based on status
  const filteredPayouts = payoutHistory.filter((payout: PayoutHistoryItem) => {
    if (statusFilter === "All statuses") return true;
    if (statusFilter === "Completed") return payout.status === "Completed";
    if (statusFilter === "Pending") return payout.status === "Pending";
    if (statusFilter === "Failed") return payout.status === "Failed";
    return true;
  });

  // Calculate metrics from payout data
  const calculateMetrics = () => {
    const completedPayouts = payoutHistory.filter((p: PayoutHistoryItem) => p.status === "Completed");
    const withdrawnAmount = completedPayouts.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    
    return {
      totalEarnings: dashboardData ? parseFloat(dashboardData.total_earnings) : 0,
      availableForPayout: dashboardData ? parseFloat(dashboardData.available_for_payout) : 0,
      withdrawnAmount: withdrawnAmount
    };
  };

  const metrics = calculateMetrics();

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get status badge color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-[#FFCDD2] text-[#C62828]';
      default:
        return 'bg-[#F5F5F5] text-[#424242]';
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#FAFAFA]">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-[#9E9E9E]">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-[#FAFAFA]">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-[#F44336]">Error: {error}</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FAFAFA]">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold text-[#212121] mb-8">Earnings & Payouts</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-[#EEEEEE] p-6">
            <h3 className="text-lg font-medium text-[#616161] mb-2">Total Earnings</h3>
            <p className="text-3xl font-bold text-[#212121]">${metrics.totalEarnings.toFixed(2)}</p>
          </div>
          
          <div className="bg-white rounded-lg border border-[#EEEEEE] p-6">
            <h3 className="text-lg font-medium text-[#616161] mb-2">Available for Payout</h3>
            <p className="text-3xl font-bold text-[#212121]">${metrics.availableForPayout.toFixed(2)}</p>
          </div>

          <div className="bg-white rounded-lg border border-[#EEEEEE] p-6">
            <h3 className="text-lg font-medium text-[#616161] mb-2">Total Withdrawn</h3>
            <p className="text-3xl font-bold text-[#212121]">${metrics.withdrawnAmount.toFixed(2)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-4 mb-6">
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-[#E0E0E0] rounded-md px-4 py-2 pr-8 text-[#616161] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>All statuses</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>Failed</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-[#BDBDBD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Payout History Table */}
        <div className="bg-white rounded-lg border border-[#EEEEEE] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#FAFAFA]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#212121]">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#212121]">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#212121]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#212121]">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEE]">
              {filteredPayouts.length > 0 ? (
                filteredPayouts.map((payout) => (
                  <tr key={payout.payout_id} className="hover:bg-[#FAFAFA]">
                    <td className="px-6 py-4 text-sm text-[#212121]">
                      {formatDate(payout.payout_date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#212121]">
                      ${parseFloat(payout.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payout.status)}`}>
                        {payout.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#FAFAFA]0 max-w-xs truncate">
                      {payout.notes}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-[#FAFAFA]0">
                    No payout history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}