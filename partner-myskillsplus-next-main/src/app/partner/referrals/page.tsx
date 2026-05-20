"use client"

import React, { useState, useEffect } from 'react';
import { Search, Users, ChevronDown, MoreHorizontal } from 'lucide-react';
import { useRouter } from "next/navigation";
import Sidebar from '@/components/Sidebar';

interface Referral {
    referral_id: string;
    referred_email: string;
    referral_date: string;
    status: string;
    earnings_amount: number | null;
}

const timeRangeOptions = [
    "All time",
    "Last 30 days",
    "Last 90 days",
    "Last 6 months",
    "Last year"
];

const statusOptions = [
    "All statuses",
    "Signed Up",
    "Paid User"
];

export default function Referrals() {
    const router = useRouter();
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTimeRange, setSelectedTimeRange] = useState("All time");
    const [selectedStatus, setSelectedStatus] = useState("All statuses");
    const [showTimeDropdown, setShowTimeDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        const token = localStorage.getItem("partnerToken");
        const partnerId = localStorage.getItem("partnerId");
        if (!token) {
            router.push("/partner/login");
            return;
        }

        const fetchReferrals = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/partner/referrals/${partnerId}/`, {
                    method: "GET",
                    headers: {
                        // "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem("partnerToken");
                        router.push("/partner/login");
                        return;
                    }
                    throw new Error(`Failed to fetch referrals: ${response.status}`);
                }

                const data = await response.json();
                console.log(data)
                setReferrals(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load referrals");
            } finally {
                setLoading(false);
            }
        };

        fetchReferrals();
    }, [router]);

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

const filterByTimeRange = (referral: Referral, timeRange: string) => {
    if (timeRange === "All time") return true;
    
    const referralDate = new Date(referral.referral_date);
    const now = new Date();
    
    // Create cutoff dates by going back in time from now
    let cutoffDate: Date;
    
    switch (timeRange) {
        case "Last 30 days":
            cutoffDate = new Date(now);
            cutoffDate.setDate(now.getDate() - 30);
            break;
        case "Last 90 days":
            cutoffDate = new Date(now);
            cutoffDate.setDate(now.getDate() - 90);
            break;
        case "Last 6 months":
            cutoffDate = new Date(now);
            cutoffDate.setMonth(now.getMonth() - 6);
            break;
        case "Last year":
            cutoffDate = new Date(now);
            cutoffDate.setFullYear(now.getFullYear() - 1);
            break;
        default:
            return true;
    }
    
    // Return true if referral date is after cutoff date
    return referralDate >= cutoffDate;
};
    const filteredReferrals = referrals.filter(referral => {
        const matchesSearch = referral.referred_email.toLowerCase().includes(searchTerm.toLowerCase());
        const normalizedStatus = normalizeStatus(referral.status);
        const matchesStatus = selectedStatus === "All statuses" || normalizedStatus === selectedStatus;
        const matchesTimeRange = filterByTimeRange(referral, selectedTimeRange);
        
        return matchesSearch && matchesStatus && matchesTimeRange;
    });

    // Reset to first page when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedStatus, selectedTimeRange]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredReferrals.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentReferrals = filteredReferrals.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
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
        return (
            <div className='flex min-h-screen'>
                <Sidebar/>
                <div className="flex-1 bg-[#FAFAFA] p-6">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[#212121]">Referrals</h1>
                        <p className="text-[#757575] mt-1">Track and manage your referred users</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-[#EEEEEE] p-8">
                        <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-[#757575]">Loading referrals...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex min-h-screen'>
                <Sidebar/>
                <div className="flex-1 bg-[#FAFAFA] p-6">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[#212121]">Referrals</h1>
                        <p className="text-[#757575] mt-1">Track and manage your referred users</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-[#EEEEEE] p-8">
                        <div className="text-center">
                            <div className="text-[#F44336] mb-2">
                                <Users className="w-12 h-12 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-[#212121] mb-1">Error loading referrals</h3>
                            <p className="text-[#757575]">{error}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='flex min-h-screen'>
            <Sidebar/>
            <div className="flex-1 bg-[#FAFAFA] p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#212121]">Referrals</h1>
                    <p className="text-[#757575] mt-1">Track and manage your referred users</p>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#EEEEEE] mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Time Range Filter */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-[#616161] mb-2">Referred</label>
                            <button
                                onClick={() => {
                                    setShowTimeDropdown(!showTimeDropdown);
                                    setShowStatusDropdown(false);
                                }}
                                className="w-full bg-white border border-[#E0E0E0] rounded-lg px-3 py-2 text-left flex items-center justify-between hover:border-[#BDBDBD] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <span className="text-[#616161]">{selectedTimeRange}</span>
                                <ChevronDown className="w-4 h-4 text-[#FAFAFA]0" />
                            </button>
                            {showTimeDropdown && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-[#E0E0E0] rounded-lg shadow-lg">
                                    {timeRangeOptions.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setSelectedTimeRange(option);
                                                setShowTimeDropdown(false);
                                            }}
                                            className="w-full px-3 py-2 text-left hover:bg-[#F5F5F5] first:rounded-t-lg last:rounded-b-lg"
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-[#616161] mb-2">Status</label>
                            <button
                                onClick={() => {
                                    setShowStatusDropdown(!showStatusDropdown);
                                    setShowTimeDropdown(false);
                                }}
                                className="w-full bg-white border border-[#E0E0E0] rounded-lg px-3 py-2 text-left flex items-center justify-between hover:border-[#BDBDBD] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <span className="text-[#616161]">{selectedStatus}</span>
                                <ChevronDown className="w-4 h-4 text-[#FAFAFA]0" />
                            </button>
                            {showStatusDropdown && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-[#E0E0E0] rounded-lg shadow-lg">
                                    {statusOptions.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setSelectedStatus(option);
                                                setShowStatusDropdown(false);
                                            }}
                                            className="w-full px-3 py-2 text-left hover:bg-[#F5F5F5] first:rounded-t-lg last:rounded-b-lg"
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-[#616161] mb-2">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#BDBDBD]" />
                                <input
                                    type="text"
                                    placeholder="Search by email"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Referrals Table */}
                <div className="bg-white rounded-xl shadow-sm border border-[#EEEEEE]">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-[#EEEEEE]">
                                <tr>
                                    <th className="text-left py-4 px-6 font-semibold text-[#212121]">Email</th>
                                    <th className="text-left py-4 px-6 font-semibold text-[#212121]">Date Referred</th>
                                    <th className="text-left py-4 px-6 font-semibold text-[#212121]">Status</th>
                                    <th className="text-left py-4 px-6 font-semibold text-[#212121]">Earnings</th>
                                    <th className="text-center py-4 px-6 font-semibold text-[#212121]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentReferrals.map((referral) => (
                                    <tr key={referral.referral_id} className="border-b border-[#F5F5F5] hover:bg-[#FAFAFA]">
                                        <td className="py-4 px-6">
                                            <span className="font-medium text-[#212121]">{referral.referred_email}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-[#757575]">{formatDate(referral.referral_date)}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(referral.status)}`}>
                                                {normalizeStatus(referral.status)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            {referral.earnings_amount !== null ? 
                                                <span className="text-[#212121]">{referral.earnings_amount}$</span>
                                                : <span className="text-[#212121]">-----</span>}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <button className="text-[#BDBDBD] hover:text-[#757575]">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {currentReferrals.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <div className="text-[#BDBDBD] mb-2">
                                <Users className="w-12 h-12 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-[#212121] mb-1">No referrals found</h3>
                            <p className="text-[#757575]">
                                {referrals.length === 0 
                                    ? "You haven't made any referrals yet." 
                                    : "Try adjusting your filters or search terms."
                                }
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {filteredReferrals.length > 0 && (
                        <div className="px-6 py-4 border-t border-[#EEEEEE] flex items-center justify-between">
                            <div className="text-sm text-[#757575]">
                                Showing {startIndex + 1} to {Math.min(endIndex, filteredReferrals.length)} of {filteredReferrals.length} referrals
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 text-sm border border-[#E0E0E0] rounded ${
                                        currentPage === 1 
                                            ? 'bg-[#F5F5F5] text-[#BDBDBD] cursor-not-allowed' 
                                            : 'hover:bg-[#FAFAFA] text-[#616161]'
                                    }`}
                                >
                                    Previous
                                </button>
                                
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                        // Show first page, last page, current page, and pages around current page
                                        const showPage = page === 1 || 
                                                        page === totalPages || 
                                                        Math.abs(page - currentPage) <= 1;
                                        
                                        if (!showPage && page === 2 && currentPage > 4) {
                                            return <span key={page} className="px-2 text-[#BDBDBD]">...</span>;
                                        }
                                        
                                        if (!showPage && page === totalPages - 1 && currentPage < totalPages - 3) {
                                            return <span key={page} className="px-2 text-[#BDBDBD]">...</span>;
                                        }
                                        
                                        if (!showPage) return null;
                                        
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => goToPage(page)}
                                                className={`px-3 py-1 text-sm border rounded ${
                                                    currentPage === page
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'border-[#E0E0E0] text-[#616161] hover:bg-[#FAFAFA]'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                </div>
                                
                                <button 
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-1 text-sm border border-[#E0E0E0] rounded ${
                                        currentPage === totalPages 
                                            ? 'bg-[#F5F5F5] text-[#BDBDBD] cursor-not-allowed' 
                                            : 'hover:bg-[#FAFAFA] text-[#616161]'
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}




