function getNextMeetingDate() {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  // Calculate 1st and 3rd Thursday of current month
  const firstThursday = getFirstThursday(currentYear, currentMonth)
  const thirdThursday = getThirdThursday(currentYear, currentMonth)

  // If both dates have passed, get next month's dates
  if (now > thirdThursday) {
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear
    const nextFirstThursday = getFirstThursday(nextYear, nextMonth)
    return formatMeetingDate(nextFirstThursday)
  }

  // Return the next upcoming meeting
  if (now <= firstThursday) {
    return formatMeetingDate(firstThursday)
  } else {
    return formatMeetingDate(thirdThursday)
  }
}

function getFirstThursday(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const dayOfWeek = firstDay.getDay()
  const daysToThursday = (4 - dayOfWeek + 7) % 7
  return new Date(year, month, 1 + daysToThursday)
}

function getThirdThursday(year: number, month: number) {
  const firstThursday = getFirstThursday(year, month)
  return new Date(firstThursday.getTime() + 14 * 24 * 60 * 60 * 1000)
}

function formatMeetingDate(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"]
  const dayName = dayNames[date.getDay()]

  return {
    formatted: `${year}년 ${month}월 ${day}일(${dayName})`,
    simple: `${year}.${month.toString().padStart(2, "0")}.${day.toString().padStart(2, "0")}`,
  }
}

export function getSharedNoticesData() {
  return [
    {
      id: 1,
      title: "이사회 개최 안내",
      content: "2025년 8월 28일(목) 오후 6시에 이사회가 개최됩니다.",
      date: "2025.08.25",
      type: "중요",
      details: {
        date: "2025년 8월 28일(목)",
        time: "오후 6시",
        location: "해물마당(권국창위원장)",
      },
    },
    {
      id: 2,
      title: "정기모임 안내",
      content: "다음 정기모임이 2025년 9월 4일(목) 오후 7시에 진행됩니다.",
      date: "2025.08.25",
      type: "일반",
      details: {
        date: "2025년 9월 4일(목)",
        time: "오후 7시",
        location: "본 클럽 회관",
      },
    },
  ]
}

export function syncNoticesData() {
  const savedNotices = localStorage.getItem("homepage-notices")

  if (savedNotices) {
    try {
      const parsedNotices = JSON.parse(savedNotices)
      if (Array.isArray(parsedNotices)) {
        console.log("[v0] 저장된 공지사항 데이터 로드 완료:", parsedNotices.length, "개")
        return parsedNotices
      }
    } catch (error) {
      console.error("공지사항 로드 오류:", error)
    }
  }

  const baseNotices = getSharedNoticesData()
  console.log("[v0] 기본 공지사항 데이터 초기화:", baseNotices.length, "개")
  localStorage.setItem("homepage-notices", JSON.stringify(baseNotices))
  return baseNotices
}

export function saveNoticesData(notices: any[]) {
  try {
    if (!Array.isArray(notices)) {
      console.error("잘못된 공지사항 데이터 형식")
      return false
    }

    localStorage.setItem("homepage-notices", JSON.stringify(notices))

    window.dispatchEvent(
      new CustomEvent("noticesUpdated", {
        detail: { notices },
      }),
    )

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "homepage-notices", // 통합된 키 사용
        newValue: JSON.stringify(notices),
      }),
    )

    console.log("[v0] 공지사항 저장 완료:", notices.length, "개")
    console.log("[v0] 저장된 공지사항 데이터:", notices)
    return true
  } catch (error) {
    console.error("공지사항 저장 오류:", error)
    alert("공지사항 저장 중 오류가 발생했습니다. 다시 시도해주세요.")
    return false
  }
}
