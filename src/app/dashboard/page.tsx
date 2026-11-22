// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { authClient } from "@/lib/auth-client";

// // /dashboard খুললে role দেখে ঠিক ড্যাশবোর্ডে পাঠিয়ে দেয়
// export default function DashboardRedirectPage() {
//     const router = useRouter();
//     const { data: session } = authClient.useSession();
//     const role = (session?.user as { role?: string } | undefined)?.role;

//     useEffect(() => {
//         if (role === "admin") {
//             router.replace("/dashboard/admin");
//         } else {
//             router.replace("/dashboard/customer");
//         }
//     }, [role, router]);

//     return <p className="animate-pulse text-foreground/70">Redirecting...</p>;
// }







"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function DashboardRedirectPage() {
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        if (isPending) return;

        if (!session) {
            router.replace("/signin");
            return;
        }

        const role = (
            session.user as { role?: string }
        ).role;

        if (role === "admin") {
            router.replace("/dashboard/admin");
        } else {
            router.replace("/dashboard/customer");
        }
    }, [session, isPending, router]);

    if (isPending) {
        return <p>Loading your dashboard...</p>;
    }

    return <p>Redirecting...</p>;
}
