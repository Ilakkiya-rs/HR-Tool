"use client";

import { useState } from "react";

export default function WalletCard({ balance, country, refreshWallet, refreshTransactions }) {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const currencySymbol = country === "India" ? "₹" : "$";
    const currencyCode = country === "India" ? "INR" : "USD";
    const quickAmounts = country === "India" ? [500, 1000, 2000] : [50, 100, 200];

    const getAuthHeaders = () => {
        const tokenData = localStorage.getItem("tokenData");
        const accessToken = tokenData ? JSON.parse(tokenData)?.access : null;
    
        return {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        };
    };
  
    const getUserId = () => {
        const userDetails = JSON.parse(localStorage.getItem("logedinUserDetail"));
        return userDetails?.individual_profile_id;
    };
  
    // Stripe Payment
    const handleStripePayment = async () => {
        if (!amount || Number(amount) <= 0) {
        alert("Enter a valid amount");
        return;
        }
        setLoading(true);
        try {
        // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/wallet/stripe/`, {
        const res = await fetch("https://api.myskillsplus.com/users/wallet/stripe/", {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
            individual_profile_id: getUserId(),
            amount: Number(amount),
            currency: currencyCode,
            }),
        });
        const data = await res.json();
        window.location.href = data.checkout_url;
        } catch (err) {
        alert("Stripe Payment Failed");
        } finally {
        setLoading(false);
        }
    };

    // Razorpay Payment
    const handleRazorpayPayment = async () => {
        if (!amount || Number(amount) <= 0) {
            alert("Enter a valid amount");
            return;
        }
        setLoading(true);
        try {
            // const res = await fetch(`http://127.0.0.1:8000/users/wallet/razorpay/`, {
            const res = await fetch("https://api.myskillsplus.com/users/wallet/razorpay/", {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                individual_profile_id: getUserId(),
                amount: Number(amount),  // backend multiplies by 100
                currency: currencyCode,
                }),
            });
    
            const data = await res.json();
    
            if (!data.id) {
                throw new Error("Order ID not received from backend");
            }
    
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
                amount: data.amount,          // already in paise
                currency: data.currency,
                order_id: data.id,
                name: "Wallet Top-up",
                description: "Recruiter Wallet Recharge",
                handler: async function (response) {
                try {
                    // ✅ After successful payment, call backend to verify and update wallet
                    // const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/wallet/razorpay/verify/`, {
                    const verifyRes = await fetch("https://api.myskillsplus.com/users/wallet/razorpay/verify/", {
                    method: "POST",
                    headers: getAuthHeaders(),
                    body: JSON.stringify({
                        individual_profile_id: getUserId(),
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    }),
                    });
        
                    const verifyData = await verifyRes.json();
        
                    if (verifyRes.ok && verifyData.success) {
                    alert("✅ Payment Verified & Wallet Updated!");
                    refreshWallet();
                    refreshTransactions();
                    } else {
                    alert("⚠️ Payment success but verification failed!");
                    }
                } catch (err) {
                    console.error("Verification error:", err);
                    alert("Error verifying payment.");
                }
                },
                modal: {
                ondismiss: function () {
                    alert("Payment cancelled");
                }
                },
                theme: { color: "#2563eb" },
            };
    
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            alert("Razorpay Payment Failed");
        } finally {
            setLoading(false);
        }
    };  

  return (
    <>

        {/* Wallet Balance */}
        <div className="bg-gradient-to-r from-[#46e5e2] to-[#caf4e4] text-white shadow-xl rounded-2xl p-8 relative overflow-hidden">
            <h1 className="text-lg font-medium">Wallet Balance</h1>
            <p className="text-5xl font-extrabold mt-3 flex items-center gap-2">
                {currencySymbol} {balance.toLocaleString()}
            </p>
            {country === "United States" ? (
                <div className="absolute top-0 right-0 opacity-20 text-9xl font-bold pointer-events-none">
                    💰
                </div>
            ) : (
                <div className="absolute top-0 right-0 opacity-10 text-9xl font-bold pointer-events-none">
                    🪙
                </div>
            )}
            <p className="mt-2 text-sm text-[#EEEEEE]">Detected Country: {country}</p>
        </div>

        {/* Add Money */}
        <div className="bg-white dark:bg-[#424242] shadow-md rounded-2xl p-6 mt-6">
            <h2 className="text-lg font-semibold text-[#616161] dark:text-[#EEEEEE]">
            Add Money to Wallet
            </h2>

            {/* Quick Amounts */}
            <div className="flex flex-wrap gap-3 mt-4">
            {quickAmounts.map((amt) => (
                <button
                key={amt}
                onClick={() => setAmount(amt)}
                className="bg-[#F5F5F5] dark:bg-[#616161] px-4 py-2 rounded-lg text-sm 
                            hover:bg-[#EEEEEE] dark:hover:bg-[#757575] transition shadow"
                >
                {currencySymbol}{amt}
                </button>
            ))}
            </div>

            {/* Input + Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Enter amount in ${currencyCode}`}
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none 
                        focus:ring-2 focus:ring-blue-500 dark:bg-[#616161] dark:text-white"
            />

            {country === "United States" && (
                <button
                onClick={handleStripePayment}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg 
                            transition disabled:opacity-50 shadow"
                >
                {loading ? "Processing..." : "Pay with Stripe"}
                </button>
            )}

            {country === "India" && (
                <button
                onClick={handleRazorpayPayment}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg 
                            transition disabled:opacity-50 shadow"
                >
                {loading ? "Processing..." : "Pay with Razorpay"}
                </button>
            )}
            </div>
        </div>
    </>
  );
}