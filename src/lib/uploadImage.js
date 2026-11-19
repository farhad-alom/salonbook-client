// ছবি ImgBB-তে আপলোড করে ছবির লিংক ফেরত দেয়
export async function uploadImage(file) {
    // ১. ছবিটা ফর্মের ডাটা আকারে সাজানো
    const formData = new FormData();
    formData.append("image", file);

    // ২. ImgBB-তে পাঠানো
    const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        { method: "POST", body: formData }
    );
    const result = await res.json();

    // ৩. আপলোড না হলে error দেওয়া
    if (!result.success) {
        throw new Error(result.error?.message || "Image upload failed");
    }

    // ৪. ছবির লিংক ফেরত দেওয়া
    return result.data.url;
}