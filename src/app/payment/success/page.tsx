import Link from "next/link";

export default function PaymentSuccessPage() {
    return (
        <main className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
                ✓
            </div>
            <h1 className="mt-6 text-2xl font-bold text-foreground">Payment Successful</h1>
            <p className="mt-2 text-foreground/70">
                Thank you! Your payment has been received. Your payment status will be updated to Paid shortly.
            </p>
            <Link
                href="/dashboard/customer/appointments"
                className="mt-6 rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground hover:opacity-90"
            >
                Go to My Appointments
            </Link>
        </main>
    );
}