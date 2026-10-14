import React, { useState } from 'react';
import { Scene, Character, SceneBlocking } from '../types/theatre';
import { Compass, Users, Sparkles, Move, ArrowRight, Lightbulb } from 'lucide-react';

interface StageBlockingVisualizerProps {
  scene: Scene;
  characters: Character[];
  onBackToReader: () => void;
}

export const StageBlockingVisualizer: React.FC<StageBlockingVisualizerProps> = ({
  scene,
  characters,
  onBackToReader,
}) => {
  const [activeBeatIndex, setActiveBeatIndex] = useState(0);

  const blockings = scene.blockings && scene.blockings.length > 0
    ? scene.blockings
    : [
        {
          beatNumber: 1,
          description: 'توزيع الخشبة الأساسي للمشهد',
          lightingFocus: 'إضاءة مركزية متوازنة',
          positions: characters.map((c, i) => ({
            characterId: c.id,
            x: c.stageInitPosition?.x ?? 25 + i * 25,
            y: c.stageInitPosition?.y ?? 50,
            facing: 'audience' as const,
            action: c.stageInitPosition?.label ?? 'واقف على الخشبة'
          }))
        }
      ];

  const currentBlocking: SceneBlocking = blockings[activeBeatIndex] || blockings[0];

  return (
    <div className="space-y-6">
      {/* Header and Scene Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-stone-900/80 border border-stone-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToReader}
            className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
            title="العودة للنص المسرحي"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <span>مخطط السينوغرافيا والميزانسين</span>
              <span aria-hidden="true">·</span>
              <span>{scene.title}</span>
            </div>
            <h2 className="text-xl font-bold font-amiri text-stone-100">
              توزيع حركة الممثلين على الخشبة (Stage Blocking)
            </h2>
          </div>
        </div>

        {/* Beats Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400">الحركات الدرامية (Beats):</span>
          {blockings.map((b, idx) => (
            <button
              key={idx}
              onClick={() => setActiveBeatIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                idx === activeBeatIndex
                  ? 'bg-amber-400 text-stone-950 font-bold shadow'
                  : 'bg-stone-800 text-stone-300 hover:text-white'
              }`}
            >
              حركة {b.beatNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Beat Description & Lighting Focus */}
      <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 text-xs space-y-2">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <strong className="text-amber-300">الدافع الإخراجي للحركة: </strong>
            <span className="text-stone-200 leading-relaxed">
              {currentBlocking.description}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-stone-800 text-stone-400">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <strong className="text-stone-300">تركيز الإضاءة: </strong>
          <span>{currentBlocking.lightingFocus}</span>
        </div>
      </div>

      {/* The 2D Stage Floor Simulator (منظور الخشبة من الأعلى) */}
      <div className="relative rounded-2xl border-2 border-stone-700 bg-gradient-to-b from-[#181412] to-[#241c19] p-6 shadow-2xl overflow-hidden min-h-[460px] flex flex-col justify-between">
        {/* Stage Depth Cues */}
        <div className="absolute top-2 inset-x-0 flex items-center justify-between px-6 text-[11px] font-mono tracking-widest text-stone-500 border-b border-stone-800/80 pb-1">
          <span>عمق المسرح يساراً (Upstage Left)</span>
          <span className="text-stone-400 font-bold uppercase">خلفية المسرح (عمق الخشبة / Backdrop)</span>
          <span>عمق المسرح يميناً (Upstage Right)</span>
        </div>

        {/* Set elements in background */}
        <div className="relative flex-1 my-8">
          {/* Virtual Props and Landmarks */}
          <div className="absolute top-4 left-1/4 -translate-x-1/2 p-2 rounded border border-dashed border-stone-700 bg-stone-900/40 text-[11px] text-stone-400 text-center">
            منضدة الناظر والفانوس
          </div>

          <div className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 p-2 rounded border border-dashed border-stone-700 bg-stone-900/40 text-[11px] text-stone-400 text-center">
            المقعد الخشبي العتيق
          </div>

          <div className="absolute top-2 right-12 p-1.5 rounded border border-dashed border-stone-700 bg-stone-900/40 text-[10px] text-stone-400 text-center">
            لوحة المواعيد
          </div>

          {/* Actor Stage Nodes */}
          {currentBlocking.positions.map((pos) => {
            const char = characters.find((c) => c.id === pos.characterId);
            if (!char) return null;

            return (
              <div
                key={pos.characterId}
                className="absolute transition-all duration-700 ease-out flex flex-col items-center group -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                }}
              >
                {/* Visual Avatar Halo */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-lg ring-4 ring-black/40 group-hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: char.color }}
                >
                  {char.name.slice(0, 2)}
                </div>

                {/* Character Name & Action Badge */}
                <div className="mt-1 px-2.5 py-1 rounded-md bg-stone-950/90 border border-stone-700 text-stone-200 text-[11px] font-amiri font-bold text-center shadow whitespace-nowrap max-w-[160px] truncate">
                  {char.name}
                </div>

                <div className="text-[10px] text-amber-300 font-sans text-center max-w-[180px] bg-stone-900/90 px-1.5 py-0.5 rounded border border-stone-800 mt-0.5 leading-tight">
                  {pos.action}
                </div>
              </div>
            );
          })}
        </div>

        {/* Proscenium Arch / Apron & Audience Zone */}
        <div className="border-t-2 border-stone-700 pt-3 flex flex-col items-center text-center">
          <div className="flex items-center justify-between w-full px-6 text-[11px] font-mono tracking-widest text-stone-500 mb-1">
            <span>مقدمة المسرح يساراً (Downstage Left)</span>
            <span className="text-amber-400/90 font-bold uppercase">قوس المسرح / حافة الخشبة (The Apron)</span>
            <span>مقدمة المسرح يميناً (Downstage Right)</span>
          </div>
          <div className="w-full py-1.5 bg-stone-900/90 rounded-md border border-stone-800 text-stone-400 text-xs font-serif tracking-wider">
            ▼ الصالة والجمهور (Audience & House) ▼
          </div>
        </div>
      </div>

      {/* Director's Blocking Notes Breakdown */}
      <div className="p-4 rounded-xl bg-stone-900/70 border border-stone-800 space-y-3">
        <h3 className="font-bold text-stone-200 font-amiri text-base flex items-center gap-2">
          <Move className="w-4 h-4 text-amber-400" />
          <span>ملاحظات الميزانسين والحركة المسرحية للممثلين:</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {currentBlocking.positions.map((pos) => {
            const char = characters.find((c) => c.id === pos.characterId);
            if (!char) return null;
            return (
              <div
                key={pos.characterId}
                className="p-3 rounded-lg bg-stone-950/60 border border-stone-800/80 space-y-1 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: char.color }}
                  />
                  <strong className="text-stone-100 font-amiri text-sm">{char.name}</strong>
                </div>
                <p className="text-stone-300">
                  <span className="text-stone-500">الحركة والفعل: </span>
                  {pos.action}
                </p>
                <p className="text-stone-400 text-[11px]">
                  <span className="text-stone-500">الموقع على الخشبة: </span>
                  X: {pos.x}% · Y: {pos.y}%
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
