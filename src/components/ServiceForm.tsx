"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authFetch } from "@/lib/api";
import { uploadImage } from "@/lib/uploadImage";
import { type Service } from "@/components/ServiceCard";

const categories = [
    "Haircut & Styling",
    "Hair Coloring",
    "Hair Treatment",
    "Facial & Skincare",
    "Makeup",
    "Manicure & Pedicure",
    "Spa & Massage",
];

// service দিলে Update ফর্ম, না দিলে Add ফর্ম
export default function ServiceForm({ service }: { service?: Service }) {
    const router = useRouter();

    const [form, setForm] = useState({
        serviceName: service ? service.serviceName : "",
        category: service ? service.category : categories[0],
        description: service ? service.description : "",
        price: service ? String(service.price) : "",
        duration: service ? String(service.duration) : "",
        status: service ? service.status : "active",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);

    // ফর্মের যেকোনো ঘরে লিখলে form-এ সেভ হবে
    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    // ফর্ম সাবমিট: ছবি আপলোড করে সার্ভিস সেভ করা
    async function handleSave(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!service && !imageFile) {
            toast.error("Please select an image");
            return;
        }

        setSaving(true);
        try {
            // নতুন ছবি বাছলে আপলোড করবে, নইলে পুরনো ছবিই থাকবে
            let image = service ? service.image : "";
            if (imageFile) {
                image = await uploadImage(imageFile);
            }

            const body = JSON.stringify({ ...form, image });

            if (service) {
                await authFetch(`/api/admin/services/${service._id}`, { method: "PUT", body });
                toast.success("Service updated successfully");
            } else {
                await authFetch("/api/admin/services", { method: "POST", body });
                toast.success("Service added successfully");
            }

            // সফল হলে Manage Services পেজে ফেরত
            router.push("/dashboard/admin/services");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to save service");
        } finally {
            setSaving(false);
        }
    }

    return (
        <form
            onSubmit={handleSave}
            className="mx-auto w-full max-w-xl space-y-4 rounded-xl border border-border bg-card p-6"
        >
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
                rows={4}
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
                    Image {service && "(leave empty to keep the current image)"}
                </label>
                {/* Update-এ বর্তমান ছবি দেখানো */}
                {service && <img src={service.image} alt={service.serviceName} className="mb-2 h-24 rounded-md object-cover" />}
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full text-sm"
                />
            </div>

            <div className="flex gap-3">
                <Link
                    href="/dashboard/admin/services"
                    className="rounded-md border border-border px-4 py-2 hover:bg-muted"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={saving}
                    className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
                >
                    {saving ? "Saving..." : service ? "Update Service" : "Add Service"}
                </button>
            </div>
        </form>
    );
}