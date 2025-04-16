import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export async function fetchUserDetails(userId: string, token: string) {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch user details: ${response.statusText}`)
    }

    const userData = await response.json()
    return userData
  } catch (error) {
    console.error("Error fetching user details:", error)
    return null
  }
}
