"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, ExternalLink, Youtube, Camera } from "lucide-react"
import Image from "next/image"
import { NaverBandLink } from "@/components/naver-band-link"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/", label: "홈" },
    { href: "/about", label: "클럽소개" },
    { href: "/members", label: "회원명부" },
    { href: "/presidents", label: "역대회장" },
    { href: "/gallery", label: "갤러리", icon: Camera },
    { href: "/activities", label: "봉사활동" },
    { href: "/notices", label: "공지사항" },
    { href: "/rotary-news", label: "로타리 소식" },
    { href: "/organization", label: "조직도" },
    { href: "/plans", label: "사업계획" },
    {
      href: "https://www.youtube.com/@gjcrc",
      label: "유튜브",
      external: true,
      icon: Youtube,
    },
  ]

  return (
    <>
      <nav className="bg-primary text-primary-foreground shadow-lg w-full fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-secondary-foreground font-bold text-sm">RC</span>
                </div>
                <Image
                  src="/rotary-international-logo.png"
                  alt="국제로타리 로고"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
              <div>
                <div className="font-bold text-lg leading-tight">경주중앙로타리클럽</div>
                <div className="text-sm opacity-80">Gyeongju Central</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) =>
                item.external ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/80 transition-colors"
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/80 transition-colors"
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </Link>
                ),
              )}
              <div className="ml-2">
                <NaverBandLink variant="inline" />
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="text-primary-foreground hover:bg-primary/80"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <div className="lg:hidden bg-primary border-t border-primary/20">
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) =>
                item.external ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/80 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span className="flex-1 text-left">{item.label}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/80 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span className="flex-1 text-left">{item.label}</span>
                  </Link>
                ),
              )}
              <div className="px-3 py-2">
                <NaverBandLink variant="inline" />
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
