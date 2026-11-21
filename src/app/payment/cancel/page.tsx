import Link from "next/link";
export const metadata = { title: "Payment Cancelled" };

export default function PaymentCancelPage() {
    return (
        <main className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-700">
                ✕
            </div>
            <h1 className="mt-6 text-2xl font-bold text-foreground">Payment Cancelled</h1>
            <p className="mt-2 text-foreground/70">
                Your payment was not completed and no money was charged. You can try again anytime.
            </p>
            <Link
                href="/dashboard/customer/appointments"
                className="mt-6 rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground hover:opacity-90"
            >
                Back to My Appointments
            </Link>
        </main>
    );
}