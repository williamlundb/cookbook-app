-- Foundation only. No client policies are granted in this migration.
-- Keep the app in demo mode until the permission RPCs and RLS integration tests exist.
begin;

create type public.cookbook_role as enum ('owner', 'cook', 'follower');
create type public.recipe_category as enum ('baking', 'breakfast', 'dinner', 'soups', 'sides', 'desserts', 'drinks', 'holidays', 'other');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 100),
  avatar_path text,
  locale text not null default 'sv' check (locale in ('sv', 'en')),
  plan text not null default 'free' check (plan in ('free', 'family')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.cookbooks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 160),
  description text not null default '' check (char_length(description) <= 4000),
  cover_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.memberships (
  cookbook_id uuid not null references public.cookbooks(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.cookbook_role not null,
  notifications_muted boolean not null default false,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (cookbook_id, user_id)
);
create unique index one_owner_membership_per_book on public.memberships(cookbook_id) where role = 'owner';
create index memberships_by_user on public.memberships(user_id);

-- A deferred check permits atomic creation of a book + its owner membership.
create function public.check_cookbook_owner() returns trigger language plpgsql
set search_path = '' as $$
declare book_id uuid;
begin
  if tg_table_name = 'cookbooks' then
    book_id := coalesce(new.id, old.id);
  else
    book_id := coalesce(new.cookbook_id, old.cookbook_id);
  end if;
  if exists(select 1 from public.cookbooks b where b.id = book_id and not exists (
    select 1 from public.memberships m where m.cookbook_id = b.id and m.user_id = b.owner_id and m.role = 'owner'
  )) or exists(select 1 from public.memberships m join public.cookbooks b on b.id = m.cookbook_id
    where m.cookbook_id = book_id and m.role = 'owner' and m.user_id <> b.owner_id) then
    raise exception 'A cookbook must have its owner as exactly one owner membership';
  end if;
  -- Membership keys must be immutable in future update policies/RPCs.
  return null;
end $$;
create constraint trigger cookbook_owner_check after insert or update on public.cookbooks
  deferrable initially deferred for each row execute function public.check_cookbook_owner();
create constraint trigger membership_owner_check after insert or update or delete on public.memberships
  deferrable initially deferred for each row execute function public.check_cookbook_owner();

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  cookbook_id uuid not null references public.cookbooks(id) on delete cascade,
  -- Keep recipes when a co-cook deletes their account.
  author_id uuid references public.profiles(id) on delete set null,
  title text not null check (char_length(trim(title)) between 1 and 160),
  description text not null default '' check (char_length(description) <= 4000),
  category public.recipe_category not null default 'other',
  servings integer check (servings between 1 and 1000),
  prep_minutes integer check (prep_minutes between 0 and 10080),
  cook_minutes integer check (cook_minutes between 0 and 10080),
  ingredients jsonb not null default '[]' check (jsonb_typeof(ingredients) = 'array' and octet_length(ingredients::text) <= 40000),
  steps jsonb not null default '[]' check (jsonb_typeof(steps) = 'array' and octet_length(steps::text) <= 80000),
  tips text not null default '' check (char_length(tips) <= 4000),
  photo_path text,
  source text not null default 'manual' check (source in ('manual', 'photo_import')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index recipes_by_book on public.recipes(cookbook_id, created_at desc);
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  body text not null check (char_length(trim(body)) between 1 and 4000),
  edited_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index comments_by_recipe on public.comments(recipe_id, created_at);
create table public.invites (
  id uuid primary key default gen_random_uuid(),
  cookbook_id uuid not null references public.cookbooks(id) on delete cascade,
  -- Store only a SHA-256 digest of a server-generated 256-bit token.
  code_hash text not null unique check (code_hash ~ '^[a-f0-9]{64}$'),
  role public.cookbook_role not null check (role <> 'owner'),
  created_by uuid references public.profiles(id) on delete set null,
  expires_at timestamptz not null default (now() + interval '14 days'),
  max_uses integer check (max_uses > 0),
  use_count integer not null default 0 check (use_count >= 0),
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (max_uses is null or use_count <= max_uses)
);
create table public.push_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  token text not null unique check (char_length(token) between 1 and 512),
  platform text not null check (platform in ('ios', 'android')),
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.ai_imports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null check (status in ('pending', 'succeeded', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ai_imports_monthly_usage on public.ai_imports(user_id, created_at);
create table public.plan_limits (
  plan text primary key check (plan in ('free', 'family')),
  owned_cookbooks integer not null check (owned_cookbooks > 0),
  recipes_per_cookbook integer check (recipes_per_cookbook > 0),
  photo_imports_monthly integer not null check (photo_imports_monthly >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
insert into public.plan_limits(plan, owned_cookbooks, recipes_per_cookbook, photo_imports_monthly)
values ('free', 1, 30, 3), ('family', 5, null, 30);

create function public.touch_updated_at() returns trigger language plpgsql
set search_path = '' as $$ begin new.updated_at = now(); return new; end $$;
do $$ declare tab text; begin
  foreach tab in array array['profiles','cookbooks','memberships','recipes','comments','invites','push_tokens','ai_imports','plan_limits'] loop
    execute format('alter table public.%I enable row level security', tab);
    execute format('revoke all on public.%I from anon, authenticated', tab);
    execute format('create trigger touch_updated_at before update on public.%I for each row execute function public.touch_updated_at()', tab);
  end loop;
end $$;
revoke all on function public.check_cookbook_owner() from public;
revoke all on function public.touch_updated_at() from public;

insert into storage.buckets(id, name, public) values ('recipe-photos', 'recipe-photos', false), ('avatars', 'avatars', false);
-- No storage client policies yet. All objects remain inaccessible to the app.
commit;
