"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const pathname = usePathname(); // এখন কোন পেজে আছি, সেটি জানার জন্য
  const router = useRouter();

  // লগইন করা ইউজারের তথ্য। লগইন বা লগআউট করলে এটি নিজেই বদলে যায়,
  // তাই Navbar সাথে সাথে আপডেট হয়।
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [mobileOpen, setMobileOpen] = useState(false); // মোবাইল মেনু খোলা আছে কিনা
  const [profileOpen, setProfileOpen] = useState(false); // প্রোফাইল ড্রপডাউন খোলা আছে কিনা

  // সবার জন্য: Home ও Browse Services
  const links = [
    { name: "Home", href: "/" },
    { name: "Browse Services", href: "/services" },
  ];

  // লগইন করা থাকলে Dashboard লিংক যোগ হবে
  if (user) {
    links.push({ name: "Dashboard", href: "/dashboard" });
  }

  // বর্তমান পেজের লিংক রঙিন দেখানোর জন্য
  function linkClass(href) {
    const isActive = pathname === href;
    return isActive
      ? "font-semibold text-primary"
      : "text-foreground hover:text-primary";
  }

  async function handleLogout() {
    try {
      await authClient.signOut();
      setProfileOpen(false);
      setMobileOpen(false);
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* লোগো */}
        <Link href="/">
          <Image
            src="/nav-logo.png"
            alt="SalonBook"
            width={176}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* ডেস্কটপ মেনু (মোবাইলে লুকানো) */}
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.name}
            </Link>
          ))}
        </nav>

        {/* ডান পাশ: লগইন থাকলে প্রোফাইল, না থাকলে Sign In / Sign Up */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-secondary font-semibold text-foreground"
              >
                {user.image ? (
                  <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  user.name?.charAt(0).toUpperCase()
                )}
              </button>

              {/* প্রোফাইল ড্রপডাউন */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-card p-2 shadow-md">
                  <p className="px-3 py-2 text-sm font-semibold">{user.name}</p>
                  <hr className="my-1 border-border" />
                  <Link
                    href="/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-muted"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/signin"
                className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* মোবাইলের মেনু বাটন (ডেস্কটপে লুকানো) */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-md border border-border px-3 py-2 text-lg md:hidden"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* মোবাইল মেনু */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={linkClass(link.href)}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <hr className="my-4 border-border" />

          {user ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold">{user.name}</p>
              <button
                onClick={handleLogout}
                className="rounded-md border border-border px-4 py-2 text-left text-sm text-destructive"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                href="/signin"
                onClick={() => setMobileOpen(false)}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
