export interface StudentProfile {
  user_id: string
  email: string
  avatar_url?: string
  full_name?: string
  major?: string
  gpa?: number
  summary?: string
  phone?: string
  location?: string
  portfolio_url?: string
  socials?: Record<string, string>
  languages?: string[]
  cv_url?: string
  enrollment_year?: number
  graduation_year?: number
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  level: string
}

export interface Stats {
  applications: number
  pending: number
  accepted: number
  rejected: number
}

export interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  created_at: string;
}

export interface ProfileData {
  profile: StudentProfile
  skills: Skill[]
  stats: Stats,
  savedJobs?: SavedJob[];
}
