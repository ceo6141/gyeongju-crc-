export const uploadFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("파일이 선택되지 않았습니다."))
      return
    }

    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error("파일 크기는 5MB 이하여야 합니다."))
      return
    }

    // 이미지 파일 타입 체크
    if (!file.type.startsWith("image/")) {
      reject(new Error("이미지 파일만 업로드 가능합니다."))
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      const result = e.target?.result as string
      resolve(result)
    }

    reader.onerror = () => {
      reject(new Error("파일 읽기에 실패했습니다."))
    }

    reader.readAsDataURL(file)
  })
}

export const validateImageFile = (file: File): string | null => {
  if (!file) return "파일이 선택되지 않았습니다."
  if (file.size > 5 * 1024 * 1024) return "파일 크기는 5MB 이하여야 합니다."
  if (!file.type.startsWith("image/")) return "이미지 파일만 업로드 가능합니다."
  return null
}
