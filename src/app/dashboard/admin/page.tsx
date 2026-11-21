


import { authFetch } from '@/lib/api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const AdminOverViewPage = () => {

    const [stats, setStats] = useState({ customer: 0, activeServices: 0, total: 0, pending: 0, confirmed: 0, payments: 0 });

    const [loading, setLoading] = useState(true);
    // সার্ভার থেকে সংখ্যাগুলো আনা
    useEffect(() => {
        async function loadStats() {
            try {
                const data = await authFetch("/api/admin/stats");
                setStats(data)
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to load stats");
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, []);


    const cards = [
        { label: "Total Customers", value: stats.customer },
        { label: "Active Service", value: stats.activeServices },
        { label: "Total Appoinments", value: stats.total },
        { label: "Pending", value: stats.pending },
        { lable: "Successfull", value: stats.payments },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Overview</h1>

            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
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
};

export default AdminOverViewPage;