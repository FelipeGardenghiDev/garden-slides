import React, { useState, useEffect } from 'react';
import { SlideData, SlideTheme } from '../types';
import { SlideRenderer } from './SlideRenderer';
import { Play, Pause, RotateCcw, Clock, ArrowLeft, ArrowRight, X } from 'lucide-react';

interface PresenterModeProps {
  slides: SlideData[];
  currentIndex: number;
  theme: SlideTheme;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

export const PresenterMode: React.FC<PresenterModeProps> = ({
  slides,
  currentIndex,
  theme,
  onNext,
  onPrev,
  onClose,
}) => {
  // Presentation stopwatch
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Clock tick
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Timer tick
  useEffect(() => {
    let timer: any = null;
    if (isRunning) {
      timer = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const formatTimer = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentSlide = slides[currentIndex];
  const nextSlide = currentIndex < slides.length - 1 ? slides[currentIndex + 1] : null;

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 text-zinc-100 flex flex-col font-sans select-none">
      {/* Top Bar with Timers and Controls */}
      <div className="h-16 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold tracking-tight text-emerald-400 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            Modo Apresentador (Staff View)
          </span>
          <span className="text-sm font-mono text-zinc-400 bg-zinc-800 px-3 py-1 rounded-md">
            Slide {currentIndex + 1} de {slides.length}
          </span>
        </div>

        {/* Stopwatch & Wall Clock */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg font-mono">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span className="text-zinc-400 text-xs">HORA:</span>
            <span className="font-semibold text-zinc-200 text-sm">{currentTime}</span>
          </div>

          <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 px-4 py-1.5 rounded-lg font-mono">
            <span className="text-zinc-400 text-xs">CRONÔMETRO:</span>
            <span className="font-bold text-lg text-emerald-400">
              {formatTimer(secondsElapsed)}
            </span>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="p-1 hover:text-emerald-400 transition"
              title={isRunning ? 'Pausar' : 'Iniciar'}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                setIsRunning(false);
                setSecondsElapsed(0);
              }}
              className="p-1 hover:text-zinc-300 transition"
              title="Resetar"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-500 hover:text-zinc-300" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-300 transition font-medium"
          >
            <X className="w-4 h-4" />
            Sair (Esc)
          </button>
        </div>
      </div>

      {/* Main Dual Grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 p-6 overflow-hidden">
        {/* Left Column: Current Slide (Large) */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 uppercase tracking-wider font-semibold">
            <span>Slide Atual no Telão</span>
            <span className="text-emerald-400 font-mono">Ao Vivo</span>
          </div>
          <div className="flex-1 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl bg-zinc-900/40 relative">
            <SlideRenderer slide={currentSlide} theme={theme} />
          </div>

          {/* Navigation bar below slide */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={onPrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm transition"
            >
              <ArrowLeft className="w-4 h-4" /> Anterior
            </button>
            <div className="text-sm font-mono text-zinc-500">
              {currentIndex + 1} / {slides.length}
            </div>
            <button
              onClick={onNext}
              disabled={currentIndex === slides.length - 1}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm transition text-white"
            >
              Próximo <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Next Slide Preview & Speaker Notes */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          {/* Next Slide Preview */}
          <div className="flex flex-col gap-2 h-44">
            <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
              Próximo Slide
            </span>
            <div className="flex-1 border border-zinc-800/80 rounded-xl overflow-hidden bg-zinc-900/60 p-4 flex flex-col justify-center">
              {nextSlide ? (
                <div>
                  <h4 className="font-bold text-zinc-200 text-sm mb-1">{nextSlide.title}</h4>
                  <p className="text-xs text-zinc-400 line-clamp-2">{nextSlide.body}</p>
                </div>
              ) : (
                <div className="text-center text-zinc-500 text-sm">Fim da apresentação</div>
              )}
            </div>
          </div>

          {/* Speaker Notes */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                📝 Notas do Orador (Privado)
              </span>
              <span className="text-xs text-zinc-500">Visível apenas nesta tela</span>
            </div>

            <div className="flex-1 border border-emerald-950/60 rounded-xl bg-zinc-900/90 p-6 overflow-y-auto text-zinc-200 leading-relaxed text-base md:text-lg">
              {currentSlide.notes ? (
                <div className="whitespace-pre-line font-medium text-zinc-100">
                  {currentSlide.notes}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-500 italic text-sm">
                  Nenhuma nota de orador configurada para este slide. Adicione notas separando com
                  '???' no markdown.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
