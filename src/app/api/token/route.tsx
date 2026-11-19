import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
    // ১. কে লগইন করা আছে, সেটা দেখা
    const session = await auth.api.getSession({ headers: await headers() });

    // ২. লগইন না থাকলে টোকেন দেওয়া হবে না
    if (!session) {
        return Response.json({ message: "Not logged in" }, { status: 401 });
    }

    // ৩. ইমেইল দিয়ে ১ ঘণ্টার টোকেন বানানো
    const token = jwt.sign(
        { email: session.user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
    );

    return Response.json({ token });
}