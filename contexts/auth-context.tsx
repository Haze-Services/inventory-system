"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, getCurrentUser, signOut } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  logout: () => void
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const logout = () => {
    signOut()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, logout, setUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
