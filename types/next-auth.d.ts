import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import { Auth } from "./auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User & DefaultSession["user"];
    accessToken: string | unknown;
    isAdmin?: unknown;
  }

  interface User {
    data: Auth;
    statuscode: number;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    accessToken: string | unknown;
    statuscode: number;
    user: Auth;
  }
}
