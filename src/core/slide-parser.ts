import { SlideData } from '../types';

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

    // Extract badge tag if present: [badge: High Performance]
    let headerBadge: string | undefined;
    const badgeMatch = body.match(/\[badge:\s*([^\]]+)\]/i);
    if (badgeMatch) {
      headerBadge = badgeMatch[1].trim();
      body = body.replace(/\[badge:\s*[^\]]+\]/gi, '').trim();
    }

    // Extract slide title
    let title = `Slide ${index + 1}`;
    let subtitle: string | undefined;

    const titleMatch = body.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      title = titleMatch[1].trim();
    } else {
      const h2Match = body.match(/^##\s+(.+)$/m);
      if (h2Match) {
        title = h2Match[1].trim();
      }
    }

    const subMatch = body.match(/^##\s+(.+)$/m);
    if (subMatch && subMatch[1] !== title) {
      subtitle = subMatch[1].trim();
    }

    // Layout detection
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
