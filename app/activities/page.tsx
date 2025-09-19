import type { Metadata } from "next"
import ActivitiesClient from "./activitiesClient"

export const metadata: Metadata = {
  title: "봉사활동 - 경주중앙로타리클럽",
  description: "지역사회를 위한 경주중앙로타리클럽의 봉사활동을 확인하세요",
}

export default function ActivitiesPage() {
  return <ActivitiesClient />
}
