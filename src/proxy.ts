import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// /dashboard-এর যেকোনো পেজ খোলার আগে এই ফাংশন চলে
export function proxy(request: NextRequest) {
    // লগইনের কুকি আছে কিনা দেখা
    const sessionCookie = getSessionCookie(request);

    // কুকি না থাকলে সাথে সাথে Sign In পেজে পাঠানো
    if (!sessionCookie) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    return NextResponse.next();
}

// শুধু /dashboard আর তার ভেতরের পেজে এটা চলবে
export const config = {
    matcher: ["/dashboard/:path*"],
};