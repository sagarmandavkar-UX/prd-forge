create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  avatar_url text,
  role text not null default 'Product manager',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text not null default '',
  product_type text not null default '',
  industry text not null default '',
  platform text not null default '',
  stage text not null default '',
  status text not null default 'draft' check (status in ('draft', 'active', 'completed', 'archived')),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_inputs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  input_key text not null,
  value_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, input_key)
);

create table if not exists public.discovery_questions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  category text not null,
  question text not null,
  rationale text not null,
  suggested_answers jsonb not null default '[]'::jsonb,
  answer text not null default '',
  skipped boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.prds (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  status text not null default 'draft',
  overall_score integer not null default 0 check (overall_score between 0 and 100),
  ai_provider text not null default 'mock',
  ai_model text not null default 'deterministic-demo',
  schema_version text not null default '1.0.0',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.prd_sections (
  id uuid primary key default gen_random_uuid(),
  prd_id uuid not null references public.prds(id) on delete cascade,
  section_key text not null,
  title text not null,
  content_json jsonb not null default '{}'::jsonb,
  content_text text not null default '',
  position integer not null default 0,
  is_visible boolean not null default true,
  score integer not null default 0 check (score between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (prd_id, section_key)
);

create table if not exists public.requirements (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  prd_id uuid references public.prds(id) on delete cascade,
  requirement_code text not null,
  requirement_type text not null check (requirement_type in ('functional', 'non-functional')),
  category text not null default '',
  title text not null,
  description text not null default '',
  rationale text not null default '',
  priority text not null default 'Should have',
  status text not null default 'Draft',
  measurement text,
  validation_method text,
  acceptance_criteria_json jsonb not null default '[]'::jsonb,
  dependencies_json jsonb not null default '[]'::jsonb,
  related_goal text not null default '',
  related_persona text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, requirement_code)
);

create table if not exists public.user_stories (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  prd_id uuid references public.prds(id) on delete cascade,
  story_code text not null,
  persona text not null default '',
  story text not null,
  user_value text not null default '',
  priority text not null default 'Should have',
  status text not null default 'Draft',
  acceptance_criteria_json jsonb not null default '[]'::jsonb,
  related_requirement_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, story_code)
);

create table if not exists public.quality_reviews (
  id uuid primary key default gen_random_uuid(),
  prd_id uuid not null references public.prds(id) on delete cascade,
  overall_score integer not null check (overall_score between 0 and 100),
  category_scores_json jsonb not null default '{}'::jsonb,
  issues_json jsonb not null default '[]'::jsonb,
  recommendations_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.prd_versions (
  id uuid primary key default gen_random_uuid(),
  prd_id uuid not null references public.prds(id) on delete cascade,
  version_number integer not null,
  version_name text not null,
  snapshot_json jsonb not null,
  change_note text not null default '',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (prd_id, version_number)
);

create table if not exists public.share_links (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  token_hash text not null unique,
  is_active boolean not null default true,
  expires_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  generation_type text not null,
  provider text not null,
  model text not null,
  input_hash text not null,
  status text not null,
  latency_ms integer,
  error_message text,
  created_at timestamptz not null default now()
);

create index if not exists projects_owner_updated_idx on public.projects(owner_id, updated_at desc);
create index if not exists prds_project_idx on public.prds(project_id);
create index if not exists prd_sections_prd_position_idx on public.prd_sections(prd_id, position);
create index if not exists requirements_project_idx on public.requirements(project_id, requirement_type, priority, status);
create index if not exists user_stories_project_idx on public.user_stories(project_id);
create index if not exists share_links_project_idx on public.share_links(project_id) where is_active;
create index if not exists ai_generations_project_idx on public.ai_generations(project_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_inputs enable row level security;
alter table public.discovery_questions enable row level security;
alter table public.prds enable row level security;
alter table public.prd_sections enable row level security;
alter table public.requirements enable row level security;
alter table public.user_stories enable row level security;
alter table public.quality_reviews enable row level security;
alter table public.prd_versions enable row level security;
alter table public.share_links enable row level security;
alter table public.ai_generations enable row level security;

create policy "profiles are self-owned" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "projects are owner-owned" on public.projects
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "project children are owner-owned inputs" on public.project_inputs
  for all using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()))
  with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

create policy "project children are owner-owned questions" on public.discovery_questions
  for all using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()))
  with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

create policy "prds are owner-owned" on public.prds
  for all using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()))
  with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

create policy "prd sections are owner-owned" on public.prd_sections
  for all using (exists (
    select 1 from public.prds d join public.projects p on p.id = d.project_id
    where d.id = prd_id and p.owner_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.prds d join public.projects p on p.id = d.project_id
    where d.id = prd_id and p.owner_id = auth.uid()
  ));

create policy "requirements are owner-owned" on public.requirements
  for all using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()))
  with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

create policy "user stories are owner-owned" on public.user_stories
  for all using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()))
  with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

create policy "quality reviews are owner-owned" on public.quality_reviews
  for all using (exists (
    select 1 from public.prds d join public.projects p on p.id = d.project_id
    where d.id = prd_id and p.owner_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.prds d join public.projects p on p.id = d.project_id
    where d.id = prd_id and p.owner_id = auth.uid()
  ));

create policy "versions are owner-owned" on public.prd_versions
  for all using (exists (
    select 1 from public.prds d join public.projects p on p.id = d.project_id
    where d.id = prd_id and p.owner_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.prds d join public.projects p on p.id = d.project_id
    where d.id = prd_id and p.owner_id = auth.uid()
  ));

create policy "share links are owner-owned" on public.share_links
  for all using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()))
  with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

create policy "ai generations are owner-owned" on public.ai_generations
  for all using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()))
  with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();
create trigger projects_touch before update on public.projects
  for each row execute function public.touch_updated_at();
create trigger inputs_touch before update on public.project_inputs
  for each row execute function public.touch_updated_at();
create trigger questions_touch before update on public.discovery_questions
  for each row execute function public.touch_updated_at();
create trigger prds_touch before update on public.prds
  for each row execute function public.touch_updated_at();
create trigger sections_touch before update on public.prd_sections
  for each row execute function public.touch_updated_at();
create trigger requirements_touch before update on public.requirements
  for each row execute function public.touch_updated_at();
create trigger stories_touch before update on public.user_stories
  for each row execute function public.touch_updated_at();

create or replace function public.get_shared_project(shared_token_hash text)
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
  select jsonb_build_object(
    'project', to_jsonb(p),
    'prd', to_jsonb(d),
    'sections', coalesce(jsonb_agg(to_jsonb(s) order by s.position) filter (where s.id is not null), '[]'::jsonb)
  )
  from public.share_links l
  join public.projects p on p.id = l.project_id
  left join public.prds d on d.project_id = p.id
  left join public.prd_sections s on s.prd_id = d.id and s.is_visible
  where l.token_hash = shared_token_hash
    and l.is_active
    and (l.expires_at is null or l.expires_at > now())
  group by p.id, d.id
  limit 1;
$$;
