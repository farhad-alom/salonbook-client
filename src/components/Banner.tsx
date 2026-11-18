import Image from "next/image";
import Link from "next/link";

// নিচের তিনটি সুবিধা (ডেস্কটপ ও ট্যাবলেটে দেখাবে)
const highlights = [
  { title: "Easy Online Booking", text: "Pick a service, date and time in a few clicks" },
  { title: "Expert Stylists", text: "Hair, skin, makeup and spa care in one place" },
  { title: "Secure Payment", text: "Pay safely online once your booking is confirmed" },
];

export default function Banner() {
  return (
    <section className="relative flex min-h-[560px] flex-col md:min-h-[680px]">
      {/* ব্যাকগ্রাউন্ড ছবি (public/banner.jpg) */}
      <Image
        src="/banner2.jpg"
        alt="Modern beauty salon with gold mirrors and styling chairs"
        fill
        priority
        className="object-cover object-[65%_center]"
      />

      {/* মোবাইলে: পুরো ছবির ওপর গাঢ় পর্দা */}
      <div className="absolute inset-0 bg-[#18181e]/70 md:hidden" />

      {/* ডেস্কটপে: বাঁ দিকে গাঢ়, ডান দিকে ছবি পরিষ্কার */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            "linear-gradient(to right, rgba(24,24,30,0.9) 0%, rgba(24,24,30,0.7) 45%, rgba(24,24,30,0.15) 100%)",
        }}
      />

      {/* লেখা ও বাটন */}
      <div className="relative flex flex-1 items-center">
        <div className="mx-auto w-full max-w-7xl px-4 py-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-7xl">
              Look Your Best, Book in Minutes
            </h1>

            <p className="mt-5 max-w-xl text-base text-white/80 md:text-lg">
              Discover haircuts, skincare, makeup and spa treatments. Choose a
              service, pick a time that suits you and book your appointment online.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/services"
                className="rounded-md bg-primary px-7 py-3 text-center font-medium text-primary-foreground hover:opacity-90"
              >
                Explore Salon Services
              </Link>
              <Link
                href="#categories"
                className="rounded-md border border-white/60 px-7 py-3 text-center font-medium text-white hover:bg-white/10"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* নিচের সুবিধার স্ট্রিপ (মোবাইলে লুকানো) */}
      <div className="relative hidden border-t border-white/20 bg-black/40 backdrop-blur-sm sm:block">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-5 sm:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title}>
              <p className="font-semibold text-white">{item.title}</p>
              <p className="mt-1 text-sm text-white/70">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
