"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import WalletCard from "@/components/WalletCard";

const WalletPage = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [userCountry, setUserCountry] = useState("");

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
    fetchUserCountry();
  }, []);

  const getAuthHeaders = () => {
    const tokenData = localStorage.getItem("tokenData");
    const accessToken = tokenData ? JSON.parse(tokenData)?.access : null;
  
    return {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
  };
  
  const getUserId = (): string | undefined => {
    const userDetails = localStorage.getItem("logedinUserDetail");
    if (userDetails) {
      try {
        const parsedDetails = JSON.parse(userDetails);
        return parsedDetails?.individual_profile_id;
      } catch (error) {
        console.error("Failed to parse user details from localStorage:", error);
      }
    }
    return undefined;
  };

  const fetchWallet = async () => {
    try {
      const res = await fetch(
        "https://api.myskillsplus.com/users/wallet/",
        // `${process.env.NEXT_PUBLIC_BASE_URL}/users/wallet/`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );
      if (!res.ok) throw new Error("Failed to fetch balance");
      const data = await res.json();
      setBalance(data.balance);
    } catch (err) {
      console.error(err);
    }
  };
  
  const fetchTransactions = async () => {
    try {
      const res = await fetch(
        "https://api.myskillsplus.com/users/wallet/transactions/",
        // `${process.env.NEXT_PUBLIC_BASE_URL}/users/wallet/transactions/`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error(err);
    }
  };  

  const fetchUserCountry = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      setUserCountry(data.country_name);
    } catch (err) {
      console.error("Failed to detect country", err);
      setUserCountry("United States");
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="My Wallet" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Wallet + Add Money */}
        <WalletCard
          balance={balance}
          country={userCountry}
          refreshWallet={fetchWallet}
          refreshTransactions={fetchTransactions}
        />

        {/* Transactions Preview */}
        <div className="bg-white dark:bg-[#424242] shadow-lg rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-[#616161] dark:text-[#EEEEEE]">
            Recent Transactions
          </h2>
          {transactions.length === 0 ? (
            <p className="text-[#9E9E9E]">No recent transactions</p>
          ) : (
            <ul className="space-y-3">
              {transactions.slice(0, 5).map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between border-b pb-2 last:border-none"
                >
                  <span className="text-sm text-[#757575] dark:text-[#E0E0E0]">
                    {new Date(t.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span
                    className={`font-bold ${
                      t.transaction_type === "CREDIT" && t.status !="PENDING" ? "text-green-600" : "text-[#E53935]"
                    }`}
                  >
                    {t.transaction_type === "CREDIT" && t.status !="PENDING" ? "+" : "-"} {t.amount}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <a
            href="/payments/transactions"
            className="block text-blue-600 mt-4 text-sm font-medium hover:underline"
          >
            View all transactions →
          </a>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default WalletPage;