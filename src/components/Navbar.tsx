
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Get logged-in user information
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Navbar states
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Navigation links
  const links = [
    { name: "Home", href: "/" },
    { name: "Browse Services", href: "/services" },
  ];

  if (user) {
    links.push({ name: "Dashboard", href: "/dashboard" });
  }

  // Active navigation link style
  function linkClass(href: string) {
    const isActive = pathname === href;

    return isActive
      ? "font-semibold text-primary"
      : "text-foreground hover:text-primary";
  }

  // Handle logout
  async function handleLogout() {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Logout failed");
        return;
      }

      setProfileOpen(false);
      setMobileOpen(false);

      toast.success("Logged out successfully");

      router.replace("/");
      router.refresh();
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">

        {/* Logo */}
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

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass(link.href)}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Profile / Authentication */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="relative">

              {/* Profile Button */}
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                aria-label="Toggle profile menu"
                aria-expanded={profileOpen}
                className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-muted"
              >
                {/* Profile Picture */}
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-secondary font-semibold text-foreground">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "Profile"}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    user.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>

                {/* Dropdown Arrow */}
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m6 9 6 6 6-6"
                  />
                </svg>
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-border bg-card p-2 shadow-lg">

                  <p className="truncate px-3 py-2 text-sm font-semibold">
                    {user.name}
                  </p>

                  <hr className="my-1 border-border" />

                  <Link
                    href="/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full rounded-md px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-muted"
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

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileOpen}
          className="rounded-md border border-border px-3 py-2 text-lg md:hidden"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation */}
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

              <div className="flex items-center gap-3">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "Profile"}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary font-semibold">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}

                <p className="text-sm font-semibold">{user.name}</p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-border px-4 py-2 text-left text-sm text-destructive hover:bg-muted"
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
