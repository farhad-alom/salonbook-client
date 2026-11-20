
import Link from "next/link";

// একটা সার্ভিসের তথ্য কেমন হবে, সেটা এখানে লিখে রাখলাম
export type Service = {
    _id: string;
    serviceName: string;
    category: string;
    description: string;
    price: number;
    duration: number;
    image: string;
    status: string;
};

export default function ServiceCard({ service }: { service: Service }) {
    return (
        <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            {/* সার্ভিসের ছবি */}
            <img
                src={service.image}
                alt={service.serviceName}
                className="h-48 w-full bg-muted object-cover"
            />

            <div className="flex flex-1 flex-col p-4">
                {/* category */}
                <span className="text-xs font-medium text-[#8A6A2F]">{service.category}</span>

                {/* নাম */}
                <h3 className="mt-1 text-lg font-semibold text-foreground">{service.serviceName}</h3>

                {/* ছোট বিবরণ (সর্বোচ্চ ২ লাইন দেখাবে) */}
                <p className="mt-2 line-clamp-2 text-sm text-foreground/70">{service.description}</p>

                {/* দাম আর সময় */}
                <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-base font-bold text-foreground">${service.price}</span>
                    <span className="text-foreground/70">{service.duration} min</span>
                </div>

                {/* বাটন: Details পেজে নিয়ে যাবে */}
                <Link
                    href={`/services/${service._id}`}
                    className="mt-4 rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}