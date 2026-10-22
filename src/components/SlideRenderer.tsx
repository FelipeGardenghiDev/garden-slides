import React from 'react';
import { SlideData, SlideTheme, SlideTransition } from '../types';
import { getTransitionCssClass } from '../core/slide-parser';

interface SlideRendererProps {
  slide: SlideData;
  theme: SlideTheme;
  isFullscreen?: boolean;
  transition?: SlideTransition;
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({
  slide,
  theme,
  isFullscreen = false,
  transition = 'fade',
}) => {
  const getThemeClasses = () => {
    switch (theme) {
      case 'emerald':
        return 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950 text-zinc-100 border-emerald-900/30';
      case 'cyber':
        return 'bg-gradient-to-br from-zinc-950 via-purple-950 to-indigo-950 text-zinc-100 border-indigo-900/40';
      case 'light':
        return 'bg-gradient-to-br from-white via-zinc-50 to-zinc-100 text-zinc-900 border-zinc-200';
      case 'dark':
      default:
        return 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100 border-zinc-800/60';
    }
  };

  const isLight = theme === 'light';

  // Render a block of markdown content
  const renderMarkdownContent = (content: string) => {
    // If it contains split column divider
    if (content.includes('|||')) {
      const columns = content.split('|||').map((col) => col.trim());
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl my-auto">
          {columns.map((col, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border backdrop-blur-sm ${
                isLight
                  ? 'bg-white/80 border-zinc-200 shadow-sm'
                  : 'bg-zinc-900/60 border-zinc-800/80 shadow-xl'
              }`}
            >
              {renderMarkdownBlocks(col)}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="w-full max-w-4xl flex flex-col justify-center my-auto">
        {renderMarkdownBlocks(content)}
      </div>
    );
  };

  const renderMarkdownBlocks = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBuffer: string[] = [];
    let codeLang = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code blocks
      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLang = line.trim().slice(3);
          codeBuffer = [];
          continue;
        } else {
          inCodeBlock = false;
          elements.push(
            <div
              key={`code-${i}`}
              className="my-4 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 font-mono text-sm text-emerald-400 p-4 shadow-lg text-left overflow-x-auto"
            >
              {codeLang && (
                <div className="text-xs text-zinc-500 mb-2 uppercase tracking-wider font-semibold border-b border-zinc-800 pb-1">
                  {codeLang}
                </div>
              )}
              <pre className="whitespace-pre">{codeBuffer.join('\n')}</pre>
            </div>
          );
          continue;
        }
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      const trimmed = line.trim();
      if (!trimmed) continue;

      // Headings
      if (trimmed.startsWith('# ')) {
        elements.push(
          <h1
            key={`h1-${i}`}
            className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-balance text-left bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent"
          >
            {formatInline(trimmed.slice(2))}
          </h1>
        );
      } else if (trimmed.startsWith('## ')) {
        elements.push(
          <h2
            key={`h2-${i}`}
            className={`text-2xl md:text-3xl font-bold tracking-tight mb-4 text-left ${
              isLight ? 'text-zinc-700' : 'text-zinc-300'
            }`}
          >
            {formatInline(trimmed.slice(3))}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        elements.push(
          <h3
            key={`h3-${i}`}
            className="text-xl font-bold mb-3 text-left text-emerald-400"
          >
            {formatInline(trimmed.slice(4))}
          </h3>
        );
      } else if (trimmed.startsWith('> ')) {
        elements.push(
          <blockquote
            key={`quote-${i}`}
            className={`border-l-4 border-emerald-500 pl-4 py-2 my-4 italic text-left text-lg ${
              isLight ? 'bg-emerald-50 text-zinc-800' : 'bg-emerald-950/20 text-emerald-200'
            } rounded-r-lg`}
          >
            {formatInline(trimmed.slice(2))}
          </blockquote>
        );
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        elements.push(
          <li
            key={`li-${i}`}
            className="text-left text-base md:text-lg mb-2.5 flex items-start gap-2.5 list-none"
          >
            <span className="text-emerald-400 mt-1 select-none font-bold">▸</span>
            <span>{formatInline(trimmed.slice(2))}</span>
          </li>
        );
      } else if (/^\d+\.\s/.test(trimmed)) {
        const numMatch = trimmed.match(/^(\d+)\.\s(.*)$/);
        elements.push(
          <div
            key={`ol-${i}`}
            className="text-left text-base md:text-lg mb-2.5 flex items-start gap-2.5"
          >
            <span className="font-bold text-emerald-400 min-w-5">
              {numMatch ? numMatch[1] : '•'}.
            </span>
            <span>{formatInline(numMatch ? numMatch[2] : trimmed)}</span>
          </div>
        );
      } else {
        elements.push(
          <p
            key={`p-${i}`}
            className={`text-left text-base md:text-lg mb-3 leading-relaxed ${
              isLight ? 'text-zinc-700' : 'text-zinc-300'
            }`}
          >
            {formatInline(trimmed)}
          </p>
        );
      }
    }

    return elements;
  };

  const formatInline = (text: string): React.ReactNode => {
    // Bold
    let parts: (string | React.ReactNode)[] = [text];

    // Process bold **text**
    parts = parts.flatMap((part) => {
      if (typeof part !== 'string') return [part];
      const subParts = part.split(/(\*\*[^*]+\*\*)/g);
      return subParts.map((sub, idx) => {
        if (sub.startsWith('**') && sub.endsWith('**')) {
          return (
            <strong key={idx} className="font-bold text-emerald-400">
              {sub.slice(2, -2)}
            </strong>
          );
        }
        return sub;
      });
    });

    // Process code `inline`
    parts = parts.flatMap((part) => {
      if (typeof part !== 'string') return [part];
      const subParts = part.split(/(`[^`]+`)/g);
      return subParts.map((sub, idx) => {
        if (sub.startsWith('`') && sub.endsWith('`')) {
          return (
            <code
              key={idx}
              className="bg-zinc-800 text-emerald-300 px-1.5 py-0.5 rounded text-sm font-mono"
            >
              {sub.slice(1, -1)}
            </code>
          );
        }
        return sub;
      });
    });

    return <>{parts}</>;
  };

  return (
    <div
      className={`print-slide w-full h-full flex flex-col justify-between p-8 md:p-12 select-none ${getThemeClasses()} ${getTransitionCssClass(transition)} ${
        isFullscreen ? 'rounded-none' : 'rounded-2xl border'
      }`}
    >
      {/* Top Header / Badge */}
      <div className="flex items-center justify-between w-full mb-4">
        {slide.headerBadge ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {slide.headerBadge}
          </span>
        ) : (
          <div></div>
        )}
        <div className="text-xs font-mono text-zinc-500 tracking-wider">
          SLIDE #{slide.id}
        </div>
      </div>

      {/* Main Slide Content */}
      <div className="flex-1 flex flex-col justify-center items-center overflow-y-auto max-h-[80vh] w-full">
        {renderMarkdownContent(slide.body)}
      </div>

      {/* Slide Footer */}
      <div className="flex items-center justify-between w-full pt-4 mt-4 border-t border-zinc-800/40 text-xs text-zinc-500">
        <span>Garden Slides Suite</span>
        <span>Pressione [Espaço] ou [→] para avançar</span>
      </div>
    </div>
  );
};
