"use client";

import { ArrowDownCircle, ArrowUpCircle, CreditCard } from "lucide-react";

export default function TransactionList({ transactions, currencySymbol }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-[#424242] shadow-md rounded-2xl p-6 text-center">
        <p className="text-[#FAFAFA]0">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#424242] shadow-md rounded-2xl p-4">
      <h2 className="text-lg font-semibold mb-4 text-[#424242] dark:text-[#EEEEEE]">
        Recent Transactions
      </h2>

      {/* Desktop Table */}
      <div className="overflow-x-auto hiddencredit
credit md:block hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b dark:border-[#616161]">
              <th className="p-3">Date</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Type</th>
              <th className="p-3">Gateway</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr
                key={t.id}
                className="border-b dark:border-[#616161] hover:bg-[#FAFAFA] dark:hover:bg-[#616161] transition"
              >
                {/* Date */}
                <td className="p-3 text-[#757575] dark:text-[#E0E0E0]">
                  {new Date(t.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                {/* Amount */}
                <td
                  className={`p-3 font-bold flex items-center gap-2 ${
                    t.transaction_type === "CREDIT" && t.status !="PENDING" ? "text-green-600" : "text-[#E53935]"
                  }`}
                >
                  {t.transaction_type === "CREDIT" && t.status !="PENDING" ? (
                    <ArrowDownCircle className="w-4 h-4" />
                  ) : (
                    <ArrowUpCircle className="w-4 h-4" />
                  )}
                  {currencySymbol}
                  {t.amount.toLocaleString()}
                </td>

                {/* Type */}
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      t.transaction_type === "CREDIT" && t.status !="PENDING"
                        ? "bg-green-100 text-green-700"
                        : "bg-[#FFCDD2] text-[#D32F2F]"
                    }`}
                  >
                    {t.transaction_type}
                  </span>
                </td>

                {/* Gateway */}
                <td className="p-3 flex items-center gap-2 text-[#616161] dark:text-[#E0E0E0]">
                  <CreditCard className="w-4 h-4 text-[#FAFAFA]" />
                  {t.payment_gateway}
                </td>

                {/* Status */}
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      t.status === "SUCCESS"
                        ? "bg-green-100 text-green-700"
                        : t.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-[#FFCDD2] text-[#D32F2F]"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid gap-4 mt-6 md:hidden">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="p-4 border rounded-xl shadow-sm dark:border-[#616161] bg-[#FAFAFA] dark:bg-[#212121]"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-[#FAFAFA]0">
                {new Date(t.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                })}
              </span>
              <span
                className={`px-2 py-1 text-xs rounded-full font-medium ${
                  t.status === "SUCCESS"
                    ? "bg-green-100 text-green-700"
                    : t.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-[#FFCDD2] text-[#D32F2F]"
                }`}
              >
                {t.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {t.transaction_type === "CREDIT" && t.status !="PENDING" ? (
                  <ArrowDownCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <ArrowUpCircle className="w-5 h-5 text-[#F44336]" />
                )}
                <span
                  className={`font-semibold ${
                    t.transaction_type === "CREDIT" && t.status !="PENDING" ? "text-green-600" : "text-[#E53935]"
                  }`}
                >
                  {currencySymbol}
                  {t.amount.toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-[#FAFAFA]0">{t.payment_gateway}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}