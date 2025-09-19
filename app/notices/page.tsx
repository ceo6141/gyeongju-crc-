import type { Metadata } from "next"
import NoticesClient from "./noticesClient"

export const metadata: Metadata = {
  title: "공지사항 - 경주중앙로타리클럽",
  description: "경주중앙로타리클럽의 중요한 공지사항을 확인하세요",
}

export default function NoticesPage() {
  return <NoticesClient />
}
