import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SectorDetailPage({ params }: { params: { id: string } }) {
  const { id } = params

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">تفاصيل القطاع: {decodeURIComponent(id)}</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-lg text-gray-700 dark:text-gray-300">
          <p className="mb-6">
            هذه الصفحة مخصصة لعرض تفاصيل ومعلومات محددة حول القطاع القانوني "{decodeURIComponent(id)}". يمكنك هنا العثور
            على مقالات، استشارات، وموارد ذات صلة بهذا المجال.
          </p>
          <Link href="/sectors" passHref>
            <Button>العودة إلى القطاعات</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
