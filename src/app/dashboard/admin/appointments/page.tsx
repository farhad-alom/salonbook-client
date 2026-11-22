"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authFetch } from "@/lib/api";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Appointment = {
    _id: string;
    customerName: string;
    customerEmail: string;
    serviceName: string;
    serviceImage: string;
    serviceCategory: string;
    servicePrice: number;
    date: string;
    time: string;
    message: string;
    status: string;
    paymentStatus: string;
    createdAt: string;
};

// status অনুযায়ী badge-এর রং
function statusColor(status: string) {
    if (status === "pending") return "bg-yellow-100 text-yellow-800";
    if (status === "confirmed") return "bg-green-100 text-green-800";
    return "bg-red-100 text-red-800";
}

export default function ManageAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    // সব অ্যাপয়েন্টমেন্ট আনা
    useEffect(() => {
        async function loadAppointments() {
            try {
                const data = await authFetch("/api/admin/appointments");
                setAppointments(data);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to load appointments");
            } finally {
                setLoading(false);
            }
        }
        loadAppointments();
    }, []);

    // Confirm বা Cancel করা
    async function updateStatus(id: string, action: "confirm" | "cancel") {
        const newStatus = action === "confirm" ? "confirmed" : "cancelled";
        try {
            await authFetch(`/api/admin/appointments/${id}/${action}`, { method: "PATCH" });
            toast.success(`Appointment ${newStatus}`);

            // তালিকায় ওই অ্যাপয়েন্টমেন্টের status বদলে দেওয়া
            setAppointments(appointments.map((a) => (a._id === id ? { ...a, status: newStatus } : a)));
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update");
        }
    }

    if (loading) {
        return <div className="h-40 animate-pulse rounded-xl bg-muted" />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-foreground">Manage Appointments</h1>

            {appointments.length === 0 && (
                <p className="mt-6 text-foreground/70">No appointments found.</p>
            )}

            {appointments.length > 0 && (
                <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-border bg-muted">
                            <tr>
                                <th className="p-3">Customer</th>
                                <th className="p-3">Service</th>
                                <th className="p-3">Date & Time</th>
                                <th className="p-3">Price</th>
                                <th className="p-3">Message</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Payment</th>
                                <th className="p-3">Requested</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((item) => (
                                <tr key={item._id} className="border-b border-border last:border-0">
                                    <td className="p-3">
                                        <p className="font-medium">{item.customerName}</p>
                                        <p className="text-xs text-foreground/70">{item.customerEmail}</p>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            <img src={item.serviceImage} alt={item.serviceName} className="h-10 w-10 rounded-md bg-muted object-cover" />
                                            <div>
                                                <p className="font-medium">{item.serviceName}</p>
                                                <p className="text-xs text-foreground/70">{item.serviceCategory}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3">{item.date}<br />{item.time}</td>
                                    <td className="p-3">${item.servicePrice}</td>
                                    <td className="p-3">{item.message || "-"}</td>
                                    <td className="p-3">
                                        <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-3 capitalize">{item.paymentStatus}</td>
                                    <td className="p-3">{new Date(item.createdAt).toLocaleDateString()}</td>
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            {/* Confirm শুধু pending হলে */}
                                            {item.status === "pending" && (
                                                <button
                                                    type="button"
                                                    onClick={() => updateStatus(item._id, "confirm")}
                                                    className="rounded-md bg-green-600 px-3 py-1 text-white hover:opacity-90"
                                                >
                                                    Confirm
                                                </button>
                                            )}
                                            {/* Cancel pending বা confirmed হলে */}
                                            {item.status !== "cancelled" && (
                                                <AlertDialog>
                                                    <AlertDialogTrigger >
                                                        <button
                                                            type="button"
                                                            className="rounded-md bg-red-600 px-3 py-1 text-white hover:opacity-90"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </AlertDialogTrigger>

                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Cancel Appointment?
                                                            </AlertDialogTitle>

                                                            <AlertDialogDescription>
                                                                Are you sure you want to cancel this appointment?
                                                                This action will change the appointment status to cancelled.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>

                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                No, Keep It
                                                            </AlertDialogCancel>

                                                            <AlertDialogAction
                                                                onClick={() => updateStatus(item._id, "cancel")}
                                                                className="bg-red-600 text-white hover:bg-red-700"
                                                            >
                                                                Yes, Cancel Appointment
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}