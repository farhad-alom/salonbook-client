import Link from "next/link";
import {
    Scissors,
    Palette,
    Sparkles,
    Flower2,
    Brush,
    Hand,
    Waves,
    LayoutGrid,
} from "lucide-react";

// ক্যাটাগরির তালিকা — বানানগুলো সার্ভারের ডাটার category ফিল্ডের সাথে হুবহু একরকম রাখতে হবে,
// নাহলে /services পেজে ফিল্টার করলে ফল আসবে না।
// icon: lucide-react এর রেডি আইকন, ছবির দরকার নেই।
const categories = [
    { name: "Haircut & Styling", icon: Scissors },
    { name: "Hair Coloring", icon: Palette },
    { name: "Hair Treatment", icon: Sparkles },
    { name: "Facial & Skincare", icon: Flower2 },
    { name: "Makeup", icon: Brush },
    { name: "Manicure & Pedicure", icon: Hand },
    { name: "Spa & Massage", icon: Waves },
];

export default function Categories() {
    return (
        // id="categories" — Banner-এর "Browse Categories" বাটন এখানেই স্ক্রল করে আসবে
        <section id="categories" className="bg-background py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* সেকশনের শিরোনাম — Banner-এর মতো ছোট সোনালি দাগ দিয়ে শুরু */}
                <div className="mx-auto max-w-2xl text-center">
                    <div className="mx-auto h-1 w-14 rounded-full bg-[#B8893C]" />
                    <h2 className="mt-5 text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
                        Explore Services by Category
                    </h2>
                    <p className="mt-3 text-foreground/70">
                        Choose a category and find the perfect salon service for you.
                    </p>
                </div>

                {/* ক্যাটাগরি কার্ডগুলো — মোবাইলে ২ কলাম, বড় পর্দায় ৪ কলাম */}
                <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {categories.map((cat) => {
                        // React-এর নিয়ম: কম্পোনেন্ট হিসেবে ব্যবহার করতে ভেরিয়েবলের নাম বড় হাতের অক্ষরে হতে হবে,
                        // তাই আইকনটা আলাদা ভেরিয়েবলে নিয়ে <Icon /> লিখছি।
                        const Icon = cat.icon;
                        return (
                            <Link
                                key={cat.name}
                                href={`/services?category=${encodeURIComponent(cat.name)}`}
                                className="group rounded-xl border border-border bg-card p-6 text-center transition hover:-translate-y-1 hover:border-[#B8893C] hover:shadow-md"
                            >
                                {/* আইকনের গোল বৃত্ত */}
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#B8893C]/10 transition-colors group-hover:bg-[#B8893C]/20">
                                    <Icon className="h-6 w-6 text-[#B8893C]" />
                                </div>
                                <p className="mt-4 font-medium text-foreground">{cat.name}</p>
                                <p className="mt-1 text-sm text-[#8A6A2F] opacity-0 transition-opacity group-hover:opacity-100">
                                    Explore &rarr;
                                </p>
                            </Link>
                        );
                    })}

                    {/* শেষ কার্ডটা সব সার্ভিস একসাথে দেখানোর জন্য — ৭টা ক্যাটাগরি + এই ১টা = ৮টা কার্ড,
              তাই ডেস্কটপে সুন্দর ৪x২ গ্রিড হয় */}
                    <Link
                        href="/services"
                        className="group flex flex-col items-center justify-center rounded-xl border border-dashed border-[#B8893C] bg-secondary p-6 text-center transition hover:-translate-y-1 hover:shadow-md"
                    >
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#B8893C] transition-opacity group-hover:opacity-90">
                            <LayoutGrid className="h-6 w-6 text-white" />
                        </div>
                        <p className="mt-4 font-medium text-foreground">All Services</p>
                        <p className="mt-1 text-sm text-[#8A6A2F]">View everything &rarr;</p>
                    </Link>
                </div>
            </div>
        </section>
    );
}