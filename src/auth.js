import NextAuth from "next-auth";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import prisma from "@/lib/prisma";

export const {
  auth,    
  handlers, 
} = NextAuth({
  secret: process.env.AUTH_SECRET, 
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
        name: "Credentials",
            credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
            try {
                if (!credentials || !credentials.email || !credentials.password) {
                    return null;
                }
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });
                
                if (!user) {
                    console.log("No user found for:", credentials.email);
                    return null;
                }
                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) {
                    console.log("Invalid password for:", credentials.email);
                    return null;
                }
                return user;
            }catch (error) {
                console.error("Authorization error:", error);
                return null;
            }
        },
    }),
  ],
  pages:{
    signIn: '/auth/signin',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = auth && auth.user;
      const path = nextUrl.pathname;
      const isProtectedRoute = path.startsWith('/add-profile') || 
                              (path.startsWith('/profile/') && path.endsWith('/edit'));
      if (isProtectedRoute && !isLoggedIn) {
        return false;
      }
      return true;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
        return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
        return token;
    }
  }
});
