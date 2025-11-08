// scripts/seed.ts
// Chạy: npx tsx scripts/seed.ts

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import * as path from 'path'

// Load environment variables từ .env.local
config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Kiểm tra xem có load được env không
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Lỗi: Không tìm thấy environment variables!')
  console.error('Kiểm tra:')
  console.error('1. File .env.local có tồn tại ở root folder không?')
  console.error('2. File có chứa NEXT_PUBLIC_SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY không?')
  console.error('\nĐường dẫn hiện tại:', process.cwd())
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Có' : '❌ Không có')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✅ Có' : '❌ Không có')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedDatabase() {
  console.log('🌱 Bắt đầu import dữ liệu...\n')

   try {
    // 🧹 Xóa dữ liệu cũ (theo thứ tự tránh lỗi khóa ngoại)
    console.log('🧹 Đang xóa dữ liệu cũ...')

    const tables = [ 
      'EventParticipation', 
      'Notification', 
      'Event', 
      'Application', 
      'StudentSkill', 
      'JobSkill', 
      'JobPosting', 
      'EnterpriseUser', 
      'Student', 
      'User', 
      'Enterprise', 
      'Tag', 
      'Skill' 
    ]
    const tableKeys: Record<string, string> = {
      EventParticipation: 'id',
      Notification: 'id',
      Event: 'id',
      Application: 'id',
      StudentSkill: 'student_id',
      JobSkill: 'job_id',
      JobPosting: 'id',
      EnterpriseUser: 'enterprise_id',
      Student: 'user_id',
      User: 'id',
      Enterprise: 'id',
      Tag: 'id',
      Skill: 'id'
    }


    // Xóa toàn bộ dữ liệu trong các bảng
    for (const table of tables) {
      const key = tableKeys[table]
      const { error } = await supabase
        .from(table)
        .delete()
        .not(key, 'is', null) // luôn đúng, để tránh lỗi
      if (error) {
        console.error(`❌ Lỗi khi xóa bảng ${table}:`, error)
      } else {
        console.log(`✅ Đã xóa dữ liệu trong bảng ${table}`)
      }
    }

    console.log('🧹 Đã hoàn tất dọn dẹp dữ liệu!\n')
    // 1. Tạo Skills
    console.log('📝 Tạo Skills...')
    const skills = [
      { name: 'JavaScript' },
      { name: 'TypeScript' },
      { name: 'React' },
      { name: 'Node.js' },
      { name: 'Python' },
      { name: 'Java' },
      { name: 'SQL' },
      { name: 'Docker' },
      { name: 'AWS' },
      { name: 'Git' }
    ]
    
    const { data: skillsData, error: skillsError } = await supabase
      .from('Skill')
      .upsert(skills, { onConflict: 'name' })
      .select()
    
    if (skillsError) throw skillsError
    console.log(`✅ Đã tạo ${skillsData?.length} skills\n`)

    // 2. Tạo Tags
    console.log('🏷️  Tạo Tags...')
    const tags = [
      { name: 'Technology' },
      { name: 'Workshop' },
      { name: 'Career Fair' },
      { name: 'Networking' },
      { name: 'Training' }
    ]
    
    const { data: tagsData, error: tagsError } = await supabase
      .from('Tag')
      .upsert(tags, { onConflict: 'name' })
      .select()
    
    if (tagsError) throw tagsError
    console.log(`✅ Đã tạo ${tagsData?.length} tags\n`)

    // 3. Tạo Enterprises
    console.log('🏢 Tạo Enterprises...')
    const enterprises = [
      {
        name: 'FPT Software',
        description: 'Công ty phần mềm hàng đầu Việt Nam',
        industry: 'Technology',
        image_url: 'https://via.placeholder.com/200x200?text=FPT'
      },
      {
        name: 'Viettel Group',
        description: 'Tập đoàn viễn thông và công nghệ',
        industry: 'Telecommunications',
        image_url: 'https://via.placeholder.com/200x200?text=Viettel'
      },
      {
        name: 'VinGroup',
        description: 'Tập đoàn đa ngành',
        industry: 'Conglomerate',
        image_url: 'https://via.placeholder.com/200x200?text=VinGroup'
      },
      {
        name: 'Shopee Vietnam',
        description: 'Sàn thương mại điện tử',
        industry: 'E-commerce',
        image_url: 'https://via.placeholder.com/200x200?text=Shopee'
      },
      {
        name: 'Grab Vietnam',
        description: 'Nền tảng đặt xe và giao hàng',
        industry: 'Technology',
        image_url: 'https://via.placeholder.com/200x200?text=Grab'
      }
    ]
    
    const { data: enterprisesData, error: enterprisesError } = await supabase
      .from('Enterprise')
      .upsert(enterprises)
      .select()
    
    if (enterprisesError) throw enterprisesError
    console.log(`✅ Đã tạo ${enterprisesData?.length} enterprises\n`)

    // 4. Tạo Users (Students)
    console.log('Tạo Users...')
    const users = [
      {
        email: 'student1@example.com',
        provider_uid: 'student_001',
        role: 'STUDENT',
        is_active: true
      },
      {
        email: 'student2@example.com',
        provider_uid: 'student_002',
        role: 'STUDENT',
        is_active: true
      },
      {
        email: 'student3@example.com',
        provider_uid: 'student_003',
        role: 'STUDENT',
        is_active: true
      },
      {
        email: 'hr1@fpt.com',
        provider_uid: 'hr_001',
        role: 'ENTERPRISE',
        is_active: true
      },
      {
        email: 'admin@system.com',
        provider_uid: 'admin_001',
        role: 'ADMIN',
        is_active: true
      }
    ]
    
    const { data: usersData, error: usersError } = await supabase
      .from('User')
      .upsert(users)
      .select()
    
    if (usersError) throw usersError
    console.log(`Đã tạo ${usersData?.length} users\n`)

    // 5. Tạo Students
    console.log('🎓 Tạo Students...')
    const students = [
      {
        user_id: usersData[0].id,
        full_name: 'Nguyễn Văn A',
        major: 'Computer Science',
        graduation_year: 2025,
        enrollment_year: 2021
      },
      {
        user_id: usersData[1].id,
        full_name: 'Trần Thị B',
        major: 'Software Engineering',
        graduation_year: 2024,
        enrollment_year: 2020
      },
      {
        user_id: usersData[2].id,
        full_name: 'Lê Văn C',
        major: 'Information Technology',
        graduation_year: 2025,
        enrollment_year: 2021
      }
    ]
    
    const { data: studentsData, error: studentsError } = await supabase
      .from('Student')
      .upsert(students)
      .select()
    
    if (studentsError) throw studentsError
    console.log(`✅ Đã tạo ${studentsData?.length} students\n`)

    // 6. Tạo Enterprise Users
    console.log('💼 Tạo Enterprise Users...')
    const enterpriseUsers = [
      {
        user_id: usersData[3].id,
        enterprise_id: enterprisesData[0].id,
        full_name: 'Phạm Thị D',
        position: 'HR Manager'
      }
    ]
    
    const { data: enterpriseUsersData, error: enterpriseUsersError } = await supabase
      .from('EnterpriseUser')
      .upsert(enterpriseUsers)
      .select()
    
    if (enterpriseUsersError) throw enterpriseUsersError
    console.log(`✅ Đã tạo ${enterpriseUsersData?.length} enterprise users\n`)

    // 7. Tạo Job Postings
    console.log('💼 Tạo Job Postings...')
    const jobs = [
      {
        enterprise_id: enterprisesData[0].id,
        title: 'Frontend Developer Intern',
        description: 'Tìm kiếm thực tập sinh Frontend Developer có kinh nghiệm với React',
        location: 'Hà Nội',
        internship_period: '3 tháng',
        require_gpa_min: 3.0,
        is_open: true,
        application_deadline: '2025-12-31'
      },
      {
        enterprise_id: enterprisesData[0].id,
        title: 'Backend Developer Intern',
        description: 'Thực tập sinh Backend Developer làm việc với Node.js',
        location: 'TP. Hồ Chí Minh',
        internship_period: '6 tháng',
        require_gpa_min: 2.8,
        is_open: true,
        application_deadline: '2025-11-30'
      },
      {
        enterprise_id: enterprisesData[1].id,
        title: 'Data Analyst Intern',
        description: 'Phân tích dữ liệu và tạo báo cáo',
        location: 'Hà Nội',
        internship_period: '4 tháng',
        require_gpa_min: 3.2,
        is_open: true,
        application_deadline: '2025-12-15'
      },
      {
        enterprise_id: enterprisesData[2].id,
        title: 'Mobile Developer Intern',
        description: 'Phát triển ứng dụng mobile với React Native',
        location: 'Remote',
        internship_period: '3 tháng',
        require_gpa_min: 3.0,
        is_open: true,
        application_deadline: '2025-12-20'
      },
      {
        enterprise_id: enterprisesData[3].id,
        title: 'DevOps Intern',
        description: 'Hỗ trợ quản lý infrastructure và CI/CD',
        location: 'TP. Hồ Chí Minh',
        internship_period: '6 tháng',
        require_gpa_min: 2.5,
        is_open: false,
        application_deadline: '2025-10-31'
      }
    ]
    
    const { data: jobsData, error: jobsError } = await supabase
      .from('JobPosting')
      .upsert(jobs)
      .select()
    
    if (jobsError) throw jobsError
    console.log(`✅ Đã tạo ${jobsData?.length} job postings\n`)

    // 8. Tạo Job Skills
    console.log('🔧 Tạo Job Skills...')
    const jobSkills = [
      { job_id: jobsData[0].id, skill_id: skillsData[2].id, required_level: 4 }, // React
      { job_id: jobsData[0].id, skill_id: skillsData[1].id, required_level: 3 }, // TypeScript
      { job_id: jobsData[1].id, skill_id: skillsData[3].id, required_level: 4 }, // Node.js
      { job_id: jobsData[1].id, skill_id: skillsData[6].id, required_level: 3 }, // SQL
      { job_id: jobsData[2].id, skill_id: skillsData[4].id, required_level: 3 }, // Python
      { job_id: jobsData[2].id, skill_id: skillsData[6].id, required_level: 4 }  // SQL
    ]
    
    const { data: jobSkillsData, error: jobSkillsError } = await supabase
      .from('JobSkill')
      .upsert(jobSkills)
      .select()
    
    if (jobSkillsError) throw jobSkillsError
    console.log(`✅ Đã tạo ${jobSkillsData?.length} job skills\n`)

    // 9. Tạo Student Skills
    console.log('📚 Tạo Student Skills...')
    const studentSkills = [
      { student_id: studentsData[0].user_id, skill_id: skillsData[0].id, level: 4 },
      { student_id: studentsData[0].user_id, skill_id: skillsData[2].id, level: 5 },
      { student_id: studentsData[1].user_id, skill_id: skillsData[3].id, level: 4 },
      { student_id: studentsData[1].user_id, skill_id: skillsData[6].id, level: 3 },
      { student_id: studentsData[2].user_id, skill_id: skillsData[4].id, level: 3 }
    ]
    
    const { data: studentSkillsData, error: studentSkillsError } = await supabase
      .from('StudentSkill')
      .upsert(studentSkills)
      .select()
    
    if (studentSkillsError) throw studentSkillsError
    console.log(`✅ Đã tạo ${studentSkillsData?.length} student skills\n`)

    // 10. Tạo Applications
    console.log('📄 Tạo Applications...')
    const applications = [
      {
        job_id: jobsData[0].id,
        student_id: studentsData[0].user_id,
        status: 'PENDING',
        note: 'Rất quan tâm đến vị trí này'
      },
      {
        job_id: jobsData[1].id,
        student_id: studentsData[1].user_id,
        status: 'ACCEPTED',
        note: 'Có kinh nghiệm làm việc với Node.js'
      },
      {
        job_id: jobsData[0].id,
        student_id: studentsData[2].user_id,
        status: 'REJECTED',
        note: 'Chưa đủ kinh nghiệm'
      }
    ]
    
    const { data: applicationsData, error: applicationsError } = await supabase
      .from('Application')
      .upsert(applications)
      .select()
    
    if (applicationsError) throw applicationsError
    console.log(`✅ Đã tạo ${applicationsData?.length} applications\n`)

    // 11. Tạo Events
    console.log('📅 Tạo Events...')
    const events = [
      {
        creator_id: usersData[4].id,
        title: 'Tech Career Fair 2025',
        description: 'Ngày hội việc làm cho sinh viên IT',
        start_date: '2025-12-15T09:00:00Z',
        end_date: '2025-12-15T17:00:00Z',
        event_type: 'CAREER_DAY',
        status: 'PUBLISHED',
        max_participants: 500,
        location: 'Trung tâm Hội nghị Quốc gia'
      },
      {
        creator_id: usersData[4].id,
        title: 'React Workshop',
        description: 'Workshop về React và Next.js',
        start_date: '2025-11-20T14:00:00Z',
        end_date: '2025-11-20T17:00:00Z',
        event_type: 'WORKSHOP',
        status: 'PUBLISHED',
        max_participants: 50,
        location: 'Online - Zoom'
      },
      {
        creator_id: usersData[3].id,
        title: 'FPT Open Day',
        description: 'Tham quan và tìm hiểu về FPT Software',
        start_date: '2025-12-01T09:00:00Z',
        end_date: '2025-12-01T12:00:00Z',
        event_type: 'SEMINAR',
        status: 'DRAFT',
        max_participants: 30,
        location: 'FPT Cầu Giấy'
      }
    ]
    
    const { data: eventsData, error: eventsError } = await supabase
      .from('Event')
      .upsert(events)
      .select()
    
    if (eventsError) throw eventsError
    console.log(`✅ Đã tạo ${eventsData?.length} events\n`)

    // 12. Tạo Event Participations
    console.log('🎫 Tạo Event Participations...')
    const participations = [
      {
        event_id: eventsData[0].id,
        user_id: studentsData[0].user_id,
        status: 'CONFIRMED',
        attendance: null
      },
      {
        event_id: eventsData[0].id,
        user_id: studentsData[1].user_id,
        status: 'CONFIRMED',
        attendance: null
      },
      {
        event_id: eventsData[1].id,
        user_id: studentsData[2].user_id,
        status: 'PENDING',
        attendance: null
      }
    ]
    
    const { data: participationsData, error: participationsError } = await supabase
      .from('EventParticipation')
      .upsert(participations)
      .select()
    
    if (participationsError) throw participationsError
    console.log(`✅ Đã tạo ${participationsData?.length} event participations\n`)

    // 13. Tạo Notifications
    console.log('🔔 Tạo Notifications...')
    const notifications = [
      {
        title: 'Chào mừng bạn đến với hệ thống',
        content: 'Cảm ơn bạn đã đăng ký tài khoản',
        notification_type: 'SYSTEM'
      },
      {
        title: 'Đơn ứng tuyển đã được duyệt',
        content: 'Đơn ứng tuyển của bạn cho vị trí Backend Developer đã được chấp nhận',
        notification_type: 'APPLICATION'
      },
      {
        title: 'Sự kiện mới: Tech Career Fair 2025',
        content: 'Đăng ký tham gia ngày hội việc làm IT lớn nhất năm',
        notification_type: 'EVENT'
      }
    ]
    
    const { data: notificationsData, error: notificationsError } = await supabase
      .from('Notification')
      .upsert(notifications)
      .select()
    
    if (notificationsError) throw notificationsError
    console.log(`✅ Đã tạo ${notificationsData?.length} notifications\n`)

    console.log('✨ Hoàn thành import dữ liệu!\n')
    console.log('📊 Tổng kết:')
    console.log(`   - ${skillsData?.length} Skills`)
    console.log(`   - ${tagsData?.length} Tags`)
    console.log(`   - ${enterprisesData?.length} Enterprises`)
    console.log(`   - ${usersData?.length} Users`)
    console.log(`   - ${studentsData?.length} Students`)
    console.log(`   - ${jobsData?.length} Job Postings`)
    console.log(`   - ${applicationsData?.length} Applications`)
    console.log(`   - ${eventsData?.length} Events`)
    console.log(`   - ${notificationsData?.length} Notifications`)

  } catch (error) {
    console.error('❌ Lỗi:', error)
    process.exit(1)
  }
}

seedDatabase()