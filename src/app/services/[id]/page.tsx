"use client";

import { useEffect, useState, type SubmitEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { apiFetch, authFetch } from "@/lib/api";
import { type Service } from "@/components/ServiceCard";
import { toast } from "sonner";

// বুকিংয়ের জন্য সময়ের তালিকা
const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

export default function ServiceDetailsPage() {
    const params = useParams();
    const id = params.id as string; // লিংকের শেষের অংশ (সার্ভিসের id)
    const router = useRouter();

    // লগইন করা আছে কিনা, সেটা জানার জন্য
    const { data: session, isPending } = authClient.useSession();
    const isLoggedIn = Boolean(session);

    const [service, setService] = useState<Service | null>(null); // সার্ভার থেকে আসা সার্ভিস
    const [loading, setLoading] = useState(true); // লোড হচ্ছে কিনা
    const [errorMessage, setErrorMessage] = useState(""); // সার্ভার error দিলে সেই লেখা
    // বুকিং ফর্মের তথ্য
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [message, setMessage] = useState("");
    const [booking, setBooking] = useState(false); // সাবমিট হচ্ছে কিনা

    // ১. লগইন না থাকলে Sign In পেজে পাঠানো
    useEffect(() => {
        if (!isPending && !isLoggedIn) {
            router.push("/signin");
        }
    }, [isPending, isLoggedIn, router]);

    // ২. লগইন থাকলে সার্ভার থেকে সার্ভিসটা আনা
    useEffect(() => {
        if (!isLoggedIn) return;

        async function loadService() {
            try {
                const data = await apiFetch(`/api/services/${id}`);
                setService(data);
            } catch (error) {
                setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
            } finally {
                setLoading(false);
            }
        }

        loadService();
    }, [isLoggedIn, id]);

    // লোড হওয়ার সময় (বা Sign In-এ যাওয়ার সময়) ধূসর বাক্স দেখানো
    if (isPending || !session || loading) {
        return (
            <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="h-72 animate-pulse rounded-xl bg-muted md:h-96" />
                    <div className="h-72 animate-pulse rounded-xl bg-muted md:h-96" />
                </div>
            </main>
        );
    }

    // ভুল id বা সার্ভিস না পেলে সুন্দর error দেখানো
    if (errorMessage || !service) {
        return (
            <main className="flex flex-1 items-center justify-center px-4 py-16">
                <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center">
                    <h1 className="text-2xl font-bold text-foreground">Service not available</h1>
                    <p className="mt-2 text-foreground/70">
                        {errorMessage || "We could not find this service."}
                    </p>
                    <Link
                        href="/services"
                        className="mt-6 inline-block rounded-md bg-primary px-6 py-2.5 font-medium text-primary-foreground hover:opacity-90"
                    >
                        Back to Services
                    </Link>
                </div>
            </main>
        );
    }

    // লগইন করা ইউজারের role (admin নাকি customer)
    const role = (session.user as { role?: string }).role;

    // আজকের তারিখ (আগের তারিখ বাছাই আটকানোর জন্য)
    const today = new Date().toISOString().split("T")[0];

    // ফর্ম সাবমিট হলে সার্ভারে বুকিং পাঠানো
    async function handleBook(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!date || !time) {
            toast.error("Please select date and time");
            return;
        }

        // start the booking processing thats why setBooking(true);
        setBooking(true);
        try {
            await authFetch("/api/appointments", {
                method: "POST",
                body: JSON.stringify({ serviceId: id, date, time, message }),
            });
            toast.success("Appointment requested successfully");
            setDate("");
            setTime("");
            setMessage("");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Booking failed");
        } finally {
            setBooking(false);
        }
    }

    return (
        <main className="bg-secondary px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                {/* ফেরার লিংক */}
                <Link href="/services" className="text-sm font-medium text-[#8A6A2F] hover:underline">
                    &larr; Back to Services
                </Link>

                <div className="mt-6 grid gap-8 md:grid-cols-2">
                    {/* বাঁ দিকে ছবি */}
                    <img
                        src={service.image}
                        alt={service.serviceName}
                        className="h-72 w-full rounded-xl bg-muted object-cover md:h-96"
                    />

                    {/* ডান দিকে তথ্য */}
                    <div>
                        <span className="text-sm font-medium text-[#8A6A2F]">{service.category}</span>
                        <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
                            {service.serviceName}
                        </h1>
                        <p className="mt-4 text-foreground/80">{service.description}</p>

                        {/* দাম আর সময় */}
                        <div className="mt-6 flex gap-4">
                            <div className="rounded-lg border border-border bg-card px-5 py-3">
                                <p className="text-xs text-foreground/70">Price</p>
                                <p className="text-xl font-bold text-foreground">${service.price}</p>
                            </div>
                            <div className="rounded-lg border border-border bg-card px-5 py-3">
                                <p className="text-xs text-foreground/70">Duration</p>
                                <p className="text-xl font-bold text-foreground">{service.duration} min</p>
                            </div>
                        </div>

                        {/* বুকিংয়ের অংশ */}
                        <div className="mt-8">
                            {/* সার্ভিস inactive হলে বুকিং বন্ধ */}
                            {service.status !== "active" && (
                                <p className="rounded-md border border-border bg-card p-4 text-foreground/70">
                                    This service is currently unavailable for booking.
                                </p>
                            )}

                            {/* admin বুকিং করতে পারবে না */}
                            {service.status === "active" && role === "admin" && (
                                <p className="rounded-md border border-border bg-card p-4 text-foreground/70">
                                    Admins cannot book appointments.
                                </p>
                            )}

                            {/* customer এবং active সার্ভিস হলে বুকিং ফর্ম */}
                            {service.status === "active" && role !== "admin" && (
                                <form onSubmit={handleBook} className="space-y-4 rounded-xl border border-border bg-card p-5">
                                    <h2 className="text-lg font-bold text-foreground">Book Appointment</h2>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-foreground">Date</label>
                                        <input
                                            type="date"
                                            min={today}
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full rounded-md border border-border bg-background px-3 py-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-foreground">Time</label>
                                        <select
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            className="w-full rounded-md border border-border bg-background px-3 py-2"
                                        >
                                            <option value="">Select a time</option>
                                            {timeSlots.map((slot) => (
                                                <option key={slot} value={slot}>
                                                    {slot}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-foreground">Message (optional)</label>
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            rows={3}
                                            className="w-full rounded-md border border-border bg-background px-3 py-2"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={booking}
                                        className="w-full rounded-md bg-primary px-8 py-3 font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
                                    >
                                        {booking ? "Booking..." : "Book Appointment"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}