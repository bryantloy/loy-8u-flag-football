-- Team HQ database foundation for production integration.
-- Execute in Supabase SQL editor. App preview does NOT connect to it yet.
-- Anonymous auth alone does not authorize membership: a coach must approve joining.
create extension if not exists pgcrypto;
create table if not exists public.teams (
 id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null,
 primary_color text not null default '#1746a2', accent_color text not null default '#ef7b21',
 school_name text, created_at timestamptz not null default now()
);
create table if not exists public.memberships (
 id uuid primary key default gen_random_uuid(), team_id uuid not null references public.teams(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 display_name text not null, role text not null default 'parent' check (role in ('owner','coach','parent')),
 status text not null default 'pending' check (status in ('pending','approved','suspended')),
 created_at timestamptz not null default now(), unique(team_id,user_id)
);
create table if not exists public.players (
 id uuid primary key default gen_random_uuid(), team_id uuid not null references public.teams(id) on delete cascade,
 first_name text not null, jersey_number text, created_at timestamptz not null default now(),
 unique(id,team_id)
);
create table if not exists public.player_guardians (
 team_id uuid not null references public.teams(id) on delete cascade,
 player_id uuid not null, membership_id uuid not null references public.memberships(id) on delete cascade,
 primary key(player_id,membership_id), foreign key (player_id,team_id) references public.players(id,team_id) on delete cascade
);
create table if not exists public.team_events (
 id uuid primary key default gen_random_uuid(), team_id uuid not null references public.teams(id) on delete cascade,
 title text not null, event_type text not null check(event_type in ('practice','game','other')),
 starts_at timestamptz not null, location text, notes text, created_at timestamptz not null default now()
);
create table if not exists public.event_rsvps (
 event_id uuid not null references public.team_events(id) on delete cascade,
 player_id uuid not null references public.players(id) on delete cascade,
 response text not null check (response in ('yes','no','maybe')),
 updated_by uuid not null references auth.users(id), updated_at timestamptz not null default now(),
 primary key (event_id,player_id)
);
create table if not exists public.announcements (
 id uuid primary key default gen_random_uuid(), team_id uuid not null references public.teams(id) on delete cascade,
 author_id uuid not null references auth.users(id), title text not null, body text not null,
 pinned boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists public.team_messages (
 id uuid primary key default gen_random_uuid(), team_id uuid not null references public.teams(id) on delete cascade,
 author_id uuid not null references auth.users(id), body text not null check(length(body) between 1 and 2000),
 created_at timestamptz not null default now()
);
create table if not exists public.drills (
 id uuid primary key default gen_random_uuid(), team_id uuid references public.teams(id) on delete cascade,
 title text not null, category text, duration_minutes integer, equipment text, instructions text,
 coaching_tips text, created_at timestamptz not null default now()
);
-- Future card packs can reference players.id, teams.id and memberships.id without altering the V1 roster model.
create or replace function public.is_approved_member(t uuid) returns boolean
 language sql stable security definer set search_path = '' as $$
 select exists (select 1 from public.memberships m where m.team_id=t and m.user_id=(select auth.uid()) and m.status='approved') $$;
create or replace function public.is_team_coach(t uuid) returns boolean
 language sql stable security definer set search_path = '' as $$
 select exists (select 1 from public.memberships m where m.team_id=t and m.user_id=(select auth.uid()) and m.status='approved' and m.role in ('owner','coach')) $$;
create or replace function public.is_player_guardian(p uuid) returns boolean
 language sql stable security definer set search_path = '' as $$
 select exists (select 1 from public.player_guardians g join public.memberships m on m.id=g.membership_id where g.player_id=p and m.user_id=(select auth.uid()) and m.status='approved') $$;
-- RLS: no permissive access to private team data for nonmembers.
alter table public.teams enable row level security;
alter table public.memberships enable row level security;
alter table public.players enable row level security;
alter table public.player_guardians enable row level security;
alter table public.team_events enable row level security;
alter table public.event_rsvps enable row level security;
alter table public.announcements enable row level security;
alter table public.team_messages enable row level security;
alter table public.drills enable row level security;
create policy "team is visible to approved members" on public.teams for select to authenticated using (public.is_approved_member(id));
create policy "members view approved members" on public.memberships for select to authenticated using (public.is_approved_member(team_id) or user_id=(select auth.uid()));
create policy "coaches manage members" on public.memberships for update to authenticated using(public.is_team_coach(team_id)) with check(public.is_team_coach(team_id));
create policy "coaches add members" on public.memberships for insert to authenticated with check(public.is_team_coach(team_id));
create policy "approved view players" on public.players for select to authenticated using(public.is_approved_member(team_id));
create policy "coaches manage players" on public.players for all to authenticated using(public.is_team_coach(team_id)) with check(public.is_team_coach(team_id));
create policy "approved view player guardians" on public.player_guardians for select to authenticated using(public.is_approved_member(team_id));
create policy "coaches manage player guardians" on public.player_guardians for all to authenticated using(public.is_team_coach(team_id)) with check(public.is_team_coach(team_id));
create policy "approved view events" on public.team_events for select to authenticated using(public.is_approved_member(team_id));
create policy "coaches manage events" on public.team_events for all to authenticated using(public.is_team_coach(team_id)) with check(public.is_team_coach(team_id));
create policy "approved view rsvps" on public.event_rsvps for select to authenticated using(exists(select 1 from public.team_events e where e.id=event_id and public.is_approved_member(e.team_id)));
create policy "guardians or coaches add rsvps" on public.event_rsvps for insert to authenticated with check(updated_by=(select auth.uid()) and (public.is_player_guardian(player_id) or exists(select 1 from public.team_events e where e.id=event_id and public.is_team_coach(e.team_id))));
create policy "guardians or coaches update rsvps" on public.event_rsvps for update to authenticated using(public.is_player_guardian(player_id) or exists(select 1 from public.team_events e where e.id=event_id and public.is_team_coach(e.team_id))) with check(updated_by=(select auth.uid()) and (public.is_player_guardian(player_id) or exists(select 1 from public.team_events e where e.id=event_id and public.is_team_coach(e.team_id))));
create policy "approved view announcements" on public.announcements for select to authenticated using(public.is_approved_member(team_id));
create policy "coaches manage announcements" on public.announcements for all to authenticated using(public.is_team_coach(team_id)) with check(public.is_team_coach(team_id) and author_id=(select auth.uid()));
create policy "approved view messages" on public.team_messages for select to authenticated using(public.is_approved_member(team_id));
create policy "approved post messages" on public.team_messages for insert to authenticated with check(public.is_approved_member(team_id) and author_id=(select auth.uid()));
create policy "author delete message" on public.team_messages for delete to authenticated using(author_id=(select auth.uid()) and public.is_approved_member(team_id));
create policy "approved view drills" on public.drills for select to authenticated using(team_id is null or public.is_approved_member(team_id));
create policy "coaches manage own drills" on public.drills for all to authenticated using(team_id is not null and public.is_team_coach(team_id)) with check(team_id is not null and public.is_team_coach(team_id));
-- IMPORTANT: owner/team creation and invites require trusted server-only flows; do not expose service_role key in browser.
-- Before production, enforce event/player team agreement on RSVPs and tighten membership role changes
-- using server-only endpoints or database triggers. This is a foundation, not a security audit.
