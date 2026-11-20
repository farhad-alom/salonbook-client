"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

// Admin-এর সাইডবার মেনু
const adminLinks = [
    { name: "Overview", href: "/dashboard/admin" },
    { name: "Manage Services", href: "/dashboard/admin/services" },
    { name: "Add Service", href: "/dashboard/admin/services/add" },
    { name: "Manage Appointments", href: "/dashboard/admin/appointments" },
    { name: "Manage Users", href: "/dashboard/admin/users" },
    { name: "Transactions", href: "/dashboard/admin/transactions" },
    { name: "My Profile", href: "/dashboard/admin/profile" },
];

// Customer-এর সাইডবার মেনু
const customerLinks = [
    { name: "Overview", href: "/dashboard/customer" },
    { name: "My Appointments", href: "/dashboard/customer/appointments" },
    { name: "My Profile", href: "/dashboard/customer/profile" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname(); // এখন কোন পেজে আছি
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    // লগইন করা ইউজারের role
    const role = (session?.user as { role?: string } | undefined)?.role;
    const isAdmin = role === "admin";


    // ভুল role-এর ড্যাশবোর্ডে ঢুকে পড়েছে কিনা
    const wrongRole =
        (isAdmin && pathname.startsWith("/dashboard/customer")) ||
        (!isAdmin && pathname.startsWith("/dashboard/admin"));

    useEffect(() => {
        if (isPending) return; // এখনও যাচাই চলছে, একটু অপেক্ষা

        if (!session) {
            router.push("/signin"); // লগইন নেই
        } else if (wrongRole) {
            // ভুল ড্যাশবোর্ডে ঢুকলে নিজের ড্যাশবোর্ডে ফেরত পাঠানো
            router.push(isAdmin ? "/dashboard/admin" : "/dashboard/customer");
        }
    }, [isPending, session, wrongRole, isAdmin, router]);

    // যাচাই চলার সময় বা অন্য জায়গায় পাঠানোর সময় লোডিং দেখানো
    if (isPending || !session || wrongRole) {
        return (
            <main className="flex flex-1 items-center justify-center">
                <p className="animate-pulse text-foreground/70">Loading dashboard...</p>
            </main>
        );
    }

    // role অনুযায়ী মেনু বেছে নেওয়া
    const links = isAdmin ? adminLinks : customerLinks;

    return (
        <div className="flex flex-1 flex-col bg-secondary md:flex-row">
            {/* সাইডবার */}
            <aside className="border-b border-border bg-card md:w-64 md:shrink-0 md:border-b-0 md:border-r">
                <div className="p-4">
                    <p className="font-semibold text-foreground">{session.user.name}</p>
                    <p className="text-xs font-medium uppercase text-[#8A6A2F]">
                        {isAdmin ? "Admin" : "Customer"}
                    </p>
                </div>

                <nav className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-col md:pb-4">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`whitespace-nowrap rounded-md px-3 py-2 text-sm ${pathname === link.href
                                ? "bg-primary font-medium text-primary-foreground"
                                : "text-foreground hover:bg-muted"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* ডান পাশের মূল অংশ — প্রতিটা ড্যাশবোর্ড পেজ এখানে দেখাবে */}
            <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
    );
}


/*
useEffect()=>{

},[];

*/