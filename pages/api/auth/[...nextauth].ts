import NextAuth, { NextAuthOptions, TokenSet } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  authWithOauth2,
  authWithPassword,
  listAuthMethods,
} from "../../../components/utils/pocketbase-api-methods";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60, // 2 hours
  },
  providers: [
    GithubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_ID || "",
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET || "",
    }),
    CredentialsProvider({
      type: "credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "jsmith",
          value: "",
        },
        password: { label: "Password", type: "password", value: "" },
      },
      // @ts-ignore
      async authorize(credentials, req) {
        const authResponse = await authWithPassword({
          identity: credentials.username,
          password: credentials.password,
        });

        const json = await authResponse.json();
        // console.log("AUTH______________", json);

        if (authResponse.ok) {
          return { data: json.record, token: json.token };
        }

        return null;
      },
    }),
  ],
  pages: { signIn: "/auth/signin" },
  callbacks: {
    async jwt({ token, user, profile }) {
      if (user) {
        token.user = user.data;
        token.token = user.token;
        // console.log("JWT______________", token);
        // 2 hrs to expire
      }
      return token;
    },
    async session({ session, token }) {
      // console.log("Token______________", token);
      session.user = token.user;
      session.token = token.token;
      return session;
    },
    // async redirect(params: { url: string }) {
    //   const { url } = params;
    //   // url is just a path, e.g.: /videos/pets
    //   if (!url.startsWith("http")) return url;
    //   // If we have a callback use only its relative path
    //   const callbackUrl = new URL(url).searchParams.get("callbackUrl");
    //   if (!callbackUrl) return url;
    //   return new URL(callbackUrl as string).pathname;
    // },
  },
};

export default NextAuth(authOptions);
