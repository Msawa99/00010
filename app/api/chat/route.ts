import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { cookies } from "next/headers"

// Define the LegalArticle type
type LegalArticle = {
  id: number
  title: string
  content: string
  embedding: number[] | null // Assuming embedding can be null if not present
}

// مفتاح OpenRouter مع OpenAI
const OPENROUTER_API_KEY =
  process.env.OPENROUTER_API_KEY || "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"
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

const officialLinks = {
  labor: [
    { title: "وزارة الموارد البشرية - تقديم شكوى", url: "https://www.hrsd.gov.sa/complaints" },
    { title: "منصة قوى - حقوق العمال", url: "https://qiwa.sa" },
    { title: "المؤسسة العامة للتأمينات الاجتماعية", url: "https://www.gosi.gov.sa" },
  ],
  health: [
    {
      title: "وزارة الصحة - شكاوى المرضى",
      url: "https://www.moh.gov.sa/Ministry/MediaCenter/Publications/Pages/Publications-2020-10-27-002.aspx",
    },
    { title: "مجلس الضمان الصحي", url: "https://www.cchi.gov.sa" },
    { title: "منصة صحة - الشكاوى", url: "https://seha.sa" },
  ],
  traffic: [
    { title: "أبشر - الخدمات المرورية", url: "https://www.absher.sa" },
    { title: "الإدارة العامة للمرور", url: "https://www.moi.gov.sa/wps/portal/Home/sectors/publicsecurity/traffic" },
    { title: "منصة توكلنا - المخالفات", url: "https://ta.gov.sa" },
  ],
  civil: [
    { title: "وكالة الأحوال المدنية", url: "https://www.my.gov.sa/wps/portal/snp/agencies/agencyDetails/AC002" },
    { title: "أبشر - الأحوال المدنية", url: "https://www.absher.sa" },
  ],
  consumer: [
    { title: "وزارة التجارة - حماية المستهلك", url: "https://mc.gov.sa/ar/consumer" },
    { title: "منصة بلاغ تجاري", url: "https://cci.gov.sa" },
  ],
}

// Function to analyze the question and find relevant legal articles
async function analyzeQuestion(question: string): Promise<any[]> {
  const supabase = getSupabaseServerClient()

  // Simple keyword matching for demonstration.
  // In a real application, you'd use more advanced NLP/embedding search.
  const keywords = question.split(/\s+/).filter((word) => word.length > 2) // Basic tokenization

  if (keywords.length === 0) {
    return []
  }

  // Build a dynamic query to search for keywords in title, content, or keywords array
  let query = supabase.from("legal_articles").select("*")

  // Add OR conditions for each keyword
  const orConditions = keywords
    .map((keyword) => {
      const lowerKeyword = keyword.toLowerCase()
      return `title.ilike.%${lowerKeyword}%,content.ilike.%${lowerKeyword}%,keywords.cs.{${lowerKeyword}}`
    })
    .join(",")

  query = query.or(orConditions)
  query = query.limit(3) // Limit to top 3 relevant articles

  const { data, error } = await query

  if (error) {
    console.error("Error fetching legal articles from Supabase:", error)
    return []
  }

  return data || []
}

function getSupabaseServerClient() {
  // Placeholder for the actual implementation
  return {}
}

// Function to get official complaint links based on the sector
function getOfficialComplaintLinks(sector: string) {
  const complaintLinks = {
    labor: [
      {
        title: "وزارة الموارد البشرية - تقديم شكوى عمالية",
        url: "https://www.hrsd.gov.sa/ar/complaint",
        phone: "19911",
      },
      { title: "منصة قوى - الشكاوى العمالية", url: "https://qiwa.sa/ar/individual/complaints", phone: "920020301" },
      {
        title: "المؤسسة العامة للتأمينات الاجتماعية",
        url: "https://www.gosi.gov.sa/ar/complaints",
        phone: "8001243344",
      },
      { title: "مكتب العمل - الشكاوى المباشرة", url: "https://www.hrsd.gov.sa/ar/offices", phone: "19911" },
    ],
    health: [
      {
        title: "وزارة الصحة - شكاوى المرضى",
        url: "https://www.moh.gov.sa/Ministry/MediaCenter/Publications/Pages/Publications-2020-10-27-002.aspx",
        phone: "937",
      },
      { title: "مجلس الضمان الصحي التعاوني", url: "https://www.cchi.gov.sa/ar/complaints", phone: "920001937" },
      { title: "منصة صحة - الشكاوى الطبية", url: "https://seha.sa", phone: "937" },
      { title: "الهيئة السعودية للتخصصات الصحية", url: "https://www.scfhs.org.sa/ar/complaints", phone: "920019393" },
    ],
    traffic: [
      {
        title: "أبشر - الاعتراض على المخالفات",
        url: "https://www.absher.sa/wps/portal/individuals/IndividualsServices/!ut/p/z1/04_Sj9CPykssy0xPLMnMz0vMAfIjo8zi_QO8nQ0C_E2dDQz8_VxNDTxDPJ0N_I0MvE30w8EKDHAARwP9KGL041EQhd_4cP0oVBTkRhikOyoqAgDTJCNQ/dz/d5/L2dBISEvZ0FBIS9nQSEh/",
        phone: "989",
      },
      {
        title: "الإدارة العامة للمرور",
        url: "https://www.moi.gov.sa/wps/portal/Home/sectors/publicsecurity/traffic",
        phone: "989",
      },
      { title: "منصة توكلنا - المخالفات المرورية", url: "https://ta.gov.sa", phone: "937" },
      { title: "شركة تطوير النقل", url: "https://www.transport.gov.sa/ar/complaints", phone: "8001166666" },
    ],
    civil: [
      {
        title: "وكالة الأحوال المدنية - الشكاوى",
        url: "https://www.my.gov.sa/wps/portal/snp/agencies/agencyDetails/AC002",
        phone: "920020405",
      },
      { title: "أبشر - خدمات الأحوال المدنية", url: "https://www.absher.sa", phone: "920020405" },
      { title: "وزارة الداخلية - الشكاوى", url: "https://www.moi.gov.sa/wps/portal/Home/complaint", phone: "989" },
    ],
    consumer: [
      {
        title: "وزارة التجارة - حماية المستهلك",
        url: "https://mc.gov.sa/ar/consumer/Pages/default.aspx",
        phone: "1900",
      },
      { title: "منصة بلاغ تجاري", url: "https://cci.gov.sa/ar/complaints", phone: "1900" },
      {
        title: "الهيئة السعودية للمواصفات والمقاييس",
        url: "https://www.saso.gov.sa/ar/complaints",
        phone: "920000940",
      },
    ],
    general: [
      { title: "ديوان المظالم", url: "https://www.bog.gov.sa/ar/complaints", phone: "8001221000" },
      { title: "هيئة حقوق الإنسان", url: "https://www.hrc.gov.sa/ar/complaints", phone: "8001221111" },
      { title: "النيابة العامة", url: "https://www.ppo.gov.sa/ar/complaints", phone: "8001221555" },
    ],
  }

  return complaintLinks[sector] || complaintLinks.general
}

// Function to generate a detailed local response based on the question
function getDetailedLocalResponse(question: string, analysis: any) {
  const lowerQuestion = question.toLowerCase()

  // Questions about work hours
  if (lowerQuestion.includes("ساعة") || lowerQuestion.includes("دوام")) {
    if (lowerQuestion.includes("12") || lowerQuestion.includes("١٢")) {
      return `⚠️ **تنبيه مهم: العمل 12 ساعة يومياً مخالف للنظام!**

📋 **المادة 97 من نظام العمل السعودي:**
• الحد الأقصى للعمل: **8 ساعات يومياً** أو **48 ساعة أسبوعياً**
• يمكن زيادة العمل إلى **9 ساعات** في بعض الحالات الاستثنائية فقط

📋 **المادة 98 - فترات الراحة الإجبارية:**
• يجب إعطاء راحة **نصف ساعة** خلال فترة العمل إذا زادت عن خمس ساعات متتالية
• فترة الراحة لا تحتسب من ساعات العمل

📋 **المادة 99 - العمل الإضافي:**
• الحد الأقصى: **3 ساعات إضافية يومياً**
• الأجر الإضافي: **150%** من الأجر الأساسي
• يجب موافقة العامل على العمل الإضافي

🏛️ **حقوقك القانونية:**
• يمكنك رفض العمل أكثر من 8 ساعات قانونياً
• لك الحق في المطالبة بأجر إضافي عن أي ساعة زائدة
• يمكنك تقديم شكوى ضد صاحب العمل

📞 **للشكوى والمساعدة:**
• وزارة الموارد البشرية: منصة قوى
• الخط الساخن: 19911
• يمكنك تقديم الشكوى إلكترونياً دون الكشف عن هويتك`
    }

    return `⏰ **ساعات العمل وفقاً للنظام السعودي:**

📋 **المادة 97 - ساعات العمل الأساسية:**
• **8 ساعات** كحد أقصى يومياً
• **48 ساعة** كحد أقصى أسبوعياً  
• يمكن زيادة العمل إلى **9 ساعات** في حالات خاصة محددة بالنظام

📋 **المادة 98 - فترات الراحة الإجبارية:**
• راحة **نصف ساعة** كل **5 ساعات** عمل متتالي
• لا تحتسب فترة الراحة من ساعات العمل
• هذه الراحة **حق إجباري** وليس اختياري

📋 **المادة 99 - العمل الإضافي:**
• حد أقصى **3 ساعات إضافية** يومياً
• أجر إضافي **150%** من الأجر الأساسي
• يتطلب موافقة العامل

💡 **نصائح مهمة:**
• احتفظ بسجل لساعات عملك اليومية
• اطلب إثبات كتابي لأي عمل إضافي
• لا تتردد في المطالبة بحقوقك`
  }

  // Questions about leave
  if (lowerQuestion.includes("إجازة") || lowerQuestion.includes("اجازة")) {
    return `🏖️ **حقوق الإجازات في نظام العمل السعودي:**

📋 **المادة 109 - الإجازة السنوية:**
• **21 يوم** كحد أدنى بعد إكمال سنة كاملة من العمل
• **30 يوم** للعمال الذين أمضوا 5 سنوات أو أكثر
• الإجازة **مدفوعة الأجر** كاملاً

📋 **أنواع الإجازات الأخرى:**
• **إجازة مرضية:** حسب التقرير الطبي
• **إجازة أمومة:** 10 أسابيع للموظفات
• **إجازة حج:** مرة واحدة خلال فترة الخدمة
• **إجازة وفاة:** 3 أيام للأقارب من الدرجة الأولى

💡 **حقوقك في الإجازة:**
• لا يمكن لصاحب العمل منع الإجازة السنوية
• يمكن تأجيل الإجازة بموافقة الطرفين
• يحق لك الحصول على بدل نقدي عن الإجازة عند انتهاء الخدمة

📞 **للاستفسار:** وزارة الموارد البشرية - منصة قوى`
  }

  // Questions about health
  if (lowerQuestion.includes("مريض") || lowerQuestion.includes("صحة") || lowerQuestion.includes("مستشفى")) {
    return `🏥 **حقوق المريض في النظام الصحي السعودي:**

📋 **المادة 5 - حق الرعاية الصحية:**
• الحق في الحصول على **الرعاية الصحية المناسبة**
• العلاج وفقاً للمعايير الطبية المعتمدة
• عدم التمييز في تقديم الخدمة

📋 **المادة 6 - حق المعرفة والمعلومات:**
• معرفة **اسم الطبيب المعالج** ومؤهلاته
• الحصول على **معلومات كاملة** عن التشخيص
• معرفة **خطة العلاج** والمخاطر المحتملة
• الحق في **رأي طبي ثاني**

📋 **المادة 7 - حق الخصوصية والكرامة:**
• **الخصوصية التامة** أثناء الفحص والعلاج
• **حماية المعلومات الطبية** من الإفشاء
• الحق في **رفض العلاج** أو إجراء معين
• **الكرامة الإنسانية** في جميع مراحل العلاج

💊 **حقوق إضافية:**
• الحصول على الأدوية المطلوبة
• خدمات الطوارئ دون تأخير
• تقارير طبية عند الطلب

📞 **للشكاوى الطبية:**
• وزارة الصحة: 937
• مجلس الضمان الصحي
• منصة صحة الإلكترونية`
  }

  // Questions about traffic
  if (lowerQuestion.includes("مرور") || lowerQuestion.includes("قيادة") || lowerQuestion.includes("مخالفة")) {
    return `🚗 **قوانين المرور في المملكة العربية السعودية:**

📋 **المادة 15 - شروط الحصول على رخصة القيادة:**
• إتمام **18 سنة** من العمر
• اجتياز **الفحص الطبي**
• اجتياز **الاختبار النظري** و**العملي**
• دفع الرسوم المقررة

🚦 **المخالفات الشائعة وغراماتها:**
• **تجاوز السرعة:** 150-1000 ريال حسب المخالفة
• **عدم ربط حزام الأمان:** 150 ريال
• **استخدام الهاتف:** 500 ريال
• **عدم التوقف عند الإشارة الحمراء:** 1000 ريال

📱 **للاستفسار عن المخالفات:**
• **منصة أبشر** - الخدمات المرورية
• **تطبيق توكلنا** - قسم المخالفات
• **موقع الإدارة العامة للمرور**

⚖️ **حقوقك في المخالفات:**
• يمكنك **الاعتراض** على المخالفة خلال **30 يوماً**
• حق طلب **مراجعة المخالفة** مع الأدلة
• إمكانية **التقسيط** للمخالفات الكبيرة

💡 **نصائح مهمة:**
• احتفظ بصور للحادث إن وجد
• تأكد من صحة بياناتك في النظام
• راجع مخالفاتك دورياً`
  }

  // General response for unspecified questions
  return `مرحباً بك في "اعرف حقوقك" 👋

**أنا هنا لتقديم الاستشارات القانونية ومساعدتك في فهم حقوقك وواجباتك وفقاً للأنظمة السعودية**

📚 **يمكنني مساعدتك في المجالات التالية:**

🏢 **قطاع العمل والموارد البشرية:**
• ساعات العمل والراحة (المواد 97-98)
• الرواتب والعمل الإضافي (المادة 99)
• الإجازات السنوية والمرضية (المادة 109)
• حقوق إنهاء الخدمة

🏥 **القطاع الصحي:**
• حقوق المرضى (المواد 5-7)
• التأمين الصحي والتغطية
• الشكاوى الطبية والأخطاء

🚗 **قطاع المرور والنقل:**
• رخص القيادة والتجديد
• المخالفات المرورية وغراماتها
• الحوادث والتأمين

👥 **الأحوال المدنية:**
• الهوية الوطنية وجوازات السفر
• شهادات الميلاد والزواج
• الإجراءات الرسمية

🛡️ **حماية المستهلك:**
• حقوق المشترين والضمانات
• الشكاوى التجارية
• التجارة الإلكترونية

💡 **اكتب سؤالك بوضوح وسأقدم لك استشارة مفصلة مع المواد النظامية ذات الصلة وروابط الجهات المختصة.**

مثال: "أعمل 12 ساعة يومياً، هل هذا قانوني؟"`
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json()
  const lastUserMessage = messages[messages.length - 1]?.content || ""

  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  let contextArticles: LegalArticle[] = []
  try {
    // Fetch relevant legal articles from Supabase based on the user's query
    // This is a simplified example. In a real RAG setup, you'd perform a vector similarity search.
    const { data, error } = await supabase
      .from("legal_articles")
      .select("id, title, content")
      .ilike("content", `%${lastUserMessage.split(" ").slice(0, 3).join(" ")}%`) // Simple keyword search for demonstration
      .limit(3)

    if (error) {
      console.error("Error fetching legal articles from Supabase:", error)
    } else {
      contextArticles = data || []
    }
  } catch (e) {
    console.error("Error in Supabase query:", e)
  }

  const context = contextArticles
    .map((article) => `Article Title: ${article.title}\nArticle Content: ${article.content}`)
    .join("\n\n")

  const systemPrompt = `أنت مستشار قانوني خبير في القانون السعودي. مهمتك هي تقديم استشارات قانونية دقيقة ومفيدة بناءً على المعلومات المتاحة.
  إذا كانت لديك معلومات سياقية ذات صلة، فاستخدمها لتعزيز إجابتك.
  المعلومات السياقية:
  ${context}`

  try {
    const result = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages,
    })

    return new NextResponse(result.toReadableStream())
  } catch (error) {
    console.error("Error generating text:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
