"use client"

import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, User, Download } from "lucide-react"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: "/api/chat",
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleDownloadPdf = async () => {
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "legal_consultation.pdf"
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading PDF:", error)
      alert("فشل في إنشاء ملف PDF. الرجاء المحاولة مرة أخرى.")
    }
  }

  const commonQuestions = [
    "ما هي حقوقي كموظف في السعودية؟",
    "كيف أرفع دعوى قضائية؟",
    "ما هي شروط تأسيس شركة؟",
    "ما هو نظام العمل السعودي؟",
  ]

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      <header className="sticky top-0 z-10 flex items-center justify-center h-16 border-b bg-white dark:bg-gray-900 px-4 shrink-0">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50">المستشار القانوني</h1>
      </header>
      <main className="flex-1 overflow-hidden p-4">
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-0">
            <CardTitle className="text-center text-lg">استشارة قانونية</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-4">
            <ScrollArea className="h-full pr-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                  <p className="mb-4 text-lg">كيف يمكنني مساعدتك اليوم؟</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md">
                    {commonQuestions.map((q, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto p-3 text-wrap bg-transparent"
                        onClick={() => append({ role: "user", content: q })}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((m, index) => (
                    <div
                      key={index}
                      className={cn("flex items-start gap-3", m.role === "user" ? "justify-end" : "justify-start")}
                    >
                      {m.role === "assistant" && (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="/placeholder-bot.jpg" />
                          <AvatarFallback>
                            <Bot className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "max-w-[70%] p-3 rounded-lg",
                          m.role === "user"
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-50 rounded-bl-none",
                        )}
                      >
                        <p className="text-sm">{m.content}</p>
                      </div>
                      {m.role === "user" && (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>
                            <User className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t bg-white dark:bg-gray-900 flex flex-col gap-2">
            {messages.length > 0 && (
              <div className="w-full flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPdf}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Download className="w-4 h-4" />
                  تنزيل PDF
                </Button>
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
              <Input
                placeholder="اكتب رسالتك..."
                value={input}
                onChange={handleInputChange}
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading}>
                إرسال
              </Button>
            </form>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
