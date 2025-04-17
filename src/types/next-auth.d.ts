import { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * Extend the built-in session types
   */
  interface Session extends DefaultSession {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }

  /**
   * Extend the built-in user types
   */
  interface User extends DefaultUser {
    id: string
    name: string
    email: string
    role: string
    image?: string
  }
}

declare module "next-auth/jwt" {
  /** Extend the JWT token types */
  interface JWT {
    id: string
    role: string
  }
}