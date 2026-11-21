"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authFetch } from "@/lib/api";

type Transaction = {
    _id: string;
    customerName: string;
    customerEmail: string;
    serviceName: string;
    appointmentDate: string;
    amount: number;
    currency: string;
    stripeSessionId: string;
    status: string;
    createdAt: string;
};

// apiPath: কোথা থেকে ডাটা আনব, title: পেজের নাম, showCustomer: Customer কলাম দেখাব কিনা
export default function TransactionList({
    apiPath,
    title,
    showCustomer,
}: {
    apiPath: string;
    title: string;
    showCustomer: boolean;
}) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    // পেমেন্টের তালিকা আনা
    useEffect(() => {
        async function loadTransactions() {
            try {
                const data = await authFetch(apiPath);
                setTransactions(data);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to load transactions");
            } finally {
                setLoading(false);
            }
        }
        loadTransactions();
    }, [apiPath]);

    if (loading) {
        return <div className="h-40 animate-pulse rounded-xl bg-muted" />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>

            {transactions.length === 0 && <p className="mt-6 text-foreground/70">No payments found.</p>}

            {transactions.length > 0 && (
                <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-border bg-muted">
                            <tr>
                                {showCustomer && <th className="p-3">Customer</th>}
                                <th className="p-3">Service</th>
                                <th className="p-3">Appointment Date</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">Currency</th>
                                <th className="p-3">Session ID</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Payment Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((item) => (
                                <tr key={item._id} className="border-b border-border last:border-0">
                                    {showCustomer && (
                                        <td className="p-3">
                                            <p className="font-medium">{item.customerName}</p>
                                            <p className="text-xs text-foreground/70">{item.customerEmail}</p>
                                        </td>
                                    )}
                                    <td className="p-3">{item.serviceName}</td>
                                    <td className="p-3">{item.appointmentDate}</td>
                                    <td className="p-3">{item.amount}</td>
                                    <td className="p-3 uppercase">{item.currency}</td>
                                    {/* session id-র শেষ ১০টি অক্ষর (ছোট করে দেখানো) */}
                                    <td className="p-3">...{item.stripeSessionId.slice(-10)}</td>
                                    <td className="p-3">
                                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium capitalize text-green-800">
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-3">{new Date(item.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}