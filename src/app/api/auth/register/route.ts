import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/app/lib/mongodb'
import bcrypt from 'bcrypt'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db()

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email })

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const result = await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json(
      { 
        message: "User registered successfully",
        userId: result.insertedId.toString()
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "An error occurred during registration" },
      { status: 500 }
    )
  }
}