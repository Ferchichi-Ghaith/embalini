"use server"

import { cookies } from "next/headers"
import { createHash } from "crypto"

export async function verifyAdminCode(inputCode: string) {
// 1. Clean and normalize the input
const cleanCode = inputCode.trim().toLowerCase();

// Standard SHA-256 hash for "ssm256"
const TARGET_HASH = "b59a0c49e1e81df1810413beb101b0eb02065612d6a86e36f622a113b334ac4b";

// 2. Hash the input
const inputHash = createHash("sha256").update(cleanCode).digest("hex");
console.log(inputHash)
if (inputHash !== TARGET_HASH) {
  return { success: false, message: "Invalid credentials" };
}

  // 4. Set Cookies
  const cookieStore = await cookies()
  const expiry = 60 * 60 * 1 // 24 hours

  cookieStore.set("adminauth", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: expiry,
  })

  cookieStore.set("adminsessionhash", inputHash, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: expiry,
  })

  return { success: true }
}


export async function logout() {
  const cookieStore = await cookies()
  
  // Delete the admin-related cookies
  cookieStore.delete("adminauth")
  cookieStore.delete("adminsessionhash")
  
  // If you have a general session cookie, delete it here too
  // cookieStore.delete("session") 
  
  return { success: true }
}