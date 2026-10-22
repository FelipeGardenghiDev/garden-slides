import { describe, it, expect } from 'vitest';
import { parsePresentation, getTransitionCssClass, generatePresenterQrSvg } from '../src/core/slide-parser';

describe('Garden Slides Parser & Engine', () => {
  it('parses empty or whitespace input into a fallback slide', () => {
    const slides = parsePresentation('');
    expect(slides.length).toBe(1);
    expect(slides[0].title).toBe('Slide Vazio');
  });

  it('splits presentation slides separated by --- delimiter', () => {
    const md = `
# Slide 1: Welcome
Welcome to our deck.

---

# Slide 2: Problem
Here is the core problem.

---

# Slide 3: Solution
Here is the staff solution.
    `.trim();

    const slides = parsePresentation(md);
    expect(slides.length).toBe(3);
    expect(slides[0].title).toBe('Slide 1: Welcome');
    expect(slides[1].title).toBe('Slide 2: Problem');
    expect(slides[2].title).toBe('Slide 3: Solution');
  });

  it('extracts speaker notes delimited by ??? marker', () => {
    const md = `
# Architecture Review
Overview of our system.

???
Remember to emphasize zero cloud egress and local-first storage.
    `.trim();

    const slides = parsePresentation(md);
    expect(slides.length).toBe(1);
    expect(slides[0].notes).toContain('Remember to emphasize zero cloud egress');
    expect(slides[0].body).not.toContain('???');
  });

  it('extracts speaker notes in HTML comments <!-- notes: ... -->', () => {
    const md = `
# Tour Setlist
Opening with song 1.

<!-- notes: Cue the smoke machine and spotlight on guitarist -->
    `.trim();

    const slides = parsePresentation(md);
    expect(slides.length).toBe(1);
    expect(slides[0].notes).toBe('Cue the smoke machine and spotlight on guitarist');
  });

  it('detects badges correctly [badge: ...]', () => {
    const md = `
[badge: Staff RFC]
# Engineering Direction 2026
    `.trim();

    const slides = parsePresentation(md);
    expect(slides.length).toBe(1);
    expect(slides[0].headerBadge).toBe('Staff RFC');
    expect(slides[0].body).not.toContain('[badge:');
  });

  it('detects split column layout when using ||| divider', () => {
    const md = `
# Comparativo de Tecnologias

|||

### Opção A
- Prós: Rápido
- Contras: Caro

|||

### Opção B
- Prós: Grátis
- Contras: Complexo
    `.trim();

    const slides = parsePresentation(md);
    expect(slides.length).toBe(1);
    expect(slides[0].layout).toBe('split');
  });

  it('maps transition types to CSS animation and transform classes', () => {
    expect(getTransitionCssClass('fade')).toContain('transition-opacity');
    expect(getTransitionCssClass('slide')).toContain('translate-x-0');
    expect(getTransitionCssClass('zoom')).toContain('scale-100');
    expect(getTransitionCssClass('flip3d')).toContain('perspective-1000');
  });

  it('generates valid presenter QR SVG code', () => {
    const svg = generatePresenterQrSvg('https://felipegardenghidev.github.io/garden-slides/#remote');
    expect(svg).toContain('<svg');
    expect(svg).toContain('viewBox="0 0 160 160"');
    expect(svg).toContain('fill="#10b981"');
    expect(svg).toContain('</svg>');
  });
});
