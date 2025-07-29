"use client"
import { MessageCircle, Scale, Users, Car, Briefcase, Heart, Building, Phone } from "lucide-react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input" // Import Input component
import Link from "next/link"
import { useState } from "react" // Import useState

export default function HomePage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const sectors = [
    {
      id: "labor",
      name: "قطاع العمل",
      description: "حقوق العمال والموظفين",
      icon: Briefcase,
      color: "bg-blue-500",
    },
    {
      id: "health",
      name: "القطاع الصحي",
      description: "حقوق المرضى والخدمات الصحية",
      icon: Heart,
      color: "bg-green-500",
    },
    {
      id: "traffic",
      name: "قطاع المرور",
      description: "قوانين المرور والمخالفات",
      icon: Car,
      color: "bg-red-500",
    },
    {
      id: "civil",
      name: "الأحوال المدنية",
      description: "الوثائق والإجراءات المدنية",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      id: "housing",
      name: "قطاع الإسكان",
      description: "حقوق السكن والإيجار",
      icon: Building,
      color: "bg-orange-500",
    },
    {
      id: "consumer",
      name: "حماية المستهلك",
      description: "حقوق المستهلكين والشكاوى التجارية",
      icon: Scale,
      color: "bg-teal-500",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/save-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        setMessage(data.message)
        setEmail("") // Clear email on success
      } else {
        setIsSuccess(false)
        setMessage(data.message || "حدث خطأ غير معروف.")
      }
    } catch (error) {
      console.error("Failed to submit email:", error)
      setIsSuccess(false)
      setMessage("حدث خطأ في الاتصال بالخادم.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-reverse space-x-3">
              <Scale className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">اعرف حقوقك</h1>
            </div>
            <nav className="hidden md:flex space-x-reverse space-x-6">
              <Link href="/" className="text-gray-700 hover:text-green-600">
                الرئيسية
              </Link>
              <Link href="/chat" className="text-gray-700 hover:text-green-600">
                استشارة قانونية
              </Link>
              <Link href="/sectors" className="text-gray-700 hover:text-green-600">
                القطاعات
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
            اكتشف حقوقك في المملكة العربية السعودية
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8">
            منصة متكاملة لتقديم الاستشارات القانونية ومساعدتك في فهم حقوقك وواجباتك وفقاً للأنظمة السعودية
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-reverse sm:space-x-4">
            <Link href="/chat">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <MessageCircle className="ml-2 h-5 w-5" />
                ابدأ المحادثة
              </Button>
            </Link>
            <Link href="/sectors">
              <Button size="lg" variant="outline">
                تصفح القطاعات
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">كيف يمكننا مساعدتك؟</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <Card>
              <CardHeader>
                <MessageCircle className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>استشارات قانونية</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  اسأل أي سؤال قانوني واحصل على إجابات فورية مع الاستشهاد بالمواد النظامية
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Scale className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>مراجع قانونية</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  الحصول على المواد النظامية والقوانين ذات الصلة بسؤالك مع روابط المصادر الرسمية
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Phone className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>جهات الشكوى</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">روابط مباشرة للجهات الرسمية المختصة لتقديم الشكاوى والاستفسارات</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sectors Preview */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">القطاعات الحكومية</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {sectors.slice(0, 6).map((sector) => {
              const IconComponent = sector.icon
              return (
                <Link key={sector.id} href={`/sectors/${sector.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg ${sector.color} flex items-center justify-center mb-4`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{sector.name}</CardTitle>
                      <CardDescription>{sector.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              )
            })}
          </div>
          <div className="text-center mt-8">
            <Link href="/sectors">
              <Button variant="outline" size="lg">
                عرض جميع القطاعات
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Email Registration Section */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">اشترك لتصلك آخر التحديثات القانونية</h3>
          <p className="text-lg text-gray-600 mb-8">ابقَ على اطلاع دائم بآخر التغييرات في الأنظمة والقوانين السعودية.</p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              className="flex-1 text-right"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="rtl"
            />
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading ? "جاري الإرسال..." : "اشترك الآن"}
            </Button>
          </form>
          {message && (
            <p className={`mt-4 text-lg ${message.includes("نجاح") ? "text-green-600" : "text-red-600"}`}>{message}</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-reverse space-x-3 mb-4">
                <Scale className="h-6 w-6" />
                <h4 className="text-lg font-semibold">اعرف حقوقك</h4>
              </div>
              <p className="text-gray-400">منصة ذكية لمساعدة المواطنين والمقيمين في فهم حقوقهم وواجباتهم</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">روابط مهمة</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="https://www.moj.gov.sa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    وزارة العدل
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.hrsd.gov.sa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    وزارة الموارد البشرية
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.moh.gov.sa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    وزارة الصحة
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.moi.gov.sa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    وزارة الداخلية
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 اعرف حقوقك. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
