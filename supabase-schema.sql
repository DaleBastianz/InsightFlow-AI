create table if not exists public.research_reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_type text not null default 'text',
  source_label text not null default '',
  summary text not null default '',
  content text not null default '',
  pipeline_output jsonb not null default '{}'::jsonb,
  confidence double precision not null default 0,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.uploaded_files (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references public.research_reports(id) on delete cascade,
  filename text not null,
  file_type text not null default '',
  storage_path text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analysis_history (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references public.research_reports(id) on delete cascade,
  action text not null,
  details text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  display_name text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists research_reports_created_at_idx on public.research_reports(created_at desc);
create index if not exists uploaded_files_report_id_idx on public.uploaded_files(report_id);
create index if not exists analysis_history_report_id_idx on public.analysis_history(report_id);
