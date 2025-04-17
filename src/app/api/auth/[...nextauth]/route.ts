import NextAuth from "next-auth"
import { authOptions } from "@/app/lib/auth-options"

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

// If you need to access authOptions elsewhere, create a separate file for it