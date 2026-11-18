import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                {/* Column 1: Logo, Short Description & Social Links */}
                <div>
                    <Link href="/">
                        <Image
                            width={150}
                            height={40}
                            src="/nav-logo.png"
                            alt="SalonBook Logo"
                            className="h-12 w-auto mb-4 bg-white p-1.5 rounded"
                        />
                    </Link>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">
                        Your trusted destination for effortless salon and beauty appointments.
                        Explore top services, book online in seconds, and look your best.
                    </p>

                    {/* Social Media Links */}
                    <div className="flex space-x-4 text-sm font-medium">
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-pink-400 transition"
                        >
                            Facebook
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-pink-400 transition"
                        >
                            Instagram
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-pink-400 transition"
                        >
                            Twitter
                        </a>
                    </div>
                </div>

                {/* Column 2: Important Navigation Links */}
                <div>
                    <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="/" className="hover:text-pink-400 transition">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/services" className="hover:text-pink-400 transition">
                                Browse Services
                            </Link>
                        </li>
                        <li>
                            <Link href="/sign-in" className="hover:text-pink-400 transition">
                                Sign In
                            </Link>
                        </li>
                        <li>
                            <Link href="/sign-up" className="hover:text-pink-400 transition">
                                Sign Up
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Column 3: Salon Contact Information */}
                <div>
                    <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li>Phone: +880 1700-000000</li>
                        <li>Email: support@salonbook.com</li>
                        <li>Help Desk: Available 24/7</li>
                    </ul>
                </div>

                {/* Column 4: Salon Address & Opening Hours */}
                <div>
                    <h3 className="text-white font-semibold text-lg mb-4">Visit Us</h3>
                    <p className="text-sm text-gray-400 mb-3">
                        House 12, Road 5, Dhanmondi, Dhaka, Bangladesh
                    </p>
                    <h4 className="text-white font-medium text-sm mb-1">Opening Hours:</h4>
                    <p className="text-sm text-gray-400">Sat - Thu: 10:00 AM - 9:00 PM</p>
                    <p className="text-sm text-gray-400">Friday: 2:00 PM - 9:00 PM</p>
                </div>

            </div>

            {/* Bottom Copyright Bar */}
            <div className="border-t border-gray-800 py-5 text-center text-sm text-gray-500">
                <p>© {new Date().getFullYear()} SalonBook. All rights reserved.</p>
            </div>
        </footer>
    );
}