export interface Category {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  name: string;
}

export interface JobFromAPI {
  id: string;
  title: string;
  status: "APPROVED" | "REJECTED" | "PENDING" | "CLOSED";
  created_at: string;
  is_open: boolean;
  category: Category | null;
  location: Location | null;
  job_type?: string;
  work_mode?: string;
}

export type JobDisplay = JobFromAPI;