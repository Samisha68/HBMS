import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/lib/auth-options"
import { prisma } from "./prisma"

// Get the current session on the server
export async function getSession() {
  return await getServerSession(authOptions)
}

// Get the current user on the server
export async function getCurrentUser() {
  try {
    const session = await getSession()
    
    if (!session?.user?.email) {
      return null
    }
    
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        // Don't include password
      }
    })
    
    if (!currentUser) {
      return session.user
    }
    
    return currentUser
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Check if a user is authenticated
export async function isAuthenticated() {
  const session = await getSession()
  return !!session?.user
}