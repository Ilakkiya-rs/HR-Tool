import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.SECRET,
  providers: [
  
    CredentialsProvider({
      name: "credentials",
      
      credentials: {},
      async authorize(credentials, req) {
        const loginstatus = { id: "1" };
        if (loginstatus) {
          return loginstatus;
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};
