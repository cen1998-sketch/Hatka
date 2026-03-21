import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" }, // Force JWT for Edge compatibility in Middleware
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, user, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role || "tenant";
        session.user.fullName = token.name;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
});
