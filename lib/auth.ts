export const ADMIN_PASSWORD = "1234" // 관리자 비밀번호

export function checkAdminAuth(): boolean {
  if (typeof window === "undefined") return false
  const isAuthenticated = localStorage.getItem("adminAuthenticated")
  const authTime = localStorage.getItem("adminAuthTime")

  if (!isAuthenticated || !authTime) return false

  // 24시간 후 자동 로그아웃
  const authTimeMs = Number.parseInt(authTime)
  const now = Date.now()
  const twentyFourHours = 24 * 60 * 60 * 1000

  if (now - authTimeMs > twentyFourHours) {
    localStorage.removeItem("adminAuthenticated")
    localStorage.removeItem("adminAuthTime")
    return false
  }

  return isAuthenticated === "true"
}

export function setAdminAuth(authenticated: boolean) {
  if (typeof window === "undefined") return

  if (authenticated) {
    localStorage.setItem("adminAuthenticated", "true")
    localStorage.setItem("adminAuthTime", Date.now().toString())
  } else {
    localStorage.removeItem("adminAuthenticated")
    localStorage.removeItem("adminAuthTime")
  }
}

export function validatePassword(password: string): boolean {
  return password === ADMIN_PASSWORD
}
