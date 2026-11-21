
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { authFetch } from "@/lib/api";

type Appointment = {
    _id: string;
    serviceName: string;
    serviceImage: string;
    servicePrice: number;
    date: string;
    time: string;
    message: string;
    status: string;
    paymentStatus: string;
};

// status অনুযায়ী badge-এর রং
function statusColor(status: string) {
    if (status === "pending") return "bg-yellow-100 text-yellow-800";
    if (status === "confirmed") return "bg-green-100 text-green-800";
    return "bg-red-100 text-red-800";
}

export default function MyAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState<Appointment | null>(null);
    const [cancelItem, setCancelItem] = useState<Appointment | null>(null);
    const [cancelling, setCancelling] = useState(false);
    const [payingId, setPayingId] = useState("");

    // নিজের সব অ্যাপয়েন্টমেন্ট আনা
    useEffect(() => {
        async function loadAppointments() {
            try {
                const data = await authFetch("/api/appointments");
                setAppointments(data);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to load appointments");
            } finally {
                setLoading(false);
            }
        }

        loadAppointments();
    }, []);

    // Appointment Cancel করা
    async function handleCancel() {
        if (!cancelItem) return;

        setCancelling(true);

        try {
            await authFetch(`/api/appointments/${cancelItem._id}/cancel`, {
                method: "PATCH",
            });

            toast.success("Appointment cancelled successfully");

            setAppointments(
                appointments.map((a) =>
                    a._id === cancelItem._id
                        ? { ...a, status: "cancelled" }
                        : a
                )
            );

            setCancelItem(null);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to cancel");
        } finally {
            setCancelling(false);
        }
    }

    // Stripe Payment শুরু করা
    async function handlePay(id: string) {
        setPayingId(id);

        try {
            const data = await authFetch("/api/payments/checkout", {
                method: "POST",
                body: JSON.stringify({ appointmentId: id }),
            });

            window.location.href = data.url;
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to start payment");
            setPayingId("");
        }
    }

    if (loading) {
        return <div className="h-40 animate-pulse rounded-xl bg-muted" />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-foreground">My Appointments</h1>

            {/* কিছু না থাকলে বার্তা */}
            {appointments.length === 0 && (
                <div className="mt-6 rounded-xl border border-border bg-card p-8 text-center">
                    <p className="text-foreground/70">You have no appointments yet.</p>
                    <Link
                        href="/services"
                        className="mt-4 inline-block font-medium text-[#8A6A2F] hover:underline"
                    >
                        Browse Services
                    </Link>
                </div>
            )}

            {/* অ্যাপয়েন্টমেন্টের টেবিল */}
            {appointments.length > 0 && (
                <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-border bg-muted">
                            <tr>
                                <th className="p-3">Service</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Time</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Payment</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {appointments.map((item) => (
                                <tr key={item._id} className="border-b border-border last:border-0">
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={item.serviceImage}
                                                alt={item.serviceName}
                                                className="h-10 w-10 rounded-md bg-muted object-cover"
                                            />
                                            <span className="font-medium">{item.serviceName}</span>
                                        </div>
                                    </td>

                                    <td className="p-3">{item.date}</td>
                                    <td className="p-3">{item.time}</td>

                                    <td className="p-3">
                                        <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>

                                    <td className="p-3 capitalize">{item.paymentStatus}</td>

                                    {/* Actions */}
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setDetails(item)}
                                                className="rounded-md border border-border px-3 py-1 hover:bg-muted"
                                            >
                                                Details
                                            </button>

                                            {/* Cancel শুধু pending হলে */}
                                            {item.status === "pending" && (
                                                <button
                                                    type="button"
                                                    onClick={() => setCancelItem(item)}
                                                    className="rounded-md bg-red-600 px-3 py-1 text-white hover:opacity-90"
                                                >
                                                    Cancel
                                                </button>
                                            )}

                                            {/* Pay Now শুধু confirmed ও unpaid হলে */}
                                            {item.status === "confirmed" &&
                                                item.paymentStatus === "unpaid" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handlePay(item._id)}
                                                        disabled={payingId !== ""}
                                                        className="rounded-md bg-green-600 px-3 py-1 text-white hover:opacity-90 disabled:opacity-60"
                                                    >
                                                        {payingId === item._id
                                                            ? "Redirecting..."
                                                            : "Pay Now"}
                                                    </button>
                                                )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* বিস্তারিত পপআপ */}
            {details && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-xl bg-card p-6">
                        <h2 className="text-lg font-bold text-foreground">
                            {details.serviceName}
                        </h2>

                        <div className="mt-4 space-y-2 text-sm text-foreground/80">
                            <p>Date: {details.date}</p>
                            <p>Time: {details.time}</p>
                            <p>Price: ${details.servicePrice}</p>
                            <p className="capitalize">Status: {details.status}</p>
                            <p className="capitalize">Payment: {details.paymentStatus}</p>
                            <p>Message: {details.message || "No message"}</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setDetails(null)}
                            className="mt-6 w-full rounded-md bg-primary py-2 font-medium text-primary-foreground hover:opacity-90"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Cancel নিশ্চিত করার পপআপ */}
            {cancelItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-sm rounded-xl bg-card p-6">
                        <h2 className="text-lg font-bold text-foreground">
                            Cancel appointment?
                        </h2>

                        <p className="mt-2 text-sm text-foreground/70">
                            Are you sure you want to cancel your {cancelItem.serviceName} appointment?
                        </p>

                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setCancelItem(null)}
                                className="w-full rounded-md border border-border py-2 hover:bg-muted"
                            >
                                No, Keep
                            </button>

                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={cancelling}
                                className="w-full rounded-md bg-red-600 py-2 text-white hover:opacity-90 disabled:opacity-60"
                            >
                                {cancelling ? "Cancelling..." : "Yes, Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
