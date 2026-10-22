export type SlideTheme = 'dark' | 'emerald' | 'cyber' | 'light';
export type SlideTransition = 'fade' | 'slide' | 'zoom' | 'flip3d';

export interface SlideData {
  id: number;
  raw: string;
  body: string;
  notes: string;
  title: string;
  subtitle?: string;
  layout: 'title' | 'default' | 'split' | 'quote' | 'code';
  headerBadge?: string;
  transition?: SlideTransition;
}

export interface Presentation {
  title: string;
  theme: SlideTheme;
  transition?: SlideTransition;
  slides: SlideData[];
}
