"use client"

import { Briefcase, Heart, Car, Users, Building, Scale, Phone, Globe, GraduationCap, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function SectorsPage() {
  const sectors = [
    {
      id: "labor",
      name: "قطاع العمل والموارد البشرية",
      description: "حقوق العمال والموظفين، ساعات العمل، الإجازات، والتأمينات الاجتماعية",
      icon: Briefcase,
      color: "bg-blue-500",
      topics: ["ساعات العمل", "الإجازات", "الرواتب", "التأمينات", "إنهاء الخدمة"],
      complaints: "وزارة الموارد البشرية والتنمية الاجتماعية",
    },
    {
      id: "health",
      name: "القطاع الصحي",
      description: "حقوق المرضى، الخدمات الصحية، التأمين الصحي، والشكاوى الطبية",
      icon: Heart,
      color: "bg-green-500",
      topics: ["حقوق المريض", "التأمين الصحي", "الأخطاء الطبية", "الأدوية", "الطوارئ"],
      complaints: "وزارة الصحة",
    },
    {
      id: "traffic",
      name: "قطاع المرور والنقل",
      description: "قوانين المرور، المخالفات، رخص القيادة، والحوادث المرورية",
      icon: Car,
      color: "bg-red-500",
      topics: ["المخالفات المرورية", "رخص القيادة", "الحوادث", "التأمين", "النقل العام"],
      complaints: "الإدارة العامة للمرور",
    },
    {
      id: "civil",
      name: "الأحوال المدنية",
      description: "الوثائق الرسمية، الهوية الوطنية، جوازات السفر، والسجلات المدنية",
      icon: Users,
      color: "bg-purple-500",
      topics: ["الهوية الوطنية", "جوازات السفر", "شهادات الميلاد", "الزواج", "الطلاق"],
      complaints: "وكالة الأحوال المدنية",
    },
    {
      id: "housing",
      name: "قطاع الإسكان",
      description: "حقوق السكن، الإيجار، القروض العقارية، والمشاريع الإسكانية",
      icon: Building,
      color: "bg-orange-500",
      topics: ["عقود الإيجار", "القروض العقارية", "الإسكان التنموي", "المطورين", "الصيانة"],
      complaints: "وزارة الإسكان",
    },
    {
      id: "consumer",
      name: "حماية المستهلك",
      description: "حقوق المستهلكين، الشكاوى التجارية، الضمانات، والخدمات المصرفية",
      icon: Scale,
      color: "bg-teal-500",
      topics: ["الضمانات", "الخدمات المصرفية", "التجارة الإلكترونية", "الأسعار", "الجودة"],
      complaints: "وزارة التجارة",
    },
    {
      id: "telecom",
      name: "قطاع الاتصالات وتقنية المعلومات",
      description: "خدمات الاتصالات، الإنترنت، الفواتير، والخصوصية الرقمية",
      icon: Phone,
      color: "bg-indigo-500",
      topics: ["فواتير الاتصالات", "جودة الخدمة", "الإنترنت", "الخصوصية", "البيانات"],
      complaints: "هيئة الاتصالات وتقنية المعلومات",
    },
    {
      id: "municipal",
      name: "الخدمات البلدية",
      description: "خدمات البلديات، التراخيص، النظافة، والمرافق العامة",
      icon: Globe,
      color: "bg-cyan-500",
      topics: ["التراخيص التجارية", "النظافة", "المرافق", "البناء", "الحدائق"],
      complaints: "وزارة الشؤون البلدية والقروية",
    },
    {
      id: "education",
      name: "قطاع التعليم",
      description: "حقوق الطلاب، التعليم العام والجامعي، والمنح الدراسية",
      icon: GraduationCap,
      color: "bg-yellow-500",
      topics: ["حقوق الطلاب", "المنح الدراسية", "التعليم الجامعي", "الشهادات", "التدريب"],
      complaints: "وزارة التعليم",
    },
    {
      id: "security",
      name: "الأمن العام",
      description: "الأمن والسلامة، الشرطة، الدفاع المدني، والطوارئ",
      icon: Shield,
      color: "bg-gray-500",
      topics: ["الأمن العام", "الطوارئ", "الدفاع المدني", "الحوادث", "السلامة"],
      complaints: "وزارة الداخلية",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:py-4">
            <Link href="/" className="flex items-center space-x-reverse space-x-2 md:space-x-3">
              <Scale className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
              <span className="text-base md:text-lg font-semibold text-gray-900">اعرف حقوقك</span>
            </Link>
            <h1 className="text-lg md:text-xl font-semibold text-gray-900">القطاعات الحكومية</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8 md:mb-12 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">اختر القطاع المناسب لاستفسارك</h2>
          <p className="text-base md:text-lg text-gray-600">
            تصفح القطاعات الحكومية المختلفة للحصول على معلومات مفصلة حول حقوقك وواجباتك
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {sectors.map((sector) => {
            const IconComponent = sector.icon
            return (
              <Link key={sector.id} href={`/sectors/${sector.id}`}>
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${sector.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg leading-tight">{sector.name}</CardTitle>
                    <CardDescription className="text-sm">{sector.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">المواضيع الرئيسية:</p>
                        <div className="flex flex-wrap gap-1">
                          {sector.topics.slice(0, 3).map((topic, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                          {sector.topics.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{sector.topics.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">جهة الشكاوى:</p>
                        <p className="text-xs text-gray-600">{sector.complaints}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Help Section */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">لم تجد ما تبحث عنه؟</h3>
          <p className="text-gray-600 mb-6">يمكنك طلب استشارة قانونية للحصول على إجابات فورية لأي استفسار قانوني</p>
          <Link href="/chat">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium">
              اطلب استشارة قانونية
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
