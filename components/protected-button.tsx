"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { AdminLogin } from "@/components/admin-login"
import { Shield } from "lucide-react"

interface ProtectedButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  disabled?: boolean
}

export function ProtectedButton({
  children,
  onClick,
  variant = "default",
  size = "default",
  className = "",
  disabled = false,
}: ProtectedButtonProps) {
  const { requireAuth, showLogin, setShowLogin, handleLoginSuccess } = useAdminAuth()

  const handleClick = () => {
    requireAuth(onClick)
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`${className} relative`}
        onClick={handleClick}
        disabled={disabled}
      >
        <Shield className="w-3 h-3 mr-1 opacity-60" />
        {children}
      </Button>

      <AdminLogin isOpen={showLogin} onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />
    </>
  )
}
