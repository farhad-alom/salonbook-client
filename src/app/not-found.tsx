import Link from "next/link";

export default function NotFound() {
    return (
        <main className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center px-4 py-20 text-center">
            <p className="text-6xl font-bold text-[#8A6A2F]">404</p>
            <h1 className="mt-4 text-2xl font-bold text-foreground">Page Not Found</h1>
            <p className="mt-2 text-foreground/70">
                Sorry, the page you are looking for does not exist.
            </p>
            <Link
                href="/"
                className="mt-6 rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground hover:opacity-90"
            >
                Back to Home
            </Link>
        </main>
    );
}