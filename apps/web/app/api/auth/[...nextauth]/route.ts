import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthConfig = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, profile, account }) {
      if (typeof user?.image === "string" && user.image.length > 0) {
        token.picture = user.image;
      }

      if (account?.provider === "google") {
        const googleProfile = profile as { picture?: string } | undefined;
        if (
          typeof googleProfile?.picture === "string" &&
          googleProfile.picture.length > 0
        ) {
          token.picture = googleProfile.picture;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.picture === "string") {
        session.user.image = token.picture;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth(authOptions);
