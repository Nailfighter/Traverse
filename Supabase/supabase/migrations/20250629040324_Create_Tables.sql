-- Enable UUID extension (only needed once)
create extension IF not exists "uuid-ossp";

-- TRIPS table
create table public.trips (
  trip_id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid not null,
  title text not null,
  destination text not null,
  banner text not null,
  start_date date not null,
  end_date date not null,
  budget text not null,
  last_updated timestamp without time zone null default CURRENT_TIMESTAMP,
  notes text null,
  no_of_travelers smallint not null,
  constraint trips_pkey primary key (trip_id),
  constraint trips_user_id_fkey1 foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

-- DAYS table (cascades delete from trips)
create table public.days (
  day_id uuid not null default extensions.uuid_generate_v4 (),
  trip_id uuid not null,
  day_number integer not null,
  constraint days_pkey primary key (day_id),
  constraint days_trip_id_day_number_key unique (trip_id, day_number),
  constraint days_trip_id_fkey foreign KEY (trip_id) references trips (trip_id) on delete CASCADE
) TABLESPACE pg_default;

-- PLACES table (cascades delete from days)
create table public.places (
  place_id uuid not null default gen_random_uuid (),
  google_place_id text not null,
  lat double precision not null,
  lng double precision not null,
  day_id uuid not null,
  order_index integer not null,
  name text not null,
  description text not null,
  start_time time without time zone not null,
  end_time time without time zone not null,
  image text null,
  extra_details jsonb null default '{}'::jsonb,
  constraint places_pkey primary key (place_id),
  constraint places_day_id_fkey foreign KEY (day_id) references days (day_id) on delete CASCADE
) TABLESPACE pg_default;