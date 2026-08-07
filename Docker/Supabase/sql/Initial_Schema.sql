create extension if not exists "uuid-ossp" with schema extensions;
create extension if not exists "pgcrypto" with schema extensions;

create table public.trips (
    trip_id uuid default extensions.uuid_generate_v4() not null primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    title text not null,
    destination text not null,
    banner text,
    start_date date not null,
    end_date date not null,
    budget text not null,
    last_updated timestamp without time zone default current_timestamp,
    notes text,
    no_of_travelers smallint not null
);

create table public.days (
    day_id uuid default extensions.uuid_generate_v4() not null primary key,
    trip_id uuid not null references public.trips(trip_id) on delete cascade,
    day_number integer not null,
    unique (trip_id, day_number)
);

create table public.places (
    place_id uuid default gen_random_uuid() not null primary key,
    google_place_id text not null,
    lat double precision not null,
    lng double precision not null,
    day_id uuid not null references public.days(day_id) on delete cascade,
    order_index integer not null,
    name text not null,
    description text not null,
    start_time time without time zone not null,
    end_time time without time zone not null,
    image text,
    extra_details jsonb default '{}'::jsonb
);

create table public.test (
    id uuid default gen_random_uuid() not null primary key,
    v text not null,
    nv time without time zone
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('trip-banners', 'trip-banners', true, 5242880, array['image/jpeg','image/jpg','image/png','image/webp'])
on conflict (id) do nothing;
