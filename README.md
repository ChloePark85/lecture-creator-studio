
## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in your keys

3. Run development server:
```bash
npm run dev
```

## Environment Variables

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
- `VITE_OPENAI_API_KEY`: OpenAI API key for TTS

## Supabase Setup

Create a `projects` table:

```sql
create table projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  title text not null,
  status text not null check (status in ('draft', 'rendering', 'completed', 'failed')),
  script text not null,
  slides jsonb default '[]',
  settings jsonb default '{}',
  video_url text,
  subtitle_url text,
  duration_seconds integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table projects enable row level security;

-- Users can only see their own projects
create policy "Users can view own projects"
  on projects for select
  using (auth.uid() = user_id);

create policy "Users can insert own projects"
  on projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on projects for update
  using (auth.uid() = user_id);

create policy "Users can delete own projects"
  on projects for delete
  using (auth.uid() = user_id);
```

## OpenAI TTS Setup

1. Get OpenAI API key from https://platform.openai.com/api-keys
2. Add to `.env.local`:
   ```
   VITE_OPENAI_API_KEY=sk-...
   ```

## Known Limitations (MVP)

- Video rendering is simulated (Mock)
- Actual FFmpeg rendering requires backend server
- TTS uses OpenAI API (costs apply)

## Future: Real Video Rendering

For production, implement:
- Backend API (Node.js + FFmpeg)
- Or: AWS Lambda + FFmpeg layer
- Or: Cloudflare Workers + FFmpeg WASM
