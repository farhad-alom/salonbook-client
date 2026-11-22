import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("salonbook");

export const auth = betterAuth({
    database: mongodbAdapter(db, { client }),

    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            prompt: "select_account",
        },
    },

    user: {
        modelName: "users", // অ্যাসাইনমেন্টের কালেকশনের নামের সাথে মিল রাখতে
        additionalFields: {
            role: { type: "string", defaultValue: "customer", input: false },
            isBlocked: { type: "boolean", defaultValue: false, input: false },
        },
    },
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google"],
        },
    },
});