import Link from "next/link"
import { Icons } from "@/components/icons"

export function Footer() {
  return (
    <footer className="bg-muted mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Club Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold">R</span>
              </div>
              <h3 className="text-lg font-semibold">GYEONGJU CENTRAL ROTARY CLUB</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              경주중앙로타리클럽 - 봉사를 통한 지역사회 발전과 국제친선을 도모하는 클럽입니다.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">연락처</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Icons.Phone />
                <span className="text-muted-foreground">054-773-7676</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icons.Phone />
                <span className="text-muted-foreground">FAX: 054-773-7673</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icons.Mail />
                <span className="text-muted-foreground">E-MAIL: ceo6141@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icons.MapPin />
                <div className="text-muted-foreground">
                  <div>경주시 승삼1길 5-5, 4층(용강동)</div>
                  <div className="text-xs">
                    5-5, Seungsam 1-gil, Yonggang-dong, Gyeongju-si, Gyeongsangbuk-do, Republic of Korea
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Icons.MapPin />
                <span className="text-muted-foreground">우편번호(ZIP CODE) : 38090</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">바로가기</h3>
            <div className="space-y-2">
              <Link href="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                클럽소개
              </Link>
              <Link href="/activities" className="block text-muted-foreground hover:text-primary transition-colors">
                봉사활동
              </Link>
              <Link href="/notices" className="block text-muted-foreground hover:text-primary transition-colors">
                공지사항
              </Link>
              <Link
                href="https://rotary.org"
                className="block text-muted-foreground hover:text-primary transition-colors"
                target="_blank"
              >
                국제로타리
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">© 2025 경주중앙로타리클럽. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
