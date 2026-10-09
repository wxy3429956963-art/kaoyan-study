-- Run once in a NEW Supabase project's SQL Editor.
create table public.study_settings (
 user_id uuid primary key references auth.users(id) on delete cascade,
 start_date date not null,
 exam_date date not null,
 daily_goal integer not null check (daily_goal between 15 and 1440),
 check (exam_date > start_date)
);
create table public.study_tasks (
 user_id uuid not null references auth.users(id) on delete cascade,
 id text not null check (length(id) between 1 and 100),
 date date not null,
 subject text not null check (subject in ('math','english','cs','politics')),
 title text not null check (length(trim(title)) between 1 and 200),
 planned integer not null check (planned between 5 and 1440),
 done boolean not null default false,
 primary key (user_id,id)
);
create index study_tasks_user_date_idx on public.study_tasks(user_id,date);
create table public.study_sessions (
 user_id uuid not null references auth.users(id) on delete cascade,
 id text not null check (length(id) between 1 and 100),
 date date not null,
 subject text not null check (subject in ('math','english','cs','politics')),
 minutes integer not null check (minutes between 1 and 1440),
 primary key (user_id,id)
);
create index study_sessions_user_date_idx on public.study_sessions(user_id,date);
alter table public.study_settings enable row level security;
alter table public.study_tasks enable row level security;
alter table public.study_sessions enable row level security;
create policy settings_own on public.study_settings for all to authenticated
 using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy tasks_own on public.study_tasks for all to authenticated
 using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy sessions_own on public.study_sessions for all to authenticated
 using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
revoke all on public.study_settings,public.study_tasks,public.study_sessions from anon;
grant select,insert,update,delete on public.study_settings,public.study_tasks,public.study_sessions to authenticated;
alter publication supabase_realtime add table public.study_settings;
alter publication supabase_realtime add table public.study_tasks;
alter publication supabase_realtime add table public.study_sessions;
