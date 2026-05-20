"use client";

import React, { useState, useEffect } from 'react';
import { Copy, QrCode, TrendingUp, Users, DollarSign, LogOut } from "lucide-react";
import Sidebar from '@/components/Sidebar';
import { useRouter } from "next/navigation";

interface DashboardResponse {
  total_signups: number;
  active_paying_users: number;
  total_earnings: string;
  available_for_payout: string;
  referral_link: string;
  partner_name: string;
  partner_type: string;
}

interface Referral {
  referral_id: string;
  referred_email: string;
  referral_date: string;
  status: string;
  earnings_amount: number | null;
}

interface ChartData {
  month: string;
  signups: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper function to handle token expiration
  const handleTokenExpiration = () => {
    localStorage.removeItem("partnerToken");
    localStorage.removeItem("partnerId");
    router.push("/partner/login");
  };

  // Helper function to make authenticated API calls
  const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("partnerToken");
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
    if (response.status === 401 || response.status === 404) {
      handleTokenExpiration();
      return null;
    }

    return response;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('partnerToken');
        const partnerId = localStorage.getItem("partnerId");
        if (!token) {
          router.push("/partner/login");
          return;
        }

        // Fetch dashboard summary
        const dashboardResponse = await makeAuthenticatedRequest(`${process.env.NEXT_PUBLIC_API_URL}users/partner/dashboard-summary/${partnerId}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!dashboardResponse) return; // Token expired, user redirected

        if (!dashboardResponse.ok) {
          throw new Error(`Dashboard error: ${dashboardResponse.status}`);
        }

        const dashboardData: DashboardResponse = await dashboardResponse.json();
        setDashboardData(dashboardData);

        // Fetch referrals data
        const referralsResponse = await makeAuthenticatedRequest(`${process.env.NEXT_PUBLIC_API_URL}users/partner/referrals/${partnerId}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!referralsResponse) return;

        if (!referralsResponse.ok) {
          throw new Error(`Referrals error: ${referralsResponse.status}`);
        }

        const referralsData: Referral[] = await referralsResponse.json();
        setReferrals(referralsData);

        // Fetch QR code
        const qrResponse = await makeAuthenticatedRequest(`${process.env.NEXT_PUBLIC_API_URL}users/partner/referral-qr-code/${partnerId}/`);

        if (!qrResponse) return;

        if (!qrResponse.ok) {
          throw new Error(`QR Code fetch error: ${qrResponse.status}`);
        }

        const qrBlob = await qrResponse.blob();
        const qrUrl = URL.createObjectURL(qrBlob);
        setQrCodeUrl(qrUrl);

      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const copyReferralLink = () => {
    if (dashboardData?.referral_link) {
      navigator.clipboard.writeText(dashboardData.referral_link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const logout = async () => {
    try {
      const response = await makeAuthenticatedRequest(`${process.env.NEXT_PUBLIC_API_URL}auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Even if logout fails, clear localStorage and redirect
      localStorage.removeItem('partnerToken');
      localStorage.removeItem("partnerId");
      router.push("/partner/login");

    } catch (error) {
      // Clear localStorage and redirect even on error
      localStorage.removeItem('partnerToken');
      localStorage.removeItem("partnerId");
      router.push("/partner/login");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Signed Up': return 'text-blue-600 bg-blue-100';
      case 'Paid User':
      case 'Paid': return 'text-green-600 bg-green-100';
      default: return 'text-[#757575] bg-[#F5F5F5]';
    }
  };

  const normalizeStatus = (status: string) => {
    return status === 'Paid' ? 'Paid User' : status;
  };

  // Get latest 5 signups sorted by date
  const getLatestSignups = () => {
    return referrals
      .sort((a, b) => new Date(b.referral_date).getTime() - new Date(a.referral_date).getTime())
      .slice(0, 5)
      .map(referral => ({
        email: referral.referred_email,
        date: referral.referral_date,
        status: normalizeStatus(referral.status)
      }));
  };

  // Generate chart data from referrals (last 5 months)
  const getChartData = (): ChartData[] => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentDate = new Date();
    const chartData: ChartData[] = [];

    // Generate last 5 months
    for (let i = 4; i >= 0; i--) {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = monthNames[monthDate.getMonth()];
      
      // Count signups for this month
      const signupsCount = referrals.filter(referral => {
        const referralDate = new Date(referral.referral_date);
        return referralDate.getMonth() === monthDate.getMonth() && 
               referralDate.getFullYear() === monthDate.getFullYear();
      }).length;

      chartData.push({
        month: monthName,
        signups: signupsCount
      });
    }

    return chartData;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!dashboardData) {
    return <div className="flex justify-center items-center h-screen text-[#E53935]">Failed to load dashboard data.</div>;
  }

  const latestSignups = getLatestSignups();
  const chartData = getChartData();
  const maxSignups = Math.max(...chartData.map(data => data.signups), 1); // Avoid division by zero

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-[#FAFAFA] p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#212121]">Welcome, {dashboardData.partner_name}</h1>
            <p className="text-[#757575] mt-1">Partner Portal Dashboard</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white px-4 py-2 rounded-lg border border-[#EEEEEE]">
              <span className="ml-2 font-semibold text-[#212121]">{dashboardData.partner_type}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-[#E53935] hover:bg-[#D32F2F] text-white px-4 py-2 rounded-lg"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-[#757575]">Total Signups Referred</p>
                <p className="text-3xl font-bold text-[#212121] mt-2">{dashboardData.total_signups}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-[#757575]">Active Paying Users</p>
                <p className="text-3xl font-bold text-[#212121] mt-2">{dashboardData.active_paying_users}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border md:col-span-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-[#757575]">Earnings to Date</p>
                <p className="text-3xl font-bold text-[#212121] mt-2">${parseFloat(dashboardData.total_earnings).toLocaleString()}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Referral Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Referral Link */}
          {/* <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-[#212121] mb-4">Referral Link</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-[#FAFAFA] p-3 rounded-lg border">
                <span className="text-[#616161] font-mono text-sm truncate">{dashboardData.referral_link}</span>
              </div>
              <button
                onClick={copyReferralLink}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div> */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-[#212121] mb-4">Referral Link</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-[#FAFAFA] p-3 rounded-lg border">
                <span
                  className="text-[#616161] font-mono text-sm truncate"
                  title={dashboardData.referral_link}
                >
                  {dashboardData.referral_link.length > 60
                    ? `${dashboardData.referral_link.slice(0, 55)}...`
                    : dashboardData.referral_link}
                </span>
              </div>
              <button
                onClick={copyReferralLink}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Latest Signups */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-[#212121] mb-4">Latest Signups</h3>
            <div className="space-y-3">
              {latestSignups.length > 0 ? (
                latestSignups.map((signup, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-[#F5F5F5] last:border-b-0">
                    <div>
                      <p className="font-medium text-[#212121]">{signup.email}</p>
                      <p className="text-sm text-[#757575]">{formatDate(signup.date)}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(signup.status)}`}>
                      {signup.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#FAFAFA]0">No signups yet</p>
                </div>
              )}
            </div>
            <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    onClick={() => router.push('/partner/referrals')}>
              View All Referrals →
            </button>
          </div>
          {/* QR Code */}
          {/* <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-[#212121] mb-4">QR Code</h3>
            <div className="flex justify-center items-center">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="Referral QR Code" className="w-32 h-32 border rounded-lg" />
              ) : (
                <div className="w-32 h-32 bg-[#F5F5F5] border-2 border-dashed border-[#E0E0E0] rounded-lg flex justify-center items-center">
                  <QrCode className="w-16 h-16 text-[#BDBDBD]" />
                </div>
              )}
            </div>
            {qrCodeUrl && (
              <a
                href={qrCodeUrl}
                download="referral_qr.png"
                className="w-full mt-4 block bg-[#F5F5F5] hover:bg-[#EEEEEE] text-center text-[#616161] py-2 px-4 rounded-lg transition"
              >
                Download QR Code
              </a>
            )}
          </div> */}
        </div>

        {/* Bottom Section - Chart and Recent Signups */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Metrics Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-[#212121] mb-4">Referral Metrics</h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {chartData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="bg-blue-500 w-full rounded-t-md"
                    style={{ height: `${(data.signups / maxSignups) * 200}px` }}
                  ></div>
                  <span className="text-xs text-[#757575] mt-2">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}










