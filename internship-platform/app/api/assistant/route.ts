import { NextResponse } from 'next/server'

type Body = { question: string; lang?: string }

// Mini KB tĩnh (có thể tách ra JSON hoặc DB sau)
const FAQ_VI: Array<{ k: RegExp; a: string; src?: string[] }> = [
  {
    k: /(điều kiện|điều kiện đăng ký|gpa|điểm trung bình)/i,
    a: 'Điều kiện chung: là SV năm 3 trở lên (hoặc đủ tín chỉ theo quy định Khoa), không bị cảnh cáo học vụ; một số doanh nghiệp yêu cầu GPA từ 2.5–3.0 trở lên. Hãy xem kỹ yêu cầu tại từng tin tuyển.',
    src: ['policy:internship.general']
  },
  {
    k: /(thời gian|kỳ thực tập|bao lâu|tuần)/i,
    a: 'Thời lượng thực tập thường 8–12 tuần tuỳ doanh nghiệp và đợt của Khoa. Lịch cụ thể xem tại thông báo học kỳ hiện hành.',
    src: ['policy:internship.timeline']
  },
  {
    k: /(hồ sơ|cv|đơn ứng tuyển|apply)/i,
    a: 'Hồ sơ cơ bản gồm: CV (PDF), bảng điểm tạm thời, thư giới thiệu (nếu có). Trên hệ thống, bạn có thể nộp trực tiếp qua nút "Apply".',
    src: ['guide:application.checklist']
  },
  {
    k: /(xác nhận|biên bản|đánh giá cuối kỳ|mẫu)/i,
    a: 'Biên bản đánh giá và mẫu xác nhận có trên mục Tài liệu. Doanh nghiệp sẽ điền và gửi lại để Khoa tổng hợp điểm.',
    src: ['docs:forms.catalog']
  }
]

const FAQ_EN: Array<{ k: RegExp; a: string; src?: string[] }> = [
  {
    k: /(requirement|gpa)/i,
    a: 'General requirements: junior or above (or enough credits), good academic standing. Some companies require GPA ≥ 2.5–3.0. Check each job post for details.',
    src: ['policy:internship.general']
  },
  {
    k: /(duration|weeks|period)/i,
    a: 'Typical duration is 8–12 weeks depending on company and semester schedule.',
    src: ['policy:internship.timeline']
  }
]

// Fallback câu trả lời
function fallback(lang: string) {
  return lang.startsWith('en')
    ? {
        answer:
          'I could not find a direct answer. Please check the Internship Handbook or ask the faculty office.',
        sources: ['help:contact.faculty']
      }
    : {
        answer:
          'Mình chưa tìm được câu trả lời chính xác. Bạn hãy xem “Sổ tay thực tập” hoặc liên hệ văn phòng Khoa.',
        sources: ['help:contact.faculty']
      }
}

export async function POST(req: Request) {
  try {
    const { question, lang = 'vi' } = (await req.json()) as Body
    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'question required' }, { status: 400 })
    }

    const bank = lang.toLowerCase().startsWith('en') ? FAQ_EN : FAQ_VI
    const found = bank.find(item => item.k.test(question))

    if (!found) {
      return NextResponse.json(fallback(lang))
    }

    return NextResponse.json({
      answer: found.a,
      sources: found.src ?? []
    })
  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
