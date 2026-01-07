export interface Location {
  id: string;
  name: string;
  code?: string;
}

export interface JobCategory {
  id: string;
  name: string;
  code?: string;
}

export interface PostJobFormData {
  title: string;
  description: string;
  category_id: string | null;
  job_type: string | null;
  work_mode: string | null;
  location_id: string | null;
  internship_period: string | null;
  require_gpa_min: number | null;
  application_deadline: string | null;
  
}

export interface MessageState {
  type: "success" | "error";
  text: string;
}