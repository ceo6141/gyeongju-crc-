"use client"

import { useEffect } from "react"

function CacheBuster() {
  useEffect(() => {
    const currentVersion = localStorage.getItem("site-version")
    const newVersion = Date.now().toString()

    if (currentVersion !== newVersion) {
      localStorage.setItem("site-version", newVersion)
      // Clear old cached data to ensure consistency
      const keysToKeep = ["admin-auth", "gallery-images", "notices"]
      Object.keys(localStorage).forEach((key) => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key)
        }
      })
    }
  }, [])

  return null
}

export default CacheBuster
export { CacheBuster }
