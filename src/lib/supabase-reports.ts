import { getCurrentSession, getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";

export interface ResearchReportRecord {
  id?: string;
  title: string;
  source_type: string;
  source_label: string;
  summary: string;
  content: string;
  pipeline_output: Record<string, unknown>;
  confidence: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UploadedFileRecord {
  id?: string;
  report_id?: string;
  filename: string;
  file_type: string;
  storage_path?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface AnalysisHistoryRecord {
  id?: string;
  report_id?: string;
  action: string;
  details?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserRecord {
  id?: string;
  email: string;
  display_name?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface SupabaseServiceResult<T> {
  data: T | null;
  error: string | null;
}

function getClient() {
  return getSupabaseBrowserClient();
}

async function insertRecord<T>(table: string, payload: Record<string, unknown>): Promise<SupabaseServiceResult<T>> {
  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  const client = getClient();
  if (!client) {
    return {
      data: null,
      error: "Supabase client is unavailable.",
    };
  }

  try {
    const { data, error } = await client.from(table).insert(payload as never).select().single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as T, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to save data.",
    };
  }
}

async function getCurrentUserId(): Promise<string | null> {
  const { data } = await getCurrentSession();
  return data.session?.user?.id ?? null;
}

async function listRecords<T>(table: string, userId?: string | null): Promise<SupabaseServiceResult<T[]>> {
  if (!isSupabaseConfigured()) {
    return {
      data: [],
      error: "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  const client = getClient();
  if (!client) {
    return {
      data: [],
      error: "Supabase client is unavailable.",
    };
  }

  try {
    let query = client.from(table).select("*");

    if (userId && table === "research_reports") {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: (data as T[]) ?? [], error: null };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : "Failed to load data.",
    };
  }
}

async function deleteRecord(table: string, id: string): Promise<SupabaseServiceResult<null>> {
  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  const client = getClient();
  if (!client) {
    return {
      data: null,
      error: "Supabase client is unavailable.",
    };
  }

  try {
    const { error } = await client.from(table).delete().eq("id", id);

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: null, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to delete data.",
    };
  }
}

export async function saveResearchReport(report: ResearchReportRecord): Promise<SupabaseServiceResult<ResearchReportRecord>> {
  const userId = await getCurrentUserId();
  const payload = { ...report, user_id: userId ?? undefined };
  return insertRecord<ResearchReportRecord>("research_reports", payload as unknown as Record<string, unknown>);
}

export async function getResearchReports(): Promise<SupabaseServiceResult<ResearchReportRecord[]>> {
  const userId = await getCurrentUserId();
  return listRecords<ResearchReportRecord>("research_reports", userId);
}

export async function deleteResearchReport(id: string): Promise<SupabaseServiceResult<null>> {
  return deleteRecord("research_reports", id);
}

export async function saveUploadedFile(file: UploadedFileRecord): Promise<SupabaseServiceResult<UploadedFileRecord>> {
  return insertRecord<UploadedFileRecord>("uploaded_files", file as unknown as Record<string, unknown>);
}

export async function getUploadedFiles(): Promise<SupabaseServiceResult<UploadedFileRecord[]>> {
  return listRecords<UploadedFileRecord>("uploaded_files");
}

export async function deleteUploadedFile(id: string): Promise<SupabaseServiceResult<null>> {
  return deleteRecord("uploaded_files", id);
}

export async function saveAnalysisHistory(entry: AnalysisHistoryRecord): Promise<SupabaseServiceResult<AnalysisHistoryRecord>> {
  return insertRecord<AnalysisHistoryRecord>("analysis_history", entry as unknown as Record<string, unknown>);
}

export async function getAnalysisHistory(): Promise<SupabaseServiceResult<AnalysisHistoryRecord[]>> {
  return listRecords<AnalysisHistoryRecord>("analysis_history");
}

export async function deleteAnalysisHistory(id: string): Promise<SupabaseServiceResult<null>> {
  return deleteRecord("analysis_history", id);
}

export async function saveUser(user: UserRecord): Promise<SupabaseServiceResult<UserRecord>> {
  return insertRecord<UserRecord>("users", user as unknown as Record<string, unknown>);
}

export async function getUsers(): Promise<SupabaseServiceResult<UserRecord[]>> {
  return listRecords<UserRecord>("users");
}

export async function deleteUser(id: string): Promise<SupabaseServiceResult<null>> {
  return deleteRecord("users", id);
}
