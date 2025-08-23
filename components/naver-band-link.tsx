"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ExternalLink, Users, CheckCircle } from "lucide-react"
import Image from "next/image"

interface NaverBandLinkProps {
  variant?: "button" | "card" | "inline"
  className?: string
}

export function NaverBandLink({ variant = "button", className = "" }: NaverBandLinkProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [loginForm, setLoginForm] = useState({ name: "", memberNumber: "" })

  useEffect(() => {
    const savedLogin = localStorage.getItem("naverBandLogin")
    if (savedLogin) {
      const loginData = JSON.parse(savedLogin)
      setIsLoggedIn(true)
      setUserName(loginData.name)
    }
  }, [])

  const handleLogin = () => {
    if (loginForm.name && loginForm.memberNumber) {
      const loginData = {
        name: loginForm.name,
        memberNumber: loginForm.memberNumber,
        loginTime: new Date().toISOString(),
      }
      localStorage.setItem("naverBandLogin", JSON.stringify(loginData))
      setIsLoggedIn(true)
      setUserName(loginForm.name)
      setShowLoginDialog(false)
      setLoginForm({ name: "", memberNumber: "" })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("naverBandLogin")
    setIsLoggedIn(false)
    setUserName("")
  }

  const getBandUrl = () => {
    if (isLoggedIn) {
      // 로그인된 사용자는 직접 밴드로 이동
      return "https://band.us/@gjcrc"
    } else {
      // 비로그인 사용자는 로그인 페이지로 이동
      return "https://auth.band.us/login_page?next_url=https%3A%2F%2Fband.us%2F%40gjcrc"
    }
  }

  if (variant === "card") {
    return (
      <Card className={`max-w-md mx-auto hover:shadow-lg transition-shadow ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-center">
            <Image src="/naver-band-logo-green.png" alt="네이버 밴드" width={24} height={24} className="mr-2" />
            네이버 밴드로 가기
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoggedIn ? (
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">{userName}님으로 로그인됨</span>
              </div>
              <Button className="w-full" asChild>
                <a href={getBandUrl()} target="_blank" rel="noopener noreferrer">
                  밴드 바로가기
                </a>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="w-full bg-transparent">
                로그아웃
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">회원 인증 후 더 편리하게 이용하세요</p>
              <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full bg-transparent">
                    회원 인증하기
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>회원 인증</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">이름</Label>
                      <Input
                        id="name"
                        value={loginForm.name}
                        onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                        placeholder="회원 이름을 입력하세요"
                      />
                    </div>
                    <div>
                      <Label htmlFor="memberNumber">회원번호</Label>
                      <Input
                        id="memberNumber"
                        value={loginForm.memberNumber}
                        onChange={(e) => setLoginForm({ ...loginForm, memberNumber: e.target.value })}
                        placeholder="회원번호를 입력하세요"
                      />
                    </div>
                    <Button onClick={handleLogin} className="w-full">
                      인증하기
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button className="w-full" asChild>
                <a href={getBandUrl()} target="_blank" rel="noopener noreferrer">
                  밴드 바로가기
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {isLoggedIn && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {userName}님
          </span>
        )}
        <Button size="sm" asChild>
          <a href={getBandUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            네이버밴드
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </div>
    )
  }

  // Default button variant
  return (
    <Button className={className} asChild>
      <a href={getBandUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
        네이버밴드
        <ExternalLink className="h-4 w-4" />
      </a>
    </Button>
  )
}
