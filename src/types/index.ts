export type SlideTheme = 'dark' | 'emerald' | 'cyber' | 'light';

export interface SlideData {
  id: number;
  raw: string;
  body: string;
  notes: string;
  title: string;
  subtitle?: string;
  layout: 'title' | 'default' | 'split' | 'quote' | 'code';
  headerBadge?: string;
}

export interface Presentation {
  title: string;
  theme: SlideTheme;
  slides: SlideData[];
}
