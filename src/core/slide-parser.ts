import { SlideData, SlideTransition } from '../types';

/**
 * Parses raw markdown presentations separated by '---' delimiters.
 * Supports:
 * - Speaker notes after '???' or '<!-- notes: ... -->'
 * - Dual column split layout with '|||'
 * - Badges via '[badge: Label]'
 * - Layout inference (title, code, quote, split, default)
 */
export function parsePresentation(rawMarkdown: string): SlideData[] {
  if (!rawMarkdown || rawMarkdown.trim() === '') {
    return [
      {
        id: 1,
        raw: '# Slide Vazio\n\nAdicione conteúdo no editor markdown.',
        body: '# Slide Vazio\n\nAdicione conteúdo no editor markdown.',
        notes: '',
        title: 'Slide Vazio',
        layout: 'title',
      },
    ];
  }

  // Split slides by horizontal rule delimiter '---'
  const rawSlides = rawMarkdown
    .split(/\r?\n---\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (rawSlides.length === 0) {
    return [
      {
        id: 1,
        raw: rawMarkdown,
        body: rawMarkdown,
        notes: '',
        title: 'Apresentação',
        layout: 'default',
      },
    ];
  }

  return rawSlides.map((rawSlide, index) => {
    let body = rawSlide;
    let notes = '';

    // Extract speaker notes via '???'
    const noteMarkerIndex = body.search(/\r?\n\?\?\?\r?\n/);
    if (noteMarkerIndex !== -1) {
      notes = body.slice(noteMarkerIndex).replace(/^\r?\n\?\?\?\r?\n?/, '').trim();
      body = body.slice(0, noteMarkerIndex).trim();
    } else {
      // Check HTML comment note <!-- notes: ... -->
      const commentMatch = body.match(/<!--\s*notes?:([\s\S]*?)-->/i);
      if (commentMatch) {
        notes = commentMatch[1].trim();
        body = body.replace(/<!--\s*notes?:[\s\S]*?-->/gi, '').trim();
      }
    }

    // Extract badge [badge: Texto]
    let headerBadge: string | undefined;
    const badgeMatch = body.match(/\[badge:\s*(.*?)\]/i);
    if (badgeMatch) {
      headerBadge = badgeMatch[1].trim();
      body = body.replace(/\[badge:\s*.*?\]/gi, '').trim();
    }

    // Extract title (first line starting with # or ##)
    let title = `Slide ${index + 1}`;
    let subtitle: string | undefined;

    const lines = body.split('\n').map((l) => l.trim());
    const headingIndex = lines.findIndex((l) => l.startsWith('#'));

    if (headingIndex !== -1) {
      const headingLine = lines[headingIndex];
      title = headingLine.replace(/^#+\s*/, '').trim();

      // Check if next non-empty line is a subtitle
      const nextLine = lines[headingIndex + 1];
      if (nextLine && !nextLine.startsWith('#') && !nextLine.startsWith('-') && !nextLine.startsWith('```')) {
        subtitle = nextLine;
      }
    }

    // Infer layout type
    let layout: SlideData['layout'] = 'default';

    if (body.includes('|||')) {
      layout = 'split';
    } else if (index === 0 && body.startsWith('#') && body.split('\n').length <= 4) {
      layout = 'title';
    } else if (body.includes('```')) {
      layout = 'code';
    } else if (body.startsWith('> ') || body.includes('\n> ')) {
      layout = 'quote';
    }

    return {
      id: index + 1,
      raw: rawSlide,
      body,
      notes,
      title,
      subtitle,
      layout,
      headerBadge,
    };
  });
}

export function getTransitionCssClass(transition: SlideTransition): string {
  switch (transition) {
    case 'slide':
      return 'transition-all duration-300 ease-out transform translate-x-0';
    case 'zoom':
      return 'transition-all duration-300 ease-out transform scale-100';
    case 'flip3d':
      return 'transition-all duration-500 ease-in-out transform-gpu perspective-1000 rotate-y-0';
    case 'fade':
    default:
      return 'transition-opacity duration-300 ease-in-out opacity-100';
  }
}

/**
 * Generates an accessible, clean SVG QR-style pairing pattern for remote control
 */
export function generatePresenterQrSvg(url: string, size = 160): string {
  const hash = url.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) | 0, 0);
  const cells = 7;
  const cellSize = Math.floor(size / cells);

  let rects = '';
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      // Keep corner positioning squares like standard QR codes
      const isCornerSquare =
        (r < 2 && c < 2) ||
        (r < 2 && c >= cells - 2) ||
        (r >= cells - 2 && c < 2);

      const isBitActive = isCornerSquare || (((hash >> (r * cells + c)) & 1) === 1);
      if (isBitActive) {
        rects += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize - 2}" height="${cellSize - 2}" fill="#10b981" rx="2" />`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="#18181b" rx="8" />${rects}</svg>`;
}
