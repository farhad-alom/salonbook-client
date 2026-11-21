"use client";

import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { authFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/uploadImage";

export default function ProfileForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [image, setImage] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // নিজের পুরনো তথ্য সার্ভার থেকে আনা
    useEffect(() => {
        async function loadProfile() {
            try {
                const data = await authFetch("/api/profile");
                setName(data.name);
                setEmail(data.email);
                setPhone(data.phone);
                setImage(data.image);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to load profile");
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, []);

    // ফর্ম সাবমিট: ছবি আপলোড করে প্রোফাইল সেভ করা
    async function handleSave(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSaving(true);
        try {
            // নতুন ছবি বাছলে আপলোড করবে, নইলে পুরনো ছবিই থাকবে
            let newImage = image;
            if (imageFile) {
                newImage = await uploadImage(imageFile);
            }

            await authFetch("/api/profile", {
                method: "PATCH",
                body: JSON.stringify({ name, phone, image: newImage }),
            });

            // Navbar ও সাইডবারে নতুন নাম-ছবি সঙ্গে সঙ্গে দেখানোর জন্য
            await authClient.updateUser({ name, image: newImage || undefined });

            setImage(newImage);
            setImageFile(null);
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update profile");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <div className="h-40 animate-pulse rounded-xl bg-muted" />;
    }

    return (
        <div className="mx-auto max-w-xl">
            <h1 className="mb-6 text-center text-2xl font-bold text-foreground">My Profile</h1>

            <form onSubmit={handleSave} className="space-y-4 rounded-xl border border-border bg-card p-6">
                {/* বর্তমান ছবি (না থাকলে নামের প্রথম অক্ষর) */}
                <div className="flex justify-center">
                    {image ? (
                        <img src={image} alt={name} className="h-24 w-24 rounded-full object-cover" />
                    ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted text-3xl font-bold">
                            {name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">Name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full rounded-md border border-border bg-background px-3 py-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">Email (cannot be changed)</label>
                    <input
                        value={email}
                        disabled
                        className="w-full rounded-md border border-border bg-muted px-3 py-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">Phone</label>
                    <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full rounded-md border border-border bg-background px-3 py-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">Profile Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                        className="w-full text-sm"
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full rounded-md bg-primary py-2 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
                >
                    {saving ? "Saving..." : "Save Profile"}
                </button>
            </form>
        </div>
    );
}