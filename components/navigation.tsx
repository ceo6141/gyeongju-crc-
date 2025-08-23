"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, ExternalLink, Youtube } from "lucide-react"
import Image from "next/image"
import { NaverBandLink } from "@/components/naver-band-link"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/", label: "홈" },
    { href: "/about", label: "클럽소개" },
    { href: "/members", label: "회원명부" },
    { href: "/presidents", label: "역대회장" },
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
    <div className="flex">
      <nav className="bg-primary text-primary-foreground shadow-lg w-48 min-h-screen fixed left-0 top-0 z-50">
        <div className="p-2">
          {/* Logo */}
          <div className="mb-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-secondary-foreground font-bold text-xs">RC</span>
                </div>
                <Image
                  src="/rotary-international-logo.png"
                  alt="국제로타리 로고"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              </div>
            </Link>
            <div className="mt-1">
              <div className="font-bold text-sm leading-tight">경주중앙로타리클럽</div>
              <div className="text-xs opacity-80">Gyeongju Central</div>
            </div>
          </div>

          {/* Vertical Navigation */}
          <div className="space-y-1">
            {navItems.map((item) =>
              item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-2 py-2 rounded-md text-sm font-medium hover:bg-primary/80 transition-colors w-full"
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span className="flex-1 text-left">{item.label}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-2 py-2 rounded-md text-sm font-medium hover:bg-primary/80 transition-colors w-full text-left"
                >
                  {item.label}
                </Link>
              ),
            )}

            <div className="px-2 py-1">
              <NaverBandLink variant="inline" />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu button - only visible on mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="text-primary-foreground bg-primary hover:bg-primary/80"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-primary text-primary-foreground z-40">
          <div className="p-4 pt-16">
            <div className="space-y-2">
              {navItems.map((item) =>
                item.external ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-2 py-2 rounded-md text-base font-medium hover:bg-primary/80 transition-colors"
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
                    className="block px-2 py-2 rounded-md text-base font-medium hover:bg-primary/80 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ),
              )}

              <div className="px-2 py-1">
                <NaverBandLink variant="inline" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
