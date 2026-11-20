import { CalendarCheck, Users, ShieldCheck, Sparkles } from "lucide-react";

// কেন আমাদের বেছে নেবেন — ৪টা কারণ
const reasons = [
    {
        icon: CalendarCheck,
        title: "Easy Online Booking",
        text: "Pick a service, choose your date and time, and request your appointment in a few clicks.",
    },
    {
        icon: Users,
        title: "Expert Stylists",
        text: "Our trained professionals take care of your hair, skin and beauty needs.",
    },
    {
        icon: ShieldCheck,
        title: "Secure Payment",
        text: "Pay safely online with Stripe once your appointment is confirmed.",
    },
    {
        icon: Sparkles,
        title: "Premium Care",
        text: "We use quality products so you leave the salon looking and feeling your best.",
    },
];

export default function WhyChooseUs() {
    return (
        <section className="bg-background py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* সেকশনের শিরোনাম */}
                <div className="mx-auto max-w-2xl text-center">
                    <div className="mx-auto h-1 w-14 rounded-full bg-[#B8893C]" />
                    <h2 className="mt-5 text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
                        Why Choose SalonBook
                    </h2>
                    <p className="mt-3 text-foreground/70">
                        Everything you need for a smooth and relaxing salon visit.
                    </p>
                </div>

                {/* ৪টা কার্ড — মোবাইলে ১ কলাম, ট্যাবলেটে ২, বড় পর্দায় ৪ */}
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {reasons.map((item) => {
                        const Icon = item.icon; // আইকনকে <Icon /> আকারে ব্যবহার করতে আলাদা ভেরিয়েবলে নিলাম
                        return (
                            <div
                                key={item.title}
                                className="rounded-xl border border-border bg-card p-6 text-center"
                            >
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#B8893C]/10">
                                    <Icon className="h-6 w-6 text-[#B8893C]" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
                                <p className="mt-2 text-sm text-foreground/70">{item.text}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}