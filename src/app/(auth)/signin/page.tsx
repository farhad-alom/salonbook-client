"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();

  // ফর্মের ঘরগুলোর জন্য state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // বাটনে লোডিং দেখানোর জন্য

  // "Sign In" বাটনে চাপ দিলে এই ফাংশন চলবে
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // পেজ রিলোড বন্ধ রাখা
    setLoading(true);

    try {
      // ১. Better Auth দিয়ে লগইন করা
      const { data, error } = await authClient.signIn.email({
        email: email.trim(),
        password: password,
      });

      // ২. লগইন ব্যর্থ হলে এরর দেখানো
      if (error || !data) {
        toast.error(error?.message || "Invalid email or password");
        return;
      }

      // ৩. ইউজারের role ও blocked অবস্থা জেনে নেওয়া
      const user = data.user as { role?: string; isBlocked?: boolean };

      // ৪. ব্লক করা ইউজার হলে সাথে সাথে লগআউট করে দেওয়া
      if (user.isBlocked) {
        await authClient.signOut();
        toast.error("Your account has been blocked. Please contact the salon.");
        return;
      }

      // ৫. role অনুযায়ী ঠিক ড্যাশবোর্ডে পাঠানো
      toast.success("Logged in successfully!");
      if (user.role === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/customer");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // সফল বা ব্যর্থ — লোডিং বন্ধ হবেই
    }
  }

  // Google দিয়ে লগইন
  async function handleGoogle() {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      toast.error("Google sign in failed");
    }
  }

  // সব ইনপুটের একই ডিজাইন, তাই একবারই লিখে রাখলাম
  const inputClass =
    "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

  return (
    <main className="flex flex-1 items-center justify-center bg-secondary px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        {/* সোনালি দাগ ও শিরোনাম */}
        <div className="h-1 w-14 rounded-full bg-[#B8893C]" />
        <h1 className="mt-4 text-2xl font-bold text-foreground">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to manage your salon appointments.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {/* ইমেইল */}
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
              required
            />
          </div>

          {/* পাসওয়ার্ড */}
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={inputClass}
              required
            />
          </div>

          {/* সাইন ইন বাটন */}
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-primary px-4 py-2.5 font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* আলাদা করার লাইন */}
        <div className="my-5 flex items-center gap-3">
          <hr className="flex-1 border-border" />
          <span className="text-xs text-muted-foreground">OR</span>
          <hr className="flex-1 border-border" />
        </div>

        {/* Google বাটন */}
        <button
          type="button"
          onClick={handleGoogle}
          className="w-full rounded-md border border-border bg-background px-4 py-2.5 font-medium transition hover:bg-muted"
        >
          Continue with Google
        </button>

        {/* Sign Up লিংক */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to SalonBook?{" "}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
