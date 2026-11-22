
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authFetch } from "@/lib/api";

// User-এর তথ্যের Type
type User = {
    _id: string;
    name: string;
    email: string;
    image: string;
    phone: string;
    role?: string;
    isBlocked: boolean;
    createdAt: string;
};

export default function ManageUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Popup-এর জন্য State
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    // সব Customer Load করা
    useEffect(() => {
        async function loadUsers() {
            try {
                const data = await authFetch("/api/admin/users");
                setUsers(data);
            } catch (error) {
                toast.error("Failed to load users");
            } finally {
                setLoading(false);
            }
        }

        loadUsers();
    }, []);

    // User-এর Details দেখা
    async function viewUserDetails(id: string) {
        setDetailsLoading(true);

        try {
            const data = await authFetch(`/api/admin/users/${id}`);

            setSelectedUser(data);
        } catch (error) {
            toast.error("Failed to load user details");
        } finally {
            setDetailsLoading(false);
        }
    }

    // User Block অথবা Unblock করা
    async function toggleBlock(user: User) {
        const newValue = !user.isBlocked;

        try {
            await authFetch(`/api/admin/users/${user._id}/block-status`, {
                method: "PATCH",
                body: JSON.stringify({
                    isBlocked: newValue,
                }),
            });

            toast.success(
                newValue
                    ? "User blocked successfully"
                    : "User unblocked successfully"
            );

            setUsers(
                users.map((u) =>
                    u._id === user._id
                        ? { ...u, isBlocked: newValue }
                        : u
                )
            );

            // Popup খোলা থাকলে সেখানেও Status Update করা
            if (selectedUser?._id === user._id) {
                setSelectedUser({
                    ...selectedUser,
                    isBlocked: newValue,
                });
            }
        } catch (error) {
            toast.error("Failed to update user");
        }
    }

    if (loading) {
        return <p>Loading users...</p>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-foreground">
                Manage Users
            </h1>

            {users.length === 0 && (
                <p className="mt-6">No customers found.</p>
            )}

            {users.length > 0 && (
                <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">

                    <table className="w-full text-left text-sm">

                        <thead className="border-b bg-muted">
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
                                <tr key={user._id} className="border-b">

                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            {user.image ? (
                                                <img
                                                    src={user.image}
                                                    alt={user.name}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}

                                            {user.name}
                                        </div>
                                    </td>

                                    <td className="p-3">{user.email}</td>

                                    <td className="p-3">
                                        {user.phone || "-"}
                                    </td>

                                    <td className="p-3">
                                        {user.isBlocked ? "Blocked" : "Active"}
                                    </td>

                                    <td className="p-3">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>

                                    <td className="p-3">
                                        <div className="flex flex-wrap gap-2">

                                            {/* View Details Button */}
                                            <button
                                                onClick={() =>
                                                    viewUserDetails(user._id)
                                                }
                                                className="rounded-md bg-blue-600 px-3 py-1 text-white"
                                            >
                                                View Details
                                            </button>

                                            {/* Block / Unblock Button */}
                                            <button
                                                onClick={() => toggleBlock(user)}
                                                className={`rounded-md px-3 py-1 text-white ${user.isBlocked
                                                    ? "bg-green-600"
                                                    : "bg-red-600"
                                                    }`}
                                            >
                                                {user.isBlocked ? "Unblock" : "Block"}
                                            </button>

                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            )}

            {/* User Details Popup */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl">

                        <div className="mb-5 flex items-center justify-between">

                            <h2 className="text-xl font-bold">
                                User Details
                            </h2>

                            <button
                                onClick={() => setSelectedUser(null)}
                                className="text-xl font-bold"
                            >
                                X
                            </button>

                        </div>

                        {detailsLoading ? (
                            <p>Loading details...</p>
                        ) : (
                            <div className="space-y-4">

                                <div className="flex items-center gap-4">

                                    {selectedUser.image && (
                                        <img
                                            src={selectedUser.image}
                                            alt={selectedUser.name}
                                            className="h-16 w-16 rounded-full object-cover"
                                        />
                                    )}

                                    <h3 className="text-lg font-semibold">
                                        {selectedUser.name}
                                    </h3>

                                </div>

                                <p>
                                    <strong>Name:</strong> {selectedUser.name}
                                </p>

                                <p>
                                    <strong>Email:</strong> {selectedUser.email}
                                </p>

                                <p>
                                    <strong>Phone:</strong> {selectedUser.phone || "Not provided"}
                                </p>

                                <p>
                                    <strong>Role:</strong> {selectedUser.role || "customer"}
                                </p>

                                <p>
                                    <strong>Status:</strong>{" "}
                                    {selectedUser.isBlocked ? "Blocked" : "Active"}
                                </p>

                                <p>
                                    <strong>Joined:</strong>{" "}
                                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                                </p>

                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="w-full rounded-md bg-gray-800 px-4 py-2 text-white"
                                >
                                    Close
                                </button>

                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
}
