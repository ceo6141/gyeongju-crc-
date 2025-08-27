"use client"

import { useState, useEffect } from "react"
import { checkAdminAuth, setAdminAuth } from "@/lib/auth"

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    setIsAuthenticated(checkAdminAuth())
  }, [])

  const requireAuth = (callback: () => void) => {
    if (checkAdminAuth()) {
      callback()
    } else {
      setShowLogin(true)
    }
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    setShowLogin(false)
  }

  const logout = () => {
    setAdminAuth(false)
    setIsAuthenticated(false)
  }

  return {
    isAuthenticated,
    showLogin,
    setShowLogin,
    requireAuth,
    handleLoginSuccess,
    logout,
  }
}
