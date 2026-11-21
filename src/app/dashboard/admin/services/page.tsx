"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { authFetch } from "@/lib/api";
import { type Service } from "@/components/ServiceCard";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function ManageServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteItem, setDeleteItem] = useState<Service | null>(null); // Delete ডায়ালগ
    const [deleting, setDeleting] = useState(false);

    // সব সার্ভিস আনা
    useEffect(() => {
        async function loadServices() {
            try {
                const data = await authFetch("/api/admin/services");
                setServices(data);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to load services");
            } finally {
                setLoading(false);
            }
        }
        loadServices();
    }, []);

    // Active <-> Inactive বদলানো
    async function toggleStatus(service: Service) {
        const newStatus = service.status === "active" ? "inactive" : "active";
        try {
            await authFetch(`/api/admin/services/${service._id}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status: newStatus }),
            });
            toast.success(`Service is now ${newStatus}`);
            setServices(services.map((s) => (s._id === service._id ? { ...s, status: newStatus } : s)));
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update status");
        }
    }

    // "Yes, Delete" চাপলে সার্ভিস মোছা
    async function handleDelete() {
        if (!deleteItem) return;
        setDeleting(true);
        try {
            await authFetch(`/api/admin/services/${deleteItem._id}`, { method: "DELETE" });
            toast.success("Service deleted successfully");
            setServices(services.filter((s) => s._id !== deleteItem._id));
            setDeleteItem(null);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete service");
        } finally {
            setDeleting(false);
        }
    }

    if (loading) {
        return <div className="h-40 animate-pulse rounded-xl bg-muted" />;
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Manage Services</h1>
                <Link
                    href="/dashboard/admin/services/add"
                    className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:opacity-90"
                >
                    Add Service
                </Link>
            </div>

            {services.length === 0 && <p className="mt-6 text-foreground/70">No services found.</p>}

            {/* সার্ভিসের টেবিল */}
            {services.length > 0 && (
                <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-border bg-muted">
                            <tr>
                                <th className="p-3">Service</th>
                                <th className="p-3">Category</th>
                                <th className="p-3">Price</th>
                                <th className="p-3">Duration</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service) => (
                                <tr key={service._id} className="border-b border-border last:border-0">
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            <img src={service.image} alt={service.serviceName} className="h-10 w-10 rounded-md bg-muted object-cover" />
                                            <span className="font-medium">{service.serviceName}</span>
                                        </div>
                                    </td>
                                    <td className="p-3">{service.category}</td>
                                    <td className="p-3">${service.price}</td>
                                    <td className="p-3">{service.duration} min</td>
                                    <td className="p-3">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${service.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {service.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/dashboard/admin/services/${service._id}/edit`}
                                                className="rounded-md border border-border px-3 py-1 hover:bg-muted"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => toggleStatus(service)}
                                                className="rounded-md border border-border px-3 py-1 hover:bg-muted"
                                            >
                                                {service.status === "active" ? "Make Inactive" : "Make Active"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeleteItem(service)}
                                                className="rounded-md bg-red-600 px-3 py-1 text-white hover:opacity-90"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Delete নিশ্চিত করার ডায়ালগ */}
            <Dialog open={deleteItem !== null} onOpenChange={(open) => { if (!open) setDeleteItem(null); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete service?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {deleteItem?.serviceName}? This cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <button
                            type="button"
                            onClick={() => setDeleteItem(null)}
                            className="rounded-md border border-border px-4 py-2 hover:bg-muted"
                        >
                            No, Keep
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="rounded-md bg-red-600 px-4 py-2 text-white hover:opacity-90 disabled:opacity-60"
                        >
                            {deleting ? "Deleting..." : "Yes, Delete"}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}