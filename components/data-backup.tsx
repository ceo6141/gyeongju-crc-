"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { backupData, restoreData, syncAllData } from "@/lib/data-manager"

export function DataBackup() {
  const [isRestoreOpen, setIsRestoreOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isRestoring, setIsRestoring] = useState(false)

  const handleBackup = () => {
    try {
      backupData()
      alert("데이터 백업이 완료되었습니다!")
    } catch (error) {
      console.error("[v0] 백업 오류:", error)
      alert("백업 중 오류가 발생했습니다.")
    }
  }

  const handleRestore = async () => {
    if (!selectedFile) {
      alert("복원할 파일을 선택해주세요.")
      return
    }

    setIsRestoring(true)
    try {
      await restoreData(selectedFile)
      alert("데이터 복원이 완료되었습니다!")
      setIsRestoreOpen(false)
      setSelectedFile(null)

      // 페이지 새로고침으로 모든 컴포넌트 업데이트
      window.location.reload()
    } catch (error) {
      console.error("[v0] 복원 오류:", error)
      alert("복원 중 오류가 발생했습니다: " + (error instanceof Error ? error.message : "알 수 없는 오류"))
    } finally {
      setIsRestoring(false)
    }
  }

  const handleSync = () => {
    try {
      syncAllData()
      alert("데이터 동기화가 완료되었습니다!")
    } catch (error) {
      console.error("[v0] 동기화 오류:", error)
      alert("동기화 중 오류가 발생했습니다.")
    }
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleBackup} className="gap-2 bg-transparent">
        <Icons.Download />
        백업
      </Button>

      <Dialog open={isRestoreOpen} onOpenChange={setIsRestoreOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Icons.Upload />
            복원
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>데이터 복원</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="backup-file">백업 파일 선택</Label>
              <Input
                id="backup-file"
                type="file"
                accept=".json"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleRestore} disabled={!selectedFile || isRestoring} className="flex-1">
                {isRestoring ? "복원 중..." : "복원"}
              </Button>
              <Button variant="outline" onClick={() => setIsRestoreOpen(false)} className="flex-1">
                취소
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Button variant="outline" size="sm" onClick={handleSync} className="gap-2 bg-transparent">
        <Icons.Database />
        동기화
      </Button>
    </div>
  )
}
