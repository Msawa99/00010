"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, ExternalLink, Scale, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  articles?: string[]
  links?: { title: string; url: string }[]
  timestamp: Date
}

export default function ChatPage() {
  // إزالة رسالة الترحيب الأولية
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputValue }),
      })

      const data = await response.json()

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: data.response,
        articles: data.articles,
        links: data.links,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: "عذراً، حدث خطأ في النظام. يرجى المحاولة مرة أخرى.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const downloadPDF = async () => {
    // البحث عن آخر رسالة من البوت
    const lastBotMessage = messages
      .slice()
      .reverse()
      .find((m) => m.type === "bot")
    if (!lastBotMessage) {
      alert("لا توجد استشارة متاحة للتحميل.")
      return
    }

    // البحث عن سؤال المستخدم المرتبط بآخر رسالة بوت
    const userQuestion =
      messages
        .slice(0, messages.indexOf(lastBotMessage))
        .reverse()
        .find((m) => m.type === "user")?.content || "استفسار عام"

    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          consultation: lastBotMessage.content,
          question: userQuestion,
          timestamp: lastBotMessage.timestamp,
        }),
      })

      const data = await response.json()

      if (data.html) {
        // إنشاء نافذة جديدة لطباعة PDF
        const printWindow = window.open("", "_blank")
        if (printWindow) {
          printWindow.document.write(data.html)
          printWindow.document.close()

          // انتظار تحميل المحتوى ثم طباعة
          printWindow.onload = () => {
            setTimeout(() => {
              printWindow.print()
            }, 500)
          }
        }
      }
    } catch (error) {
      console.error("Error downloading PDF:", error)
      alert("حدث خطأ في تحميل ملف PDF")
    }
  }

  const quickQuestions = [
    "كم ساعة العمل المسموحة في اليوم؟",
    "ما هي حقوق المريض في المستشفى؟",
    "كيف أقدم شكوى ضد صاحب العمل؟",
    "ما هي مخالفات المرور وغراماتها؟",
  ]

  // التحقق مما إذا كانت هناك أي رسائل بوت لعرض زر التحميل
  const hasBotMessages = messages.some((m) => m.type === "bot")

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:py-4">
            <Link href="/" className="flex items-center space-x-reverse space-x-2 md:space-x-3">
              <Scale className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
              <span className="text-base md:text-lg font-semibold text-gray-900">اعرف حقوقك</span>
            </Link>
            <h1 className="text-lg md:text-xl font-semibold text-gray-900">الاستشارات القانونية</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Quick Questions - تظهر فقط إذا لم تكن هناك رسائل بعد */}
        {messages.length === 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">أسئلة شائعة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-right justify-start h-auto p-3 whitespace-normal bg-transparent text-sm md:text-base"
                    onClick={() => setInputValue(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Messages */}
        <div className="space-y-4 mb-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex max-w-full md:max-w-3xl ${message.type === "user" ? "flex-row-reverse" : "flex-row"} space-x-reverse space-x-2 md:space-x-3`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === "user" ? "bg-green-600" : "bg-blue-600"
                  }`}
                >
                  {message.type === "user" ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`flex-1 ${message.type === "user" ? "text-right" : "text-right"}`}>
                  {message.type === "user" ? (
                    <div className="inline-block p-4 rounded-lg bg-green-600 text-white">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  ) : (
                    <Card className="w-full">
                      <CardContent className="p-4">
                        <p className="whitespace-pre-wrap text-gray-800">{message.content}</p>

                        {/* Articles */}
                        {message.articles && message.articles.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50 -mx-4 px-4">
                            <CardDescription className="text-sm font-semibold text-gray-700 mb-2">
                              المواد النظامية ذات الصلة:
                            </CardDescription>
                            <div className="flex flex-wrap gap-2">
                              {message.articles.map((article, index) => (
                                <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                                  {article}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Links */}
                        {message.links && message.links.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50 -mx-4 px-4">
                            <CardDescription className="text-sm font-semibold text-gray-700 mb-2">
                              الجهات الرسمية للشكوى:
                            </CardDescription>
                            <div className="space-y-2">
                              {message.links.map((link, index) => (
                                <a
                                  key={index}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                                >
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                  {link.title}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{message.timestamp.toLocaleTimeString("ar-SA")}</p>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex space-x-reverse space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border shadow-sm rounded-lg p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input and PDF Download Button */}
        <Card className="sticky bottom-4">
          <CardContent className="p-4">
            <div className="flex space-x-reverse space-x-2 items-center">
              {hasBotMessages && ( // عرض زر التحميل فقط إذا كانت هناك رسائل بوت
                <Button
                  onClick={downloadPDF}
                  variant="outline"
                  className="bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-800 min-w-[44px] min-h-[44px] p-2"
                  title="تحميل الاستشارة كـ PDF"
                >
                  <Download className="w-4 h-4" />
                </Button>
              )}
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="اكتب سؤالك هنا..."
                className="flex-1 text-base"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-green-600 hover:bg-green-700 min-w-[44px] min-h-[44px]"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
