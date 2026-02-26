-- 임시: 로그인 없이도 테스트 가능하도록 RLS 비활성화
-- 프로덕션에서는 다시 활성화 필요!

alter table public.projects disable row level security;

-- 또는 RLS는 유지하고 익명 사용자도 허용하는 정책 추가
-- create policy "Allow anonymous users"
--   on public.projects for all
--   using (true)
--   with check (true);
