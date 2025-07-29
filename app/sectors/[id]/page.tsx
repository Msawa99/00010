"use client"

import { useParams } from "next/navigation"
import { Briefcase, Heart, Car, Scale, ArrowRight, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SectorDetailPage() {
  const params = useParams()
  const sectorId = params.id as string

  const sectorsData: Record<string, any> = {
    labor: {
      name: "قطاع العمل والموارد البشرية",
      description: "حقوق العمال والموظفين في المملكة العربية السعودية",
      icon: Briefcase,
      color: "bg-blue-500",
      articles: [
        {
          number: "المادة 97",
          title: "ساعات العمل اليومية",
          content:
            "لا يجوز تشغيل العامل أكثر من ثماني ساعات في اليوم الواحد أو ثمان وأربعين ساعة في الأسبوع، ويجوز زيادة ساعات العمل إلى تسع ساعات يومياً لبعض فئات العمال أو في بعض الأعمال التي يحددها الوزير.",
        },
        {
          number: "المادة 98",
          title: "فترات الراحة",
          content:
            "يجب إعطاء العامل فترة راحة لا تقل عن نصف ساعة خلال فترة العمل إذا زادت عن خمس ساعات متتالية، ولا تحتسب فترة الراحة من ساعات العمل.",
        },
        {
          number: "المادة 99",
          title: "العمل الإضافي",
          content:
            "إذا اقتضت ظروف العمل تشغيل العامل ساعات إضافية، وجب ألا تزيد على ثلاث ساعات في اليوم، وأن يؤدى له أجر إضافي قدره 150% من أجره الأساسي.",
        },
      ],
      commonQuestions: [
        "كم ساعة العمل المسموحة في اليوم؟",
        "ما هي حقوقي في العمل الإضافي؟",
        "كيف أحسب إجازاتي السنوية؟",
        "ما هي إجراءات إنهاء الخدمة؟",
      ],
      officialLinks: [
        { title: "وزارة الموارد البشرية والتنمية الاجتماعية", url: "https://www.hrsd.gov.sa" },
        { title: "منصة قوى للخدمات العمالية", url: "https://qiwa.sa" },
        { title: "المؤسسة العامة للتأمينات الاجتماعية", url: "https://www.gosi.gov.sa" },
      ],
    },
    health: {
      name: "القطاع الصحي",
      description: "حقوق المرضى والخدمات الصحية في المملكة",
      icon: Heart,
      color: "bg-green-500",
      articles: [
        {
          number: "المادة 5",
          title: "حق الحصول على الرعاية الصحية",
          content: "للمريض الحق في الحصول على الرعاية الصحية المناسبة وفقاً للإمكانيات المتاحة في المنشأة الصحية.",
        },
        {
          number: "المادة 6",
          title: "حق المعرفة والمعلومات",
          content:
            "للمريض الحق في معرفة اسم الطبيب المعالج ومؤهلاته، والحصول على المعلومات الكاملة عن تشخيص حالته الصحية.",
        },
        {
          number: "المادة 7",
          title: "حق الخصوصية والكرامة",
          content: "للمريض الحق في الخصوصية والكرامة الإنسانية، وحماية معلوماته الطبية من الإفشاء.",
        },
      ],
      commonQuestions: [
        "ما هي حقوقي كمريض في المستشفى؟",
        "كيف أحصل على تقرير طبي؟",
        "ما هي تغطية التأمين الصحي؟",
        "كيف أقدم شكوى ضد مقدم الخدمة الصحية؟",
      ],
      officialLinks: [
        { title: "وزارة الصحة", url: "https://www.moh.gov.sa" },
        { title: "مجلس الضمان الصحي التعاوني", url: "https://www.cchi.gov.sa" },
        { title: "الهيئة السعودية للتخصصات الصحية", url: "https://www.scfhs.org.sa" },
      ],
    },
    traffic: {
      name: "قطاع المرور والنقل",
      description: "قوانين المرور والنقل في المملكة العربية السعودية",
      icon: Car,
      color: "bg-red-500",
      articles: [
        {
          number: "المادة 15",
          title: "شروط الحصول على رخصة القيادة",
          content:
            "يشترط للحصول على رخصة قيادة المركبات أن يكون طالب الرخصة قد أتم الثامنة عشرة من عمره، وأن يجتاز الفحص الطبي والاختبارات المطلوبة.",
        },
        {
          number: "المادة 25",
          title: "السرعة المسموحة",
          content: "يجب على قائد المركبة التقيد بحدود السرعة المحددة، والتي تختلف حسب نوع الطريق والمنطقة.",
        },
      ],
      commonQuestions: [
        "كيف أحصل على رخصة قيادة؟",
        "ما هي غرامات المخالفات المرورية؟",
        "كيف أسجل حادث مروري؟",
        "ما هي إجراءات تجديد الرخصة؟",
      ],
      officialLinks: [
        { title: "منصة أبشر", url: "https://www.absher.sa" },
        { title: "الإدارة العامة للمرور", url: "https://www.moi.gov.sa" },
        { title: "شركة تطوير النقل", url: "https://www.transport.gov.sa" },
      ],
    },
  }

  const sector = sectorsData[sectorId]

  if (!sector) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">القطاع غير موجود</h1>
          <Link href="/sectors">
            <Button>العودة للقطاعات</Button>
          </Link>
        </div>
      </div>
    )
  }

  const IconComponent = sector.icon

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
            <nav className="flex items-center space-x-reverse space-x-2 md:space-x-4 text-sm md:text-base">
              <Link href="/sectors" className="text-gray-600 hover:text-gray-900">
                القطاعات
              </Link>
              <ArrowRight className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
              <span className="text-gray-900 truncate max-w-[120px] md:max-w-none">{sector.name}</span>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Sector Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-reverse md:space-x-4 mb-6">
            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-lg ${sector.color} flex items-center justify-center`}>
              <IconComponent className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{sector.name}</h1>
              <p className="text-base md:text-lg text-gray-600 mt-2">{sector.description}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-reverse sm:space-x-4">
            <Link href="/chat">
              <Button className="bg-green-600 hover:bg-green-700">اطلب استشارة قانونية</Button>
            </Link>
            <Button variant="outline">تحميل دليل القطاع</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Legal Articles */}
            <Card>
              <CardHeader>
                <CardTitle>المواد النظامية الأساسية</CardTitle>
                <CardDescription>أهم المواد القانونية المتعلقة بهذا القطاع</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {sector.articles.map((article: any, index: number) => (
                  <div key={index} className="border-r-4 border-green-500 pr-4">
                    <div className="flex items-center space-x-reverse space-x-2 mb-2">
                      <Badge variant="secondary">{article.number}</Badge>
                      <h3 className="font-semibold text-gray-900">{article.title}</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{article.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Common Questions */}
            <Card>
              <CardHeader>
                <CardTitle>أسئلة شائعة</CardTitle>
                <CardDescription>الأسئلة الأكثر تكراراً في هذا القطاع</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sector.commonQuestions.map((question: string, index: number) => (
                    <Link key={index} href={`/chat?q=${encodeURIComponent(question)}`}>
                      <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <p className="text-gray-900">{question}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Official Links */}
            <Card>
              <CardHeader>
                <CardTitle>الجهات الرسمية</CardTitle>
                <CardDescription>روابط مباشرة للجهات المختصة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {sector.officialLinks.map((link: any, index: number) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-900">{link.title}</span>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </a>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>إجراءات سريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/chat">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    اطلب استشارة محددة
                  </Button>
                </Link>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  تحميل النماذج
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  تقديم شكوى
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
