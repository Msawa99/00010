import { type NextRequest, NextResponse } from "next/server"

// مفتاح OpenRouter مع OpenAI
const OPENROUTER_API_KEY = "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"
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

// قاعدة بيانات المواد القانونية المحسنة
const legalDatabase = {
  labor: {
    "ساعات العمل": {
      article: "المادة 97",
      content: "لا يجوز تشغيل العامل أكثر من ثماني ساعات في اليوم الواحد أو ثمان وأربعين ساعة في الأسبوع",
      relatedArticles: ["المادة 98", "المادة 99"],
    },
    الراحة: {
      article: "المادة 98",
      content: "يجب إعطاء العامل فترة راحة لا تقل عن نصف ساعة خلال فترة العمل إذا زادت عن خمس ساعات متتالية",
      relatedArticles: ["المادة 97", "المادة 100"],
    },
    "العمل الإضافي": {
      article: "المادة 99",
      content:
        "إذا اقتضت ظروف العمل تشغيل العامل ساعات إضافية، وجب ألا تزيد على ثلاث ساعات في اليوم، وأن يؤدى له أجر إضافي قدره 150% من أجره الأساسي",
      relatedArticles: ["المادة 97", "المادة 98"],
    },
    الإجازات: {
      article: "المادة 109",
      content: "للعامل الحق في إجازة سنوية مدفوعة الأجر لا تقل عن 21 يوماً إذا أمضى في الخدمة سنة كاملة",
      relatedArticles: ["المادة 110", "المادة 111"],
    },
  },
  health: {
    "حقوق المريض": {
      article: "المادة 5",
      content: "للمريض الحق في الحصول على الرعاية الصحية المناسبة والعلاج اللازم",
      relatedArticles: ["المادة 6", "المادة 7"],
    },
    "التأمين الصحي": {
      article: "المادة 12",
      content: "يحق للمؤمن عليه الحصول على الخدمات الصحية المشمولة بالتأمين دون تحمل أي رسوم إضافية",
      relatedArticles: ["المادة 13", "المادة 14"],
    },
  },
  traffic: {
    "رخصة القيادة": {
      article: "المادة 15",
      content: "يشترط للحصول على رخصة قيادة المركبات أن يكون طالب الرخصة قد أتم الثامنة عشرة من عمره",
      relatedArticles: ["المادة 16", "المادة 17"],
    },
  },
}

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

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || message.trim().length === 0) {
      return NextResponse.json({
        response: "يرجى كتابة سؤالك للحصول على المساعدة.",
        articles: [],
        links: [],
      })
    }

    // تحليل السؤال لتحديد القطاع والموضوع
    const analysis = analyzeQuestion(message)

    // إنشاء الرد باستخدام OpenRouter + OpenAI
    const aiResponse = await generateOpenAIResponse(message, analysis)

    const response = {
      response: aiResponse,
      articles: analysis.articles,
      links: analysis.links,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in chat API:", error)

    // في حالة الخطأ، استخدم رد محلي
    try {
      const { message } = await request.json()
      const analysis = analyzeQuestion(message)
      const localResponse = getDetailedLocalResponse(message, analysis)

      return NextResponse.json({
        response: localResponse,
        articles: analysis.articles,
        links: analysis.links,
      })
    } catch {
      return NextResponse.json({
        response: "عذراً، حدث خطأ في النظام. يرجى المحاولة مرة أخرى.",
        articles: [],
        links: [],
      })
    }
  }
}

function analyzeQuestion(question: string) {
  const lowerQuestion = question.toLowerCase()
  let sector = "general"
  let articles: string[] = []
  let links: { title: string; url: string }[] = []

  // تحليل قطاع العمل
  if (
    lowerQuestion.includes("عمل") ||
    lowerQuestion.includes("موظف") ||
    lowerQuestion.includes("راتب") ||
    lowerQuestion.includes("ساعة") ||
    lowerQuestion.includes("دوام") ||
    lowerQuestion.includes("إجازة") ||
    lowerQuestion.includes("اجازة")
  ) {
    sector = "labor"

    if (lowerQuestion.includes("ساعة") || lowerQuestion.includes("دوام")) {
      articles.push("المادة 97", "المادة 98")
    }
    if (lowerQuestion.includes("إضافي") || lowerQuestion.includes("اضافي")) {
      articles.push("المادة 99")
    }
    if (lowerQuestion.includes("إجازة") || lowerQuestion.includes("اجازة")) {
      articles.push("المادة 109")
    }

    links = officialLinks.labor || []
  }

  // تحليل القطاع الصحي
  else if (
    lowerQuestion.includes("صحة") ||
    lowerQuestion.includes("مريض") ||
    lowerQuestion.includes("مستشفى") ||
    lowerQuestion.includes("طبيب") ||
    lowerQuestion.includes("علاج")
  ) {
    sector = "health"
    articles = ["المادة 5", "المادة 6"]

    if (lowerQuestion.includes("تأمين")) {
      articles.push("المادة 12")
    }

    links = officialLinks.health || []
  }

  // تحليل قطاع المرور
  else if (
    lowerQuestion.includes("مرور") ||
    lowerQuestion.includes("قيادة") ||
    lowerQuestion.includes("مخالفة") ||
    lowerQuestion.includes("رخصة") ||
    lowerQuestion.includes("سيارة")
  ) {
    sector = "traffic"
    articles = ["المادة 15"]
    links = officialLinks.traffic || []
  }

  // تحليل الأحوال المدنية
  else if (
    lowerQuestion.includes("هوية") ||
    lowerQuestion.includes("جواز") ||
    lowerQuestion.includes("ميلاد") ||
    lowerQuestion.includes("زواج") ||
    lowerQuestion.includes("طلاق")
  ) {
    sector = "civil"
    links = officialLinks.civil || []
  }

  // تحليل حماية المستهلك
  else if (
    lowerQuestion.includes("مستهلك") ||
    lowerQuestion.includes("شراء") ||
    lowerQuestion.includes("ضمان") ||
    lowerQuestion.includes("متجر") ||
    lowerQuestion.includes("منتج")
  ) {
    sector = "consumer"
    links = officialLinks.consumer || []
  }

  return { sector, articles: [...new Set(articles)], links }
}

// أضف هذه الدالة الجديدة بعد دالة analyzeQuestion

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

// عدّل دالة generateOpenAIResponse لتشمل الروابط الرسمية

async function generateOpenAIResponse(question: string, analysis: any) {
  const officialLinks = getOfficialComplaintLinks(analysis.sector)

  const systemPrompt = `أنت مستشار قانوني رسمي متخصص في الأنظمة والقوانين السعودية واسمك "مستشار اعرف حقوقك". أنت تقدم استشارات قانونية رسمية وموثقة.

## مهمتك الأساسية:
تقديم استشارات قانونية رسمية ودقيقة للمواطنين والمقيمين مع الاستشهاد بالمواد النظامية والإرشاد للجهات الرسمية المختصة.

## قواعد الاستشارة الرسمية:
1. **الطابع الرسمي**: استخدم لغة قانونية رسمية ودقيقة
2. **الاستشهاد الدقيق**: اذكر رقم المادة والنظام المرجعي بدقة
3. **التوثيق**: قدم مراجع قانونية موثقة
4. **الإرشاد الرسمي**: وجه السائل للجهات الرسمية المختصة
5. **الشمولية**: قدم استشارة شاملة تغطي جميع جوانب المسألة
6. **التحذيرات القانونية**: اذكر العواقب القانونية والمهل الزمنية

## المراجع القانونية الأساسية:

### النظام الأساسي للحكم:
- المادة 26: الدولة تحمي حقوق الإنسان وفق الشريعة الإسلامية
- المادة 36: توفر الدولة الأمن لجميع مواطنيها والمقيمين
- المادة 46: القضاء سلطة مستقلة ولا سلطان عليه لغير أحكام الشريعة

### نظام العمل:
- المادة 97: ساعات العمل اليومية والأسبوعية
- المادة 98: فترات الراحة الإجبارية
- المادة 99: العمل الإضافي والأجور
- المادة 74: حق العامل في الراتب
- المادة 80: حماية العامل من الفصل التعسفي

## تنسيق الاستشارة الرسمية:
1. **عنوان الاستشارة**: حدد موضوع الاستشارة
2. **التكييف القانوني**: حدد النظام المطبق
3. **المواد النظامية**: اذكر المواد ذات العلاقة
4. **التحليل القانوني**: اشرح الوضع القانوني
5. **الحقوق والواجبات**: حدد حقوق وواجبات كل طرف
6. **الإجراءات المطلوبة**: حدد الخطوات العملية
7. **الجهات المختصة**: اذكر الجهات الرسمية للشكوى
8. **المهل الزمنية**: اذكر المهل القانونية المهمة
9. **التوصيات**: قدم توصيات عملية

## الجهات الرسمية المتاحة للشكوى:
${officialLinks.map((link) => `- ${link.title}: ${link.url} | هاتف: ${link.phone}`).join("\n")}

## مثال على الاستشارة الرسمية:
"📋 **استشارة قانونية رسمية**
**الموضوع:** مخالفة ساعات العمل
**التكييف القانوني:** وفقاً لنظام العمل السعودي
**المواد النظامية:** المادة 97، 98، 99
**التحليل القانوني:** [تحليل مفصل]
**الحقوق:** [حقوق العامل]
**الإجراءات:** [خطوات الشكوى]
**الجهات المختصة:** [قائمة الجهات]"

السؤال: ${question}`

  // باقي الكود يبقى كما هو...
  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://knowyourrights.sa",
        "X-Title": "Know Your Rights - AI Legal Assistant",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: question,
          },
        ],
        temperature: 0.2, // خفضت أكثر للحصول على إجابات أكثر رسمية ودقة
        max_tokens: 1500, // زدت للحصول على استشارات أكثر تفصيلاً
        top_p: 0.8,
        frequency_penalty: 0.3,
        presence_penalty: 0.1,
      }),
    })

    if (!response.ok) {
      console.error("OpenRouter API Error:", response.status, response.statusText)
      const errorText = await response.text()
      console.error("Error details:", errorText)
      return getDetailedLocalResponse(question, analysis)
    }

    const data = await response.json()

    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content
    } else {
      console.error("Unexpected API response structure:", data)
      return getDetailedLocalResponse(question, analysis)
    }
  } catch (error) {
    console.error("OpenRouter API Error:", error)
    return getDetailedLocalResponse(question, analysis)
  }
}

function getDetailedLocalResponse(question: string, analysis: any) {
  const lowerQuestion = question.toLowerCase()

  // أسئلة العمل - ساعات العمل
  if (lowerQuestion.includes("ساعة") || lowerQuestion.includes("دوام")) {
    if (lowerQuestion.includes("12") || lowerQuestion.includes("١٢")) {
      return `⚠️ **تنبيه مهم: العمل 12 ساعة يومياً مخالف للنظام!**

📋 **المادة 97 من نظام العمل السعودي:**
• الحد الأقصى للعمل: **8 ساعات يومياً** أو **48 ساعة أسبوعياً**
• يمكن زيادة العمل إلى 9 ساعات في بعض الحالات الاستثنائية فقط

📋 **المادة 98 - فترات الراحة الإجبارية:**
• يجب إعطاء راحة **نصف ساعة** كل **5 ساعات** عمل متتالية
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
• راحة **نصف ساعة** كل **5 ساعات** عمل متتالية
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

  // أسئلة الإجازات
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

  // أسئلة الصحة
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

  // أسئلة المرور
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

  // رد عام للأسئلة غير المحددة
  return `مرحباً بك في "اعرف حقوقك" 👋

🤖 **أنا هنا لتقديم الاستشارات القانونية ومساعدتك في فهم حقوقك وواجباتك وفقاً للأنظمة السعودية**

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
