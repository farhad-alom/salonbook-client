"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

// পাসওয়ার্ড ঠিক আছে কিনা চেক করার ফাংশন
// ঠিক থাকলে খালি লেখা ("") ফেরত দেয়, ভুল থাকলে এরর মেসেজ ফেরত দেয়
function checkPassword(password: string) {
  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must have at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must have at least one lowercase letter";
  }
  return "";
}

// ছবি ImgBB-তে আপলোড করে ছবির লিংক ফেরত দেয়
async function uploadToImgBB(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
    { method: "POST", body: formData }
  );
  const result = await res.json();

  if (!result.success) {
    throw new Error("Image upload failed");
  }
  return result.data.url as string;
}

export default function SignUpPage() {
  const router = useRouter();

  // ফর্মের প্রতিটি ঘরের জন্য একটি state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // ছবির লিংক (ঐচ্ছিক)
  const [imageFile, setImageFile] = useState<File | null>(null); // ছবির ফাইল (ঐচ্ছিক)
  const [loading, setLoading] = useState(false); // বাটনে লোডিং দেখানোর জন্য

  // "Sign Up" বাটনে চাপ দিলে এই ফাংশন চলবে
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // পেজ রিলোড বন্ধ রাখা

    // ১. ফর্মের তথ্য চেক করা
    if (name.trim() === "") {
      toast.error("Please enter your full name");
      return;
    }
    const passwordError = checkPassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    setLoading(true);

    try {
      // ২. ছবি দিলে আপলোড করা, না দিলে লিংক (বা খালি) ব্যবহার করা
      let finalImage = imageUrl.trim();
      if (imageFile) {
        finalImage = await uploadToImgBB(imageFile);
      }

      // ৩. Better Auth দিয়ে অ্যাকাউন্ট খোলা
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password: password,
        image: finalImage || undefined,
      });

      // ৪. সফল হলো নাকি ব্যর্থ, সেটি দেখানো
      if (error) {
        toast.error(error.message || "Sign up failed");
      } else {
        toast.success("Account created successfully!");
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false); // সফল বা ব্যর্থ — লোডিং বন্ধ হবেই
    }
  }

  // Google দিয়ে সাইন আপ
  async function handleGoogle() {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      toast.error("Google sign up failed");
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
        <h1 className="mt-4 text-2xl font-bold text-foreground">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Join SalonBook and book your salon appointments online.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {/* পুরো নাম */}
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className={inputClass}
              required
            />
          </div>

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
            <p className="mt-1 text-xs text-muted-foreground">
              At least 6 characters, with one uppercase and one lowercase letter.
            </p>
          </div>

          {/* প্রোফাইল ছবি: ফাইল আপলোড অথবা লিংক */}
          <div>
            <label htmlFor="imageFile" className="mb-1 block text-sm font-medium">
              Profile Image (optional)
            </label>
            <input
              id="imageFile"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className={inputClass}
            />
            <p className="my-2 text-center text-xs text-muted-foreground">
              or paste an image link
            </p>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className={inputClass}
            />
          </div>

          {/* সাইন আপ বাটন */}
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-primary px-4 py-2.5 font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign Up"}
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

        {/* Sign In লিংক */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/signin" className="font-semibold text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
