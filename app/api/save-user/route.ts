import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  const { email } = await request.json()
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  try {
    const { data, error } = await supabase.from("users").insert([{ email }])

    if (error) {
      if (error.code === "23505") {
        // Unique violation error code
        return NextResponse.json({ success: false, message: "هذا البريد الإلكتروني مسجل بالفعل." }, { status: 409 })
      }
      console.error("Error saving user email:", error)
      return NextResponse.json({ success: false, message: "حدث خطأ أثناء حفظ بريدك الإلكتروني." }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "✅ تم حفظ بريدك بنجاح" }, { status: 200 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ success: false, message: "حدث خطأ غير متوقع." }, { status: 500 })
  }
}
