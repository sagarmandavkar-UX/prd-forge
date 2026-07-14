-- Demo seed for local Supabase development. The browser demo uses src/lib/store/seed.ts.
-- Create a user through Supabase Auth first, then replace the UUID below with that user id.

-- insert into public.profiles (id, full_name, role)
-- values ('00000000-0000-0000-0000-000000000000', 'Alex Kim', 'Product manager')
-- on conflict (id) do update set full_name = excluded.full_name;

-- insert into public.projects (owner_id, name, description, product_type, industry, platform, stage, status)
-- values
-- ('00000000-0000-0000-0000-000000000000', 'Campus Club Application Hub', 'A university platform that centralizes student organization discovery, applications, deadlines, and role-based club administration.', 'Internal platform', 'Education', 'Responsive web app', 'Discovery', 'completed'),
-- ('00000000-0000-0000-0000-000000000000', 'Safe Clinical Reasoning Assistant', 'Simulation-only decision-support concept. Not medical advice.', 'AI-assisted workflow', 'Healthcare', 'Secure web app', 'Concept', 'active'),
-- ('00000000-0000-0000-0000-000000000000', 'Nonprofit Inventory Manager', 'Warehouse inventory application for donated school supplies, fulfillment, discrepancies, and audit workflows.', 'Internal tool', 'Nonprofit operations', 'Web app', 'Draft', 'draft');
