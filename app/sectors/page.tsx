import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Building, Car, Heart, Users, Shield, Scale } from "lucide-react"

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="flex items-center justify-between h-16 px-4 border-b shrink-0 md:px-6 bg-white dark:bg-gray-800">
        <Link className="flex items-center gap-2 text-lg font-semibold sm:text-base" href="/">
          <Scale className="w-6 h-6 text-green-600" />
          <span className="sr-only">اعرف حقوقك</span>
          <span className="text-green-600">اعرف حقوقك</span>
        </Link>
        <nav className="hidden font-medium sm:flex flex-row items-center gap-5 text-sm lg:gap-6">
          <Link className="text-gray-500 dark:text-gray-400" href="/">
            الرئيسية
          </Link>
          <Link className="text-gray-500 dark:text-gray-400" href="/chat">
            استشارة قانونية
          </Link>
          <Link className="font-bold text-green-600" href="/sectors">
            القطاعات
          </Link>
        </nav>
        <Button className="rounded-full w-8 h-8" size="icon" variant="ghost">
          <img
            alt="Avatar"
            className="rounded-full"
            height="32"
            src="/placeholder-user.jpg"
            style={{
              aspectRatio: "32/32",
              objectFit: "cover",
            }}
            width="32"
          />
          <span className="sr-only">تبديل قائمة المستخدم</span>
        </Button>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8 md:px-6 md:py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-3">استكشف القطاعات القانونية</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            اختر القطاع الذي يهمك للحصول على معلومات مفصلة حول حقوقك وواجباتك والمواد القانونية ذات الصلة.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Link href="/sectors/labor">
            <Card className="flex flex-col items-center p-6 text-center hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-800">
              <Building className="w-12 h-12 text-green-600 mb-4" />
              <CardTitle className="text-xl text-gray-900 dark:text-gray-50">العمل والموارد البشرية</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400 mt-2">
                حقوق وواجبات العامل وصاحب العمل.
              </CardDescription>
            </Card>
          </Link>
          <Link href="/sectors/health">
            <Card className="flex flex-col items-center p-6 text-center hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-800">
              <Heart className="w-12 h-12 text-green-600 mb-4" />
              <CardTitle className="text-xl text-gray-900 dark:text-gray-50">الصحة</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400 mt-2">
                حقوق المرضى والتأمين الصحي.
              </CardDescription>
            </Card>
          </Link>
          <Link href="/sectors/traffic">
            <Card className="flex flex-col items-center p-6 text-center hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-800">
              <Car className="w-12 h-12 text-green-600 mb-4" />
              <CardTitle className="text-xl text-gray-900 dark:text-gray-50">المرور والنقل</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400 mt-2">
                قوانين المرور والمخالفات.
              </CardDescription>
            </Card>
          </Link>
          <Link href="/sectors/civil">
            <Card className="flex flex-col items-center p-6 text-center hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-800">
              <Users className="w-12 h-12 text-green-600 mb-4" />
              <CardTitle className="text-xl text-gray-900 dark:text-gray-50">الأحوال المدنية</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400 mt-2">
                الهوية، الميلاد، الزواج، والطلاق.
              </CardDescription>
            </Card>
          </Link>
          <Link href="/sectors/consumer">
            <Card className="flex flex-col items-center p-6 text-center hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-800">
              <Shield className="w-12 h-12 text-green-600 mb-4" />
              <CardTitle className="text-xl text-gray-900 dark:text-gray-50">حماية المستهلك</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400 mt-2">
                حقوق المستهلك والشكاوى التجارية.
              </CardDescription>
            </Card>
          </Link>
          {/* يمكنك إضافة المزيد من القطاعات هنا */}
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white dark:bg-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 اعرف حقوقك. جميع الحقوق محفوظة.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-gray-500 dark:text-gray-400" href="#">
            سياسة الخصوصية
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-500 dark:text-gray-400" href="#">
            شروط الاستخدام
          </Link>
        </nav>
      </footer>
    </div>
  )
}
