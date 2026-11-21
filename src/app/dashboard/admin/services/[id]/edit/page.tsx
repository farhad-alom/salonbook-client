"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import ServiceForm from "@/components/ServiceForm";
import { type Service } from "@/components/ServiceCard";

export default function UpdateServicePage() {
    const params = useParams();
    const id = params.id as string;

    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);

    // ওই আইডির সার্ভিসের পুরনো তথ্য আনা
    useEffect(() => {
        async function loadService() {
            try {
                const data = await apiFetch(`/api/services/${id}`);
                setService(data);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to load service");
            } finally {
                setLoading(false);
            }
        }
        loadService();
    }, [id]);

    if (loading) {
        return <div className="h-40 animate-pulse rounded-xl bg-muted" />;
    }

    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold text-foreground">Update Service</h1>
            {service ? <ServiceForm service={service} /> : <p className="text-foreground/70">Service not found.</p>}
        </div>
    );
}