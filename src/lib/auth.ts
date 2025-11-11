import {
  type NextAuthOptions,
  getServerSession as nextAuthGetServerSession,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db/drizzle";
import { seedLinksForUser } from "@/lib/seedUser";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: DrizzleAdapter(db) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  events: {
    createUser: async ({ user }) => {
      // Seed default links for new users
      try {
        await seedLinksForUser(user.id);
        console.log(`✅ Seeded links for new user: ${user.email}`);
      } catch (error) {
        console.error("Error seeding links for new user:", error);
      }
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "database",
  },
};

export const getServerSession = () => nextAuthGetServerSession(authOptions);
