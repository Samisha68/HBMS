import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Extend the built-in session types
   */
  interface Session {
    user: {
      id: string  // Note: this is required, not optional
    } & DefaultSession["user"]
  }

  /**
   * Extend the built-in user types
   */
  interface User {
    id: string
    // Add other custom fields here
  }
}

declare module "next-auth/jwt" {
  /** Extend the JWT token types */
  interface JWT {
    id?: string
    sub: string  // 'sub' is always available in JWT
  }
}