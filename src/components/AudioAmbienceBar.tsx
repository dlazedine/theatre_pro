import React, { useState } from 'react';
import { Volume2, VolumeX, CloudRain, Clock, Bell, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export const AudioAmbienceBar: React.FC = () => {
  const [isRain, setIsRain] = useState(false);
  const [isClock, setIsClock] = useState(false);
  const [isKnocking, setIsKnocking] = useState(false);

  const handleTroisCoups = () => {
    if (isKnocking) return;
    setIsKnocking(true);
    soundEngine.playTroisCoups(() => {
      setIsKnocking(false);
    });
  };

  const toggleRain = () => {
    const newState = soundEngine.toggleRainWind(!isRain);
    setIsRain(newState);
  };

  const toggleClock = () => {
    const newState = soundEngine.toggleClock(!isClock);
    setIsClock(newState);
  };

  return (
    <div className="bg-stone-900/90 border-b border-stone-800/80 px-6 py-2.5 text-xs text-stone-300 flex flex-wrap items-center justify-between gap-4">
      {/* Informational unboxed metadata with separators */}
      <div className="flex items-center gap-2 text-stone-400">
        <span className="text-amber-400 font-medium">الأجواء المسرحية الحية</span>
        <span aria-hidden="true">·</span>
        <span>مؤثرات صوتية محيطية لخلق حضور الخشبة</span>
      </div>

      {/* Interactive Ambience Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={handleTroisCoups}
          disabled={isKnocking}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs transition-colors cursor-pointer ${
            isKnocking
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
              : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700'
          }`}
          title="الضربات الخشبية الثلاث التقليدية لبدء العرض المسرحي"
        >
          <Bell className="w-3.5 h-3.5 text-amber-400" />
          <span>ضربات الخشبة الثلاث</span>
        </button>

        <button
          onClick={toggleRain}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs transition-colors cursor-pointer ${
            isRain
              ? 'bg-sky-950/60 text-sky-300 border-sky-600/50'
              : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700'
          }`}
        >
          <CloudRain className="w-3.5 h-3.5 text-sky-400" />
          <span>عاصفة المطر والريح</span>
          {isRain ? <Volume2 className="w-3 h-3 text-sky-400" /> : <VolumeX className="w-3 h-3 text-stone-500" />}
        </button>

        <button
          onClick={toggleClock}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs transition-colors cursor-pointer ${
            isClock
              ? 'bg-amber-950/60 text-amber-300 border-amber-600/50'
              : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>دقات ساعة المحطة</span>
          {isClock ? <Volume2 className="w-3 h-3 text-amber-400" /> : <VolumeX className="w-3 h-3 text-stone-500" />}
        </button>

        <button
          onClick={() => soundEngine.playTrainWhistle()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-stone-700 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>صفير القطار البعيد</span>
        </button>
      </div>
    </div>
  );
};
