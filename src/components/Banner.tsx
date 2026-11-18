import Image from "next/image";
import Link from "next/link";

export default function Banner() {
  return (
    // মোবাইল ও ট্যাবলেটে: ছবি ওপরে, লেখা নিচে
    // বড় স্ক্রিনে (lg): ছবি পুরো ব্যাকগ্রাউন্ড, লেখা বাঁ দিকের ফাঁকা অংশে
    <section className="relative bg-secondary lg:flex lg:min-h-[600px] lg:items-center">
      {/* ছবি — মোবাইলে ওপরে, lg-তে পুরো ব্যাকগ্রাউন্ড */}
      <div className="relative h-64 w-full sm:h-80 md:h-96 lg:absolute lg:inset-0 lg:h-auto">
        <Image
          src="/banner.png"
          alt="Elegant beauty salon with styling chairs, a round mirror and orchids"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
        {/* মোবাইলে ছবির নিচে হালকা গ্রেডিয়েন্ট — লেখার অংশের সাথে সুন্দরভাবে মিশে যায় */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-secondary to-transparent lg:hidden" />
      </div>

      {/* লেখা ও বাটন */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:px-8 lg:py-20">
        <div className="max-w-xl lg:max-w-lg xl:max-w-xl">
          {/* ছোট সোনালি দাগ */}
          <div className="h-1 w-14 rounded-full bg-[#B8893C]" />

          <h1 className="mt-5 text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl xl:text-6xl">
            Beauty Care, Booked in Minutes
          </h1>

          <p className="mt-4 text-base text-foreground/80 md:text-lg">
            Explore haircuts, skincare, makeup and spa services. Choose what you
            love, pick a time that suits you and book your appointment online.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/services"
              className="w-full rounded-md bg-primary px-7 py-3 text-center font-medium text-primary-foreground transition hover:opacity-90 sm:w-auto"
            >
              Explore Salon Services
            </Link>
            <Link
              href="#categories"
              className="w-full rounded-md border border-[#B8893C] bg-white px-7 py-3 text-center font-medium text-[#8A6A2F] transition-colors hover:bg-[#B8893C] hover:text-white sm:w-auto"
            >
              Browse Categories
            </Link>
          </div>

          <p className="mt-6 text-sm text-foreground/70">
            Easy booking &bull; Expert stylists &bull; Secure online payment
          </p>
        </div>
      </div>
    </section>
  );
}