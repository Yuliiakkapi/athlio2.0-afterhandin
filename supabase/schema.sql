-- ============================================================
-- Athlio 2.0 - Supabase Schema (fixed)
-- Run this file in Supabase SQL Editor
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- REFERENCE TABLES
-- ============================================================

create table if not exists clubs (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  logo_url     text,
  city         text,
  country      text,
  country_code text,
  sport        text,
  created_at   timestamptz not null default now()
);

alter table clubs add column if not exists city text;
alter table clubs add column if not exists country text;
alter table clubs add column if not exists country_code text;
alter table clubs add column if not exists sport text;
alter table clubs add column if not exists logo_url text;

create table if not exists seasons (
  id         uuid primary key default uuid_generate_v4(),
  label      text not null unique,
  name       text,
  created_at timestamptz not null default now()
);

insert into seasons (label, name) values
  ('2022-23', 'Season 2022/23'),
  ('2023-24', 'Season 2023/24'),
  ('2024-25', 'Season 2024/25'),
  ('2025-26', 'Season 2025/26')
on conflict (label) do nothing;

create table if not exists sports (
  id          text primary key,
  name        text not null unique,
  description text,
  icon_url    text,
  created_at  timestamptz not null default now()
);

insert into sports (id, name, description) values
  ('football', 'Football', 'Show your talent and connect with the global football network.'),
  ('basketball', 'Basketball', 'Play hard, get noticed, and take your game to the next level.')
on conflict (id) do nothing;

-- ============================================================
-- PROFILES
-- ============================================================

create table if not exists profiles (
  id                 uuid primary key references auth.users(id) on delete cascade,
  full_name          text,
  username           text unique,
  avatar_url         text,
  bio                text,
  role               text check (role in ('athlete','scout','coach','organization')),
  primary_sport      text,
  sports             text[],
  position           text[],
  gender             text,
  age                int,
  height_cm          numeric,
  weight_kg          numeric,
  country            text,
  region             text,
  city               text,
  goals              text,
  talent_preferences jsonb,
  club_id            uuid references clubs(id) on delete set null,
  club_other_name    text,
  follower_count     int not null default 0,
  following_count    int not null default 0,
  verified           boolean not null default false,
  org_name           text,
  org_founded_year   int,
  org_team_size      int,
  org_description    text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on profiles;
create trigger profiles_updated_at
  before update on profiles
  for each row execute procedure public.set_updated_at();

create or replace function public.handle_new_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.info (profile_id)
  values (new.id)
  on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_profile_created on profiles;
create trigger on_profile_created
  after insert on profiles
  for each row execute procedure public.handle_new_profile();

-- ============================================================
-- FOLLOWS
-- ============================================================

create table if not exists follows (
  follower_id  uuid not null references profiles(id) on delete cascade,
  following_id uuid not null references profiles(id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (follower_id, following_id)
);

create or replace function public.update_follow_counts()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (tg_op = 'INSERT') then
    update profiles set follower_count = follower_count + 1 where id = new.following_id;
    update profiles set following_count = following_count + 1 where id = new.follower_id;
  elsif (tg_op = 'DELETE') then
    update profiles set follower_count = greatest(follower_count - 1, 0) where id = old.following_id;
    update profiles set following_count = greatest(following_count - 1, 0) where id = old.follower_id;
  end if;
  return null;
end;
$$;

drop trigger if exists follows_count_sync on follows;
create trigger follows_count_sync
  after insert or delete on follows
  for each row execute procedure public.update_follow_counts();

-- ============================================================
-- POSTS
-- ============================================================

-- ============================================================
-- MATCHES  (player performance records, independent of posts)
-- ============================================================
create table if not exists matches (
  id               uuid primary key default uuid_generate_v4(),
  player_id        uuid not null references profiles(id) on delete cascade,
  date_of_game     date,
  league           text,
  your_team        text,
  opponent         text,
  opponent_club_id uuid references clubs(id) on delete set null,
  your_score       int not null default 0,
  opponent_score   int not null default 0,
  minutes_played   int not null default 0,
  goals            int not null default 0,
  assists          int not null default 0,
  yellow_cards     int not null default 0,
  red_cards        int not null default 0,
  home_or_away     text,
  participation    text,
  created_at       timestamptz not null default now()
);

create index if not exists matches_player_date on matches (player_id, date_of_game desc);

alter table matches enable row level security;
create policy if not exists matches_select on matches for select using (true);
create policy if not exists matches_insert on matches for insert to authenticated with check (auth.uid() = player_id);
create policy if not exists matches_update on matches for update to authenticated using (auth.uid() = player_id);
create policy if not exists matches_delete on matches for delete to authenticated using (auth.uid() = player_id);

-- ============================================================
-- POSTS  (social feed — basic or linked to a match)
-- ============================================================
create table if not exists posts (
  id             uuid primary key default uuid_generate_v4(),
  author_id      uuid not null references profiles(id) on delete cascade,
  type           text not null check (type in ('basic','match')) default 'basic',
  content        text,
  media          text,
  likes_count    int not null default 0,
  comments_count int not null default 0,
  match_id       uuid references matches(id) on delete set null,
  media_urls     text[] not null default '{}',
  created_at     timestamptz not null default now()
);

create index if not exists posts_author_created on posts (author_id, created_at desc);

alter table posts add column if not exists match_id    uuid references matches(id) on delete set null;
alter table posts add column if not exists media_urls  text[] not null default '{}';

-- ============================================================
-- POST LIKES
-- ============================================================

create table if not exists post_likes (
  post_id    uuid not null references posts(id) on delete cascade,
  user_id    uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create or replace function public.update_post_likes_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (tg_op = 'INSERT') then
    update posts set likes_count = likes_count + 1 where id = new.post_id;
  elsif (tg_op = 'DELETE') then
    update posts set likes_count = greatest(likes_count - 1, 0) where id = old.post_id;
  end if;
  return null;
end;
$$;

drop trigger if exists post_likes_count_sync on post_likes;
create trigger post_likes_count_sync
  after insert or delete on post_likes
  for each row execute procedure public.update_post_likes_count();

-- ============================================================
-- POST COMMENTS
-- ============================================================

create table if not exists post_comments (
  id         uuid primary key default uuid_generate_v4(),
  post_id    uuid not null references posts(id) on delete cascade,
  author_id  uuid not null references profiles(id) on delete cascade,
  content    text not null,
  created_at timestamptz not null default now()
);

create index if not exists post_comments_post on post_comments (post_id, created_at asc);

create or replace function public.update_post_comments_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (tg_op = 'INSERT') then
    update posts set comments_count = comments_count + 1 where id = new.post_id;
  elsif (tg_op = 'DELETE') then
    update posts set comments_count = greatest(comments_count - 1, 0) where id = old.post_id;
  end if;
  return null;
end;
$$;

drop trigger if exists post_comments_count_sync on post_comments;
create trigger post_comments_count_sync
  after insert or delete on post_comments
  for each row execute procedure public.update_post_comments_count();

-- ============================================================
-- EXPERIENCES
-- ============================================================

create table if not exists experiences (
  id         uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  org_name   text,
  team_name  text,
  team_level text,
  country    text,
  logo_url   text,
  start_date date,
  end_date   date,
  is_current boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists experiences_profile on experiences (profile_id, start_date desc);

-- ============================================================
-- PLAYER SEASON STATS
-- ============================================================

create table if not exists player_season_stats (
  id                     uuid primary key default uuid_generate_v4(),
  profile_id             uuid not null references profiles(id) on delete cascade,
  season_id              uuid references seasons(id) on delete set null,
  appearances            int default 0,
  starts                 int default 0,
  minutes                int default 0,
  minutes_per_game       numeric default 0,
  goals                  int default 0,
  goals_per_game         numeric default 0,
  assists                int default 0,
  shots_per_game         numeric default 0,
  touches_per_game       numeric default 0,
  big_chances_created    int default 0,
  key_passes_per_game    numeric default 0,
  tackles_per_game       numeric default 0,
  interceptions_per_game numeric default 0,
  balls_recovered        int default 0,
  penalties_committed    int default 0,
  scoring_per_minute     numeric default 0,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index if not exists player_season_stats_profile on player_season_stats (profile_id, season_id);

drop trigger if exists player_season_stats_updated_at on player_season_stats;
create trigger player_season_stats_updated_at
  before update on player_season_stats
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- INFO
-- ============================================================

create table if not exists info (
  id               uuid primary key default uuid_generate_v4(),
  profile_id       uuid not null references profiles(id) on delete cascade,
  season_id        uuid references seasons(id) on delete set null,
  nationality      text,
  nationality_code text,
  birth_date       date,
  weight_kg        numeric,
  height_cm        numeric,
  position         text,
  shirt_number     int,
  preferred_foot   text check (preferred_foot in ('left','right','both')),
  playing_style    text,
  club_id          uuid references clubs(id) on delete set null,
  updated_at       timestamptz not null default now()
);

create index if not exists info_profile on info (profile_id, updated_at desc);

drop trigger if exists info_updated_at on info;
create trigger info_updated_at
  before update on info
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- INJURIES
-- ============================================================

create table if not exists injuries (
  id                      uuid primary key default uuid_generate_v4(),
  profile_id              uuid not null references profiles(id) on delete cascade,
  title                   text,
  body_part               text,
  side                    text check (side in ('left','right','both','n/a')),
  severity                text,
  category                text,
  start_date              date,
  end_date                date,
  expected_return_date    date,
  expected_duration_weeks int,
  notes                   text,
  created_at              timestamptz not null default now()
);

create index if not exists injuries_profile on injuries (profile_id, start_date desc);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

create table if not exists notifications (
  id           uuid primary key default uuid_generate_v4(),
  recipient_id uuid not null references profiles(id) on delete cascade,
  type         text not null,
  actor_id     uuid references profiles(id) on delete set null,
  post_id      uuid references posts(id) on delete cascade,
  comment_id   uuid references post_comments(id) on delete cascade,
  read_at      timestamptz,
  created_at   timestamptz not null default now()
);

alter table notifications add column if not exists recipient_id uuid references profiles(id) on delete cascade;
alter table notifications add column if not exists actor_id uuid references profiles(id) on delete set null;
alter table notifications add column if not exists post_id uuid references posts(id) on delete cascade;
alter table notifications add column if not exists comment_id uuid references post_comments(id) on delete cascade;
alter table notifications add column if not exists read_at timestamptz;
alter table notifications add column if not exists type text;
alter table notifications add column if not exists created_at timestamptz not null default now();

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'notifications'
      and column_name = 'user_id'
  ) then
    execute '
      update notifications
      set recipient_id = coalesce(recipient_id, user_id)
      where recipient_id is null
    ';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'notifications'
      and column_name = 'read'
  ) then
    execute '
      update notifications
      set read_at = coalesce(read_at, now())
      where read = true and read_at is null
    ';
  end if;
end $$;

create index if not exists notifications_recipient on notifications (recipient_id, created_at desc);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table clubs                enable row level security;
alter table seasons              enable row level security;
alter table sports               enable row level security;
alter table profiles             enable row level security;
alter table follows              enable row level security;
alter table posts                enable row level security;
alter table post_likes           enable row level security;
alter table post_comments        enable row level security;
alter table experiences          enable row level security;
alter table player_season_stats  enable row level security;
alter table info                 enable row level security;
alter table injuries             enable row level security;
alter table notifications        enable row level security;

-- Drop policies so the script can be re-run safely

drop policy if exists clubs_select on clubs;
drop policy if exists clubs_insert on clubs;
drop policy if exists clubs_update on clubs;
drop policy if exists clubs_delete on clubs;

drop policy if exists seasons_select on seasons;
drop policy if exists sports_select on sports;

drop policy if exists profiles_select on profiles;
drop policy if exists profiles_insert on profiles;
drop policy if exists profiles_update on profiles;
drop policy if exists profiles_delete on profiles;

drop policy if exists follows_select on follows;
drop policy if exists follows_insert on follows;
drop policy if exists follows_delete on follows;

drop policy if exists posts_select on posts;
drop policy if exists posts_insert on posts;
drop policy if exists posts_update on posts;
drop policy if exists posts_delete on posts;

drop policy if exists post_likes_select on post_likes;
drop policy if exists post_likes_insert on post_likes;
drop policy if exists post_likes_delete on post_likes;

drop policy if exists post_comments_select on post_comments;
drop policy if exists post_comments_insert on post_comments;
drop policy if exists post_comments_delete on post_comments;

drop policy if exists experiences_select on experiences;
drop policy if exists experiences_insert on experiences;
drop policy if exists experiences_update on experiences;
drop policy if exists experiences_delete on experiences;

drop policy if exists pss_select on player_season_stats;
drop policy if exists pss_insert on player_season_stats;
drop policy if exists pss_update on player_season_stats;
drop policy if exists pss_delete on player_season_stats;

drop policy if exists info_select on info;
drop policy if exists info_insert on info;
drop policy if exists info_update on info;
drop policy if exists info_delete on info;

drop policy if exists injuries_select on injuries;
drop policy if exists injuries_insert on injuries;
drop policy if exists injuries_update on injuries;
drop policy if exists injuries_delete on injuries;

drop policy if exists notifications_select on notifications;
drop policy if exists notifications_insert on notifications;
drop policy if exists notifications_update on notifications;
drop policy if exists notifications_delete on notifications;

create policy clubs_select on clubs for select using (true);
create policy clubs_insert on clubs for insert to authenticated with check (true);
create policy clubs_update on clubs for update to authenticated using (true) with check (true);
create policy clubs_delete on clubs for delete to authenticated using (true);

create policy seasons_select on seasons for select using (true);
create policy sports_select on sports for select using (true);

create policy profiles_select on profiles for select using (true);
create policy profiles_insert on profiles for insert with check (auth.uid() = id);
create policy profiles_update on profiles for update using (auth.uid() = id);
create policy profiles_delete on profiles for delete using (auth.uid() = id);

create policy follows_select on follows for select using (true);
create policy follows_insert on follows for insert with check (auth.uid() = follower_id);
create policy follows_delete on follows for delete using (auth.uid() = follower_id);

create policy posts_select on posts for select using (true);
create policy posts_insert on posts for insert with check (auth.uid() = author_id);
create policy posts_update on posts for update using (auth.uid() = author_id);
create policy posts_delete on posts for delete using (auth.uid() = author_id);

create policy post_likes_select on post_likes for select using (true);
create policy post_likes_insert on post_likes for insert with check (auth.uid() = user_id);
create policy post_likes_delete on post_likes for delete using (auth.uid() = user_id);

create policy post_comments_select on post_comments for select using (true);
create policy post_comments_insert on post_comments for insert with check (auth.uid() = author_id);
create policy post_comments_delete on post_comments for delete using (auth.uid() = author_id);

create policy experiences_select on experiences for select using (true);
create policy experiences_insert on experiences for insert with check (auth.uid() = profile_id);
create policy experiences_update on experiences for update using (auth.uid() = profile_id);
create policy experiences_delete on experiences for delete using (auth.uid() = profile_id);

create policy pss_select on player_season_stats for select using (true);
create policy pss_insert on player_season_stats for insert with check (auth.uid() = profile_id);
create policy pss_update on player_season_stats for update using (auth.uid() = profile_id);
create policy pss_delete on player_season_stats for delete using (auth.uid() = profile_id);

create policy info_select on info for select using (true);
create policy info_insert on info for insert with check (auth.uid() = profile_id);
create policy info_update on info for update using (auth.uid() = profile_id);
create policy info_delete on info for delete using (auth.uid() = profile_id);

create policy injuries_select on injuries for select using (auth.uid() = profile_id);
create policy injuries_insert on injuries for insert with check (auth.uid() = profile_id);
create policy injuries_update on injuries for update using (auth.uid() = profile_id);
create policy injuries_delete on injuries for delete using (auth.uid() = profile_id);

create policy notifications_select on notifications for select using (auth.uid() = recipient_id);
create policy notifications_insert on notifications for insert with check (auth.uid() = actor_id);
create policy notifications_update on notifications for update using (auth.uid() = recipient_id) with check (auth.uid() = recipient_id);
create policy notifications_delete on notifications for delete using (auth.uid() = recipient_id or auth.uid() = actor_id);

-- ============================================================
-- STORAGE BUCKETS (configure in Storage UI)
-- 1) avatars (public)
-- 2) post-media (public)
-- ============================================================
