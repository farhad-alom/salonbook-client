"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authFetch } from "@/lib/api";

type User = {
    _id: string;
    name: string;
    email: string;
    image: string;
    phone: string;
    isBlocked: boolean;
    createdAt: string;
};

export default function ManageUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // সব customer আনা
    useEffect(() => {
        async function loadUsers() {
            try {
                const data = await authFetch("/api/admin/users");
                setUsers(data);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to load users");
            } finally {
                setLoading(false);
            }
        }
        loadUsers();
    }, []);

    // Block <-> Unblock করা
    async function toggleBlock(user: User) {
        const newValue = !user.isBlocked;
        try {
            await authFetch(`/api/admin/users/${user._id}/block-status`, {
                method: "PATCH",
                body: JSON.stringify({ isBlocked: newValue }),
            });
            toast.success(newValue ? "User blocked successfully" : "User unblocked successfully");

            // তালিকায় ওই ইউজারের অবস্থা বদলে দেওয়া
            setUsers(users.map((u) => (u._id === user._id ? { ...u, isBlocked: newValue } : u)));
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update user");
        }
    }

    if (loading) {
        return <div className="h-40 animate-pulse rounded-xl bg-muted" />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-foreground">Manage Users</h1>

            {users.length === 0 && <p className="mt-6 text-foreground/70">No customers found.</p>}

            {users.length > 0 && (
                <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-border bg-muted">
                            <tr>
                                <th className="p-3">User</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Phone</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Joined</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-b border-border last:border-0">
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            {user.image ? (
                                                <img src={user.image} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <span className="font-medium">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">{user.phone || "-"}</td>
                                    <td className="p-3">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${user.isBlocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                                                }`}
                                        >
                                            {user.isBlocked ? "Blocked" : "Active"}
                                        </span>
                                    </td>
                                    <td className="p-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="p-3">
                                        <button
                                            type="button"
                                            onClick={() => toggleBlock(user)}
                                            className={`rounded-md px-3 py-1 text-white hover:opacity-90 ${user.isBlocked ? "bg-green-600" : "bg-red-600"
                                                }`}
                                        >
                                            {user.isBlocked ? "Unblock" : "Block"}
                                        </button>
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