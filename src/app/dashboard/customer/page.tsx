"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authFetch } from "@/lib/api";

export default function CustomerOverviewPage() {
    const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, cancelled: 0 });
    const [loading, setLoading] = useState(true);

    // সার্ভার থেকে সংখ্যাগুলো আনা
    useEffect(() => {
        async function loadStats() {
            try {
                const data = await authFetch("/api/appointments/stats");
                setStats(data);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to load stats");
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, []);

    const cards = [
        { label: "Total Appointments", value: stats.total },
        { label: "Pending", value: stats.pending },
        { label: "Confirmed", value: stats.confirmed },
        { label: "Cancelled", value: stats.cancelled },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-foreground">Customer Overview</h1>

            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {cards.map((card) => (
                    <div key={card.label} className="rounded-xl border border-border bg-card p-5">
                        <p className="text-sm text-foreground/70">{card.label}</p>
                        <p className="mt-2 text-3xl font-bold text-foreground">
                            {loading ? "..." : card.value}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}