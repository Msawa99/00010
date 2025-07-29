import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { consultation, question, timestamp } = await request.json()

    // إنشاء محتوى HTML للـ PDF
    const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>استشارة قانونية رسمية</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600;700&display=swap');
        
        body {
            font-family: 'Noto Sans Arabic', Arial, sans-serif;
            line-height: 1.8;
            margin: 0;
            padding: 20px;
            background-color: #ffffff;
            color: #333;
            direction: rtl;
        }
        
        .header {
            text-align: center;
            border-bottom: 3px solid #059669;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .header h1 {
            color: #059669;
            font-size: 28px;
            font-weight: 700;
            margin: 0;
        }
        
        .header p {
            color: #666;
            font-size: 16px;
            margin: 10px 0 0 0;
        }
        
        .consultation-info {
            background-color: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
        }
        
        .consultation-info h2 {
            color: #059669;
            font-size: 20px;
            margin: 0 0 15px 0;
            font-weight: 600;
        }
        
        .question-box {
            background-color: #f8fafc;
            border-right: 4px solid #3b82f6;
            padding: 15px;
            margin-bottom: 25px;
            border-radius: 0 8px 8px 0;
        }
        
        .question-box h3 {
            color: #1e40af;
            font-size: 18px;
            margin: 0 0 10px 0;
            font-weight: 600;
        }
        
        .consultation-content {
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 30px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .consultation-content h3 {
            color: #059669;
            font-size: 18px;
            margin: 0 0 15px 0;
            font-weight: 600;
        }
        
        .footer {
            border-top: 2px solid #e5e7eb;
            padding-top: 20px;
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        
        .disclaimer {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin-top: 20px;
            font-size: 14px;
            color: #92400e;
        }
        
        .disclaimer h4 {
            color: #92400e;
            font-size: 16px;
            margin: 0 0 10px 0;
            font-weight: 600;
        }
        
        strong {
            font-weight: 600;
        }
        
        ul, ol {
            padding-right: 20px;
        }
        
        li {
            margin-bottom: 8px;
        }
        
        .page-break {
            page-break-before: always;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏛️ استشارة قانونية رسمية</h1>
        <p>منصة اعرف حقوقك - المساعد القانوني الذكي</p>
    </div>

    <div class="consultation-info">
        <h2>📋 معلومات الاستشارة</h2>
        <p><strong>تاريخ الاستشارة:</strong> ${new Date(timestamp).toLocaleDateString("ar-SA", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}</p>
        <p><strong>رقم الاستشارة:</strong> ${Date.now().toString().slice(-8)}</p>
        <p><strong>نوع الاستشارة:</strong> استشارة قانونية عامة</p>
    </div>

    <div class="question-box">
        <h3>❓ السؤال المطروح</h3>
        <p>${question}</p>
    </div>

    <div class="consultation-content">
        <h3>⚖️ الاستشارة القانونية</h3>
        <div>${consultation.replace(/\n/g, "<br>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</div>
    </div>

    <div class="disclaimer">
        <h4>⚠️ إخلاء مسؤولية</h4>
        <p>هذه الاستشارة القانونية مقدمة لأغراض إعلامية عامة ولا تشكل استشارة قانونية شخصية. يُنصح بمراجعة محامٍ مختص أو الجهات الرسمية المختصة للحصول على استشارة قانونية شخصية ومفصلة حول حالتك الخاصة.</p>
        <p><strong>المراجع:</strong> الأنظمة واللوائح المعمول بها في المملكة العربية السعودية</p>
    </div>

    <div class="footer">
        <p>© 2024 منصة اعرف حقوقك - جميع الحقوق محفوظة</p>
        <p>للمزيد من المعلومات: knowyourrights.sa</p>
    </div>
</body>
</html>`

    // إرجاع HTML كـ response للتحويل إلى PDF في الفرونت إند
    return NextResponse.json({
      html: htmlContent,
      filename: `استشارة-قانونية-${Date.now().toString().slice(-8)}.pdf`,
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "حدث خطأ في إنشاء ملف PDF" }, { status: 500 })
  }
}
