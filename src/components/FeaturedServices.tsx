"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import ServiceCard, { type Service } from "@/components/ServiceCard";

export default function FeaturedServices() {
    const [services, setServices] = useState<Service[]>([]); // সার্ভার থেকে আসা সার্ভিস
    const [loading, setLoading] = useState(true); // লোড হচ্ছে কিনা

    // পেজ খোলার সময় একবার সার্ভার থেকে ৬টা featured সার্ভিস আনা হবে
    useEffect(() => {
        async function loadServices() {
            try {
                const data = await apiFetch("/api/services/featured");
                setServices(data);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to load services");
            } finally {
                setLoading(false);
            }
        }
        loadServices();
    }, []);

    return (
        <section className="bg-secondary py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* সেকশনের শিরোনাম */}
                <div className="mx-auto max-w-2xl text-center">
                    <div className="mx-auto h-1 w-14 rounded-full bg-[#B8893C]" />
                    <h2 className="mt-5 text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
                        Featured Salon Services
                    </h2>
                    <p className="mt-3 text-foreground/70">
                        Our latest and most loved services, picked just for you.
                    </p>
                </div>

                {/* লোড হওয়ার সময় ধূসর বাক্স (skeleton) */}
                {loading && (
                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="h-96 animate-pulse rounded-xl bg-muted" />
                        ))}
                    </div>
                )}

                {/* কোনো সার্ভিস না থাকলে বার্তা */}
                {!loading && services.length === 0 && (
                    <p className="mt-10 text-center text-foreground/70">
                        No services available right now.
                    </p>
                )}

                {/* সার্ভিসের কার্ডগুলো */}
                {!loading && services.length > 0 && (
                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((service) => (
                            <ServiceCard key={service._id} service={service} />
                        ))}
                    </div>
                )}

                {/* সব সার্ভিস দেখার বাটন */}
                <div className="mt-10 text-center">
                    <Link
                        href="/services"
                        className="inline-block rounded-md bg-primary px-7 py-3 font-medium text-primary-foreground transition hover:opacity-90"
                    >
                        View All Services
                    </Link>
                </div>
            </div>
        </section>
    );
}