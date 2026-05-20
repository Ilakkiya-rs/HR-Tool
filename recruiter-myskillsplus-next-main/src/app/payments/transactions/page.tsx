"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TransactionList from "@/components/TransactionList";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [currencySymbol, setCurrencySymbol] = useState("💰");

  useEffect(() => {
    fetchTransactions();
    fetchLocation();
  }, []);

  const getAuthHeaders = () => {
    const tokenData = localStorage.getItem("tokenData");
    const accessToken = tokenData ? JSON.parse(tokenData)?.access : null;
  
    return {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
  };
  
  const fetchTransactions = async () => {
    try {
      const res = await fetch(
        // `${process.env.NEXT_PUBLIC_BASE_URL}/users/wallet/transactions/`,
        "https://api.myskillsplus.com/users/wallet/transactions/",
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

  const fetchLocation = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      if (data.country_code === "IN") {
        setCurrencySymbol("₹");
      } else if (data.country_code === "US") {
        setCurrencySymbol("$");
      } else {
        setCurrencySymbol("💰");
      }
    } catch (err) {
      console.error("Failed to fetch location:", err);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Transactions" />
      <TransactionList transactions={transactions} currencySymbol={currencySymbol} />
    </DefaultLayout>
  );
};

export default TransactionsPage;