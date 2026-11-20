"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import ServiceCard, { type Service } from "@/components/ServiceCard";

// category-র তালিকা (বানান Categories.tsx-এর সাথে হুবহু এক)
const categories = [
    "Haircut & Styling",
    "Hair Coloring",
    "Hair Treatment",
    "Facial & Skincare",
    "Makeup",
    "Manicure & Pedicure",
    "Spa & Massage",
];

export default function ServicesBrowser({ initialCategory }: { initialCategory: string }) {
    const [services, setServices] = useState<Service[]>([]); // সার্ভার থেকে আসা সার্ভিস
    const [loading, setLoading] = useState(true); // লোড হচ্ছে কিনা
    const [searchText, setSearchText] = useState(""); // search বাক্সে যা লেখা হচ্ছে
    const [search, setSearch] = useState(""); // Search বাটনে চাপ দেওয়ার পর যা খোঁজা হবে
    const [category, setCategory] = useState(initialCategory);
    const [sort, setSort] = useState("");

    // search, category বা sort বদলালেই সার্ভার থেকে নতুন করে সার্ভিস আনা হবে
    useEffect(() => {
        async function loadServices() {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (search) params.append("search", search);
                if (category) params.append("category", category);
                if (sort) params.append("sort", sort);

                const data = await apiFetch(`/api/services?${params.toString()}`);
                setServices(data);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to load services");
            } finally {
                setLoading(false);
            }
        }

        loadServices();
    },




        [search, category, sort]);

    // Search বাটনে চাপ দিলে
    function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault(); // পেজ রিলোড বন্ধ রাখা
        setSearch(searchText.trim());
    }

    const inputClass =
        "rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

    return (
        <main className="bg-secondary px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* শিরোনাম */}
                <div className="h-1 w-14 rounded-full bg-[#B8893C]" />
                <h1 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
                    Browse Salon Services
                </h1>
                <p className="mt-1 text-foreground/70">
                    Find the perfect service and book your appointment.
                </p>

                {/* search, category আর sort */}
                <div className="mt-6 flex flex-col gap-3 lg:flex-row">
                    <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Search services by name"
                            className={`${inputClass} flex-1`}
                        />
                        <button
                            type="submit"
                            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                        >
                            Search
                        </button>
                    </form>

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={inputClass}
                    >
                        <option value="">All Categories</option>
                        {categories.map((name) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>

                    <select value={sort} onChange={(e) => setSort(e.target.value)} className={inputClass}>
                        <option value="">Sort by Price</option>
                        <option value="asc">Price: Low to High</option>
                        <option value="desc">Price: High to Low</option>
                    </select>
                </div>

                {/* লোড হওয়ার সময় ধূসর বাক্স (skeleton) দেখানো */}
                {loading && (
                    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="h-96 animate-pulse rounded-xl bg-muted" />
                        ))}
                    </div>
                )}

                {/* কিছু না পাওয়া গেলে বার্তা */}
                {!loading && services.length === 0 && (
                    <p className="mt-12 text-center text-foreground/70">
                        No services found. Try a different search or category.
                    </p>
                )}

                {/* সার্ভিসের কার্ডগুলো */}
                {!loading && services.length > 0 && (
                    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((service) => (
                            <ServiceCard key={service._id} service={service} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}