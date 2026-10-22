import React, { useState, useEffect, useMemo, useRef } from 'react';
import { parsePresentation } from './core/slide-parser';
import { TEMPLATES } from './core/templates';
import { SlideTheme, SlideTransition } from './types';
import { generatePresenterQrSvg } from './core/slide-parser';
import { SlideRenderer } from './components/SlideRenderer';
import { PresenterMode } from './components/PresenterMode';
import {
  Play,
  Monitor,
  Edit3,
  Printer,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Download,
  Upload,
  Palette,
  Sparkles,
  FileText,
  Share2,
  QrCode,
  Layers,
  X
} from 'lucide-react';

const STORAGE_KEY = 'garden_slides_content_v1';
const THEME_KEY = 'garden_slides_theme_v1';

export const App: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || TEMPLATES[0].markdown;
  });

  const [theme, setTheme] = useState<SlideTheme>(() => {
    return (localStorage.getItem(THEME_KEY) as SlideTheme) || 'emerald';
  });

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'editor' | 'presentation' | 'presenter'>('editor');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedAlert, setCopiedAlert] = useState(false);
  const [transition, setTransition] = useState<SlideTransition>('fade');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse slides
  const slides = useMemo(() => {
    return parsePresentation(markdown);
  }, [markdown]);

  // Ensure current slide index is valid
  useEffect(() => {
    if (currentSlideIndex >= slides.length) {
      setCurrentSlideIndex(Math.max(0, slides.length - 1));
    }
  }, [slides.length, currentSlideIndex]);

  // Persist to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, markdown);
  }, [markdown]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in textarea
      if (
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'INPUT'
      ) {
        if (e.key === 'Escape') {
          (document.activeElement as HTMLElement).blur();
        }
        return;
      }

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Home') {
        e.preventDefault();
        setCurrentSlideIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setCurrentSlideIndex(slides.length - 1);
      } else if (e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setViewMode((prev) => (prev === 'presenter' ? 'presentation' : 'presenter'));
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        if (viewMode === 'presenter') {
          setViewMode('presentation');
        } else if (viewMode === 'presentation' && isFullscreen) {
          exitFullscreen();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, viewMode, isFullscreen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setIsFullscreen(false);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `garden-slides-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setMarkdown(text);
        setCurrentSlideIndex(0);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleShare = () => {
    navigator.clipboard.writeText(markdown);
    setCopiedAlert(true);
    setTimeout(() => setCopiedAlert(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Application Toolbar (Hidden in Print & Presenter) */}
      <header className="no-print h-14 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur px-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <span className="text-xl">📽️</span>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-sm tracking-tight text-zinc-100">Garden Slides</h1>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Staff Deck
            </span>
          </div>

          <div className="h-4 w-px bg-zinc-800 mx-2 hidden sm:block"></div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
            <button
              onClick={() => setViewMode('editor')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition ${
                viewMode === 'editor'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Editor</span>
            </button>
            <button
              onClick={() => setViewMode('presentation')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition ${
                viewMode === 'presentation'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Apresentação</span>
            </button>
            <button
              onClick={() => setViewMode('presenter')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition ${
                viewMode === 'presenter'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Atalho: tecla 'P'"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Orador (P)</span>
            </button>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2">
          {/* Template presets */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 transition">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Modelos</span>
            </button>
            <div className="absolute right-0 mt-1 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-2 hidden group-hover:flex flex-col gap-1 z-30">
              <div className="text-[10px] uppercase font-semibold text-zinc-500 px-2 py-1">
                Modelos de Apresentação
              </div>
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => {
                    if (confirm(`Carregar modelo "${tpl.name}"? O conteúdo atual será substituído.`)) {
                      setMarkdown(tpl.markdown);
                      setCurrentSlideIndex(0);
                    }
                  }}
                  className="text-left px-2.5 py-2 rounded-lg hover:bg-zinc-800 text-xs text-zinc-300 transition flex flex-col gap-0.5"
                >
                  <span className="font-semibold text-zinc-100">{tpl.name}</span>
                  <span className="text-[10px] text-zinc-400 line-clamp-1">{tpl.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Theme selector */}
          <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-1 text-xs">
            <Palette className="w-3.5 h-3.5 text-zinc-400 ml-1 mr-1" />
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as SlideTheme)}
              className="bg-transparent text-xs text-zinc-300 focus:outline-none cursor-pointer pr-1"
            >
              <option value="emerald" className="bg-zinc-900">Emerald Studio</option>
              <option value="dark" className="bg-zinc-900">Dark Velvet</option>
              <option value="cyber" className="bg-zinc-900">Cyber Neon</option>
              <option value="light" className="bg-zinc-900">Clean Light</option>
            </select>
          </div>

          {/* Transition selector */}
          <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-1 text-xs">
            <Layers className="w-3.5 h-3.5 text-zinc-400 ml-1 mr-1" />
            <select
              value={transition}
              onChange={(e) => setTransition(e.target.value as SlideTransition)}
              className="bg-transparent text-xs text-zinc-300 focus:outline-none cursor-pointer pr-1"
              title="Transição de Slides"
            >
              <option value="fade" className="bg-zinc-900">Fade Suave</option>
              <option value="slide" className="bg-zinc-900">Slide Horizontal</option>
              <option value="zoom" className="bg-zinc-900">Zoom Pop</option>
              <option value="flip3d" className="bg-zinc-900">Flip 3D</option>
            </select>
          </div>

          {/* QR Remote Controller button */}
          <button
            onClick={() => setIsQrModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-cyan-300 transition cursor-pointer"
            title="Controle Remoto via Celular (QR Code)"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Remoto</span>
          </button>

          {/* Export PDF / Print */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 transition"
            title="Exportar apresentação para PDF via impressão"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PDF</span>
          </button>

          {/* Download MD */}
          <button
            onClick={handleDownloadMarkdown}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
            title="Baixar arquivo Markdown (.md)"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Upload MD */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
            title="Importar arquivo Markdown"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".md,.txt"
            className="hidden"
          />

          {/* Share / Copy */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition relative"
            title="Copiar Markdown para Área de Transferência"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copiedAlert && (
              <span className="absolute -bottom-8 right-0 bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded shadow">
                Copiado!
              </span>
            )}
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
            title="Tela Cheia (F)"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content Areas */}
      {viewMode === 'presenter' ? (
        <PresenterMode
          slides={slides}
          currentIndex={currentSlideIndex}
          theme={theme}
          onNext={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
          onPrev={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
          onClose={() => setViewMode('presentation')}
        />
      ) : viewMode === 'editor' ? (
        /* Split Pane Editor */
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Pane: Markdown Textarea */}
          <div className="w-full md:w-1/2 h-1/2 md:h-full border-r border-zinc-800 flex flex-col bg-zinc-950">
            <div className="h-9 px-4 border-b border-zinc-800/80 bg-zinc-900/50 flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 font-medium">
                <FileText className="w-3.5 h-3.5 text-emerald-400" /> Editor Markdown
              </span>
              <span className="font-mono text-[11px] text-zinc-500">
                Delimite slides com '---' e notas com '???'
              </span>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Digite sua apresentação em Markdown..."
              className="flex-1 p-4 bg-zinc-950 font-mono text-sm text-zinc-200 resize-none focus:outline-none selection:bg-emerald-500 selection:text-white leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* Right Pane: Live Slide Preview */}
          <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-zinc-900/30 p-4 overflow-hidden">
            <div className="flex-1 flex flex-col justify-center items-center relative rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
              <SlideRenderer
                slide={slides[currentSlideIndex] || slides[0]}
                theme={theme}
              />
            </div>

            {/* Bottom mini-bar */}
            <div className="flex items-center justify-between pt-3 px-2 text-xs">
              <button
                onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentSlideIndex === 0}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed font-medium transition"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>
              <div className="font-mono text-zinc-400 font-semibold">
                Slide {currentSlideIndex + 1} de {slides.length}
              </div>
              <button
                onClick={() =>
                  setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))
                }
                disabled={currentSlideIndex === slides.length - 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed font-medium transition text-white"
              >
                Próximo <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Full Presentation Mode */
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative bg-zinc-950">
          <div className="w-full max-w-6xl aspect-[16/10] max-h-[85vh] flex items-center justify-center shadow-2xl rounded-2xl overflow-hidden relative">
            <SlideRenderer
              slide={slides[currentSlideIndex] || slides[0]}
              theme={theme}
              isFullscreen={isFullscreen}
              transition={transition}
            />
          </div>

          {/* Floating On-Screen Navigation Controls */}
          <div className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900/90 border border-zinc-800/80 backdrop-blur-md rounded-2xl px-4 py-2 flex items-center gap-4 shadow-2xl">
            <button
              onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentSlideIndex === 0}
              className="p-1.5 rounded-xl hover:bg-zinc-800 text-zinc-300 disabled:opacity-30 transition"
              title="Slide Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="font-mono text-xs font-semibold text-zinc-300 min-w-16 text-center">
              {currentSlideIndex + 1} / {slides.length}
            </span>

            <button
              onClick={() =>
                setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))
              }
              disabled={currentSlideIndex === slides.length - 1}
              className="p-1.5 rounded-xl hover:bg-zinc-800 text-zinc-300 disabled:opacity-30 transition"
              title="Próximo Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="h-4 w-px bg-zinc-800"></div>

            <button
              onClick={() => setViewMode('presenter')}
              className="px-2.5 py-1 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 text-xs font-medium transition"
              title="Modo Orador com Cronômetro e Notas"
            >
              Orador (P)
            </button>
          </div>
        </div>
      )}

      {/* Hidden Print Container: Renders ALL slides for PDF printing */}
      <div className="hidden print:block">
        {slides.map((slide) => (
          <SlideRenderer key={slide.id} slide={slide} theme={theme} />
        ))}
      </div>
      {/* QR Code Remote Control Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm no-print">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl flex flex-col items-center gap-4 text-center">
            <div className="flex items-center justify-between w-full border-b border-zinc-800 pb-2">
              <h3 className="font-semibold text-sm text-zinc-100 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-400" />
                Controle Remoto do Apresentador
              </h3>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 shadow-inner"
              dangerouslySetInnerHTML={{ __html: generatePresenterQrSvg(typeof window !== 'undefined' ? window.location.href : 'garden-slides') }}
            />

            <div className="text-xs text-zinc-400">
              <p className="font-semibold text-zinc-200">Aponte a câmera do seu celular</p>
              <p className="text-[11px] text-zinc-500 mt-1">
                Conecte-se na mesma rede Wi-Fi para avançar e retroceder slides sem fios.
              </p>
            </div>

            <button
              onClick={() => setIsQrModalOpen(false)}
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
