-- 임시: user_id foreign key 제약 제거 (테스트용)
-- 프로덕션에서는 다시 추가 필요!

-- 기존 foreign key constraint 제거
ALTER TABLE public.projects 
DROP CONSTRAINT IF EXISTS projects_user_id_fkey;

-- user_id를 nullable로 변경
ALTER TABLE public.projects 
ALTER COLUMN user_id DROP NOT NULL;
