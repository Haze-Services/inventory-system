// Authentication utilities and mock data
export interface User {
  id: string
  email: string
  fullName: string
  role: "admin" | "manager" | "viewer"
}

// Mock users for development (replace with Supabase later)
const mockUsers = [
  {
    id: "1",
    email: "admin@store.com",
    password: "admin123",
    fullName: "Store Administrator",
    role: "admin" as const,
  },
  {
    id: "2",
    email: "manager@store.com",
    password: "manager123",
    fullName: "Store Manager",
    role: "manager" as const,
  },
]

export async function signIn(email: string, password: string): Promise<User | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = mockUsers.find((u) => u.email === email && u.password === password)
  if (user) {
    const { password: _, ...userWithoutPassword } = user
    // Store in localStorage for persistence
    localStorage.setItem("auth-user", JSON.stringify(userWithoutPassword))
    return userWithoutPassword
  }
  return null
}

export function signOut(): void {
  localStorage.removeItem("auth-user")
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const stored = localStorage.getItem("auth-user")
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return null
    }
  }
  return null
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}
