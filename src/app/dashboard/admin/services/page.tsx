"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { authFetch } from "@/lib/api";
import { uploadImage } from "@/lib/uploadImage";
import { type Service } from "@/components/ServiceCard";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const categories = [
    "Haircut & Styling",
    "Hair Coloring",
    "Hair Treatment",
    "Facial & Skincare",
    "Makeup",
    "Manicure & Pedicure",
    "Spa & Massage",
];

// ফর্মের খালি অবস্থা
const emptyForm = {
    serviceName: "",
    category: categories[0],
    description: "",
    price: "",
    duration: "",
    status: "active",
};

export default function ManageServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    const [formOpen, setFormOpen] = useState(false); // Add/Update ডায়ালগ খোলা কিনা
    const [editing, setEditing] = useState<Service | null>(null); // null হলে Add, নইলে Update
    const [form, setForm] = useState(emptyForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);

    const [deleteItem, setDeleteItem] = useState<Service | null>(null); // Delete ডায়ালগ
    const [deleting, setDeleting] = useState(false);

    // সব সার্ভিস আনা
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

    useEffect(() => {
        loadServices();
    }, []);

    // ফর্মের যেকোনো ঘরে লিখলে form-এ সেভ হবে
    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    // "Add Service" চাপলে খালি ফর্ম খোলা
    function openAdd() {
        setEditing(null);
        setForm(emptyForm);
        setImageFile(null);
        setFormOpen(true);
    }

    // "Edit" চাপলে পুরনো তথ্যসহ ফর্ম খোলা
    function openEdit(service: Service) {
        setEditing(service);
        setForm({
            serviceName: service.serviceName,
            category: service.category,
            description: service.description,
            price: String(service.price),
            duration: String(service.duration),
            status: service.status,
        });
        setImageFile(null);
        setFormOpen(true);
    }

    // ফর্ম সাবমিট: ছবি আপলোড করে সার্ভিস সেভ করা
    async function handleSave(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!editing && !imageFile) {
            toast.error("Please select an image");
            return;
        }

        setSaving(true);
        try {
            // নতুন ছবি বাছলে আপলোড করবে, নইলে পুরনো ছবিই থাকবে
            let image = editing ? editing.image : "";
            if (imageFile) {
                image = await uploadImage(imageFile);
            }

            const body = JSON.stringify({ ...form, image });

            if (editing) {
                await authFetch(`/api/admin/services/${editing._id}`, { method: "PUT", body });
                toast.success("Service updated successfully");
            } else {
                await authFetch("/api/admin/services", { method: "POST", body });
                toast.success("Service added successfully");
            }

            setFormOpen(false);
            loadServices();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to save service");
        } finally {
            setSaving(false);
        }
    }

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
                <button
                    type="button"
                    onClick={openAdd}
                    className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:opacity-90"
                >
                    Add Service
                </button>
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
                                            <button
                                                type="button"
                                                onClick={() => openEdit(service)}
                                                className="rounded-md border border-border px-3 py-1 hover:bg-muted"
                                            >
                                                Edit
                                            </button>
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

            {/* Add / Update ডায়ালগ */}
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editing ? "Update Service" : "Add Service"}</DialogTitle>
                        <DialogDescription>Fill in the service details below.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSave} className="space-y-3">
                        <input
                            name="serviceName"
                            value={form.serviceName}
                            onChange={handleChange}
                            placeholder="Service name"
                            required
                            className="w-full rounded-md border border-border bg-background px-3 py-2"
                        />

                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full rounded-md border border-border bg-background px-3 py-2"
                        >
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Description"
                            rows={3}
                            required
                            className="w-full rounded-md border border-border bg-background px-3 py-2"
                        />

                        <div className="flex gap-3">
                            <input
                                name="price"
                                type="number"
                                min="1"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="Price ($)"
                                required
                                className="w-full rounded-md border border-border bg-background px-3 py-2"
                            />
                            <input
                                name="duration"
                                type="number"
                                min="1"
                                value={form.duration}
                                onChange={handleChange}
                                placeholder="Duration (min)"
                                required
                                className="w-full rounded-md border border-border bg-background px-3 py-2"
                            />
                        </div>

                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full rounded-md border border-border bg-background px-3 py-2"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Image {editing && "(leave empty to keep the current image)"}
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                                className="w-full text-sm"
                            />
                        </div>

                        <DialogFooter>
                            <button
                                type="button"
                                onClick={() => setFormOpen(false)}
                                className="rounded-md border border-border px-4 py-2 hover:bg-muted"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
                            >
                                {saving ? "Saving..." : editing ? "Update" : "Add"}
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

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