export type ProjectStatus = 'draft' | 'rendering' | 'completed' | 'failed';
export type SlideTemplate = 'text' | 'title-image' | 'code';
export type ColorTheme = 'blue' | 'green' | 'purple' | 'orange' | 'dark';
export type VoiceType = 'female' | 'male' | 'clone';

export interface Slide {
  id: string;
  order: number;
  text: string;
  template: SlideTemplate;
  audio_url?: string;
  duration_seconds?: number;
  image_url?: string;
}

export interface ProjectSettings {
  template: SlideTemplate;
  color_theme: ColorTheme;
  font: string;
  voice: VoiceType;
  voice_speed: number;
  voice_pitch: number;
  background_music?: string;
  enable_subtitles: boolean;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  status: ProjectStatus;
  script: string;
  slides: Slide[];
  settings: ProjectSettings;
  video_url?: string;
  subtitle_url?: string;
  duration_seconds: number;
  created_at: string;
  updated_at: string;
}

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    user_id: 'u1',
    title: 'Python 기초 강의',
    status: 'completed',
    script: '',
    slides: [],
    settings: { template: 'text', color_theme: 'blue', font: 'pretendard', voice: 'female', voice_speed: 1, voice_pitch: 0, enable_subtitles: true },
    duration_seconds: 300,
    created_at: '2026-02-26',
    updated_at: '2026-02-26',
    video_url: '#',
  },
  {
    id: '2',
    user_id: 'u1',
    title: 'React 강의 시리즈',
    status: 'rendering',
    script: '',
    slides: [],
    settings: { template: 'code', color_theme: 'blue', font: 'pretendard', voice: 'male', voice_speed: 1, voice_pitch: 0, enable_subtitles: true },
    duration_seconds: 480,
    created_at: '2026-02-25',
    updated_at: '2026-02-25',
  },
  {
    id: '3',
    user_id: 'u1',
    title: 'SQL 입문 가이드',
    status: 'draft',
    script: '',
    slides: [],
    settings: { template: 'text', color_theme: 'green', font: 'pretendard', voice: 'female', voice_speed: 1, voice_pitch: 0, enable_subtitles: false },
    duration_seconds: 180,
    created_at: '2026-02-24',
    updated_at: '2026-02-24',
  },
];
