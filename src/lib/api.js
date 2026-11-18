

// সার্ভারের URL একজায়গায় রাখা হলো
export const API_URL = process.env.NEXT_PUBLIC_API_URL;

// সার্ভারে রিকোয়েস্ট পাঠানোর সহজ ফাংশন
export async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-type": "application/json",
            ...options.headers,
        },
    });

    const data = await res.json();

    // সার্ভার এরর দিলে সেটি ছুঁড়ে দেওয়া হবে, যাতে toast-এ দেখানো যায়
    if (!res.ok) {
        throw new Error(data.message || "Something Went Wrong")
    }
    return data;
}