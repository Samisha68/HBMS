import { getServerSession } from "next-auth"
import { authOptions } from "./auth-options"
import clientPromise from "./mongodb"

// Get the current session on the server
export async function getSession() {
  return await getServerSession(authOptions)
}

// Get the current user on the server
export async function getCurrentUser() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return null
  }

  try {
    const client = await clientPromise
    const db = client.db()
    const currentUser = await db.collection('users').findOne({ 
      email: session.user.email 
    })

    if (!currentUser) {
      return null
    }

    return {
      ...currentUser,
      id: currentUser._id.toString(),
    }
  } catch (error) {
    console.error('Error fetching current user:', error)
    return null
  }
}

// Check if a user is authenticated
export async function isAuthenticated() {
  const session = await getSession()
  return !!session?.user
}