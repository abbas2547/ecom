import type { NextAuthOptions, DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "./mongodb";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email || !account) {
        return true;
      }

      try {
        const client = await clientPromise;
        const db = client.db("zyrox");

        // Check if user with this email already exists
        const existingUser = await db.collection("users").findOne({ email: user.email });

        if (existingUser) {
          // User exists, check if they have an account with this provider
          const existingAccount = await db.collection("accounts").findOne({
            userId: existingUser._id.toString(),
            provider: account.provider,
          });

          // If account with this provider already exists for this user, allow it
          if (existingAccount) {
            return true;
          }

          // If user exists but no account with this provider, link the new account
          const result = await db.collection("accounts").updateOne(
            {
              userId: existingUser._id.toString(),
              provider: account.provider,
            },
            {
              $set: {
                userId: existingUser._id.toString(),
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
              },
            },
            { upsert: true }
          );

          // Update the user object to match the existing user
          user.id = existingUser._id.toString();
          return true;
        }

        // New user, allow sign in
        return true;
      } catch (error) {
        console.error("SignIn callback error:", error);
        return true; // Allow sign in even if there's an error
      }
    },

    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        const dbClient = await clientPromise;
        const db = dbClient.db("zyrox");
        const dbUser = await db.collection("users").findOne({ email: user.email! });
        session.user.role = dbUser?.role || "user";
      }
      return session;
    },
  },
};
