import type { Metadata } from "next"
import GalleryClientPage from "./galleryClientPage"

export const metadata: Metadata = {
  title: "클럽갤러리 - 경주중앙로타리클럽",
  description: "경주중앙로타리클럽의 소중한 순간들을 함께 나누세요",
}

export default function GalleryPage() {
  return <GalleryClientPage />
}
