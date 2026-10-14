import React, { useState } from 'react';
import { PlayMetadata, Character, ScriptLine } from '../types/theatre';
import { 
  Users, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  HelpCircle, 
  RotateCcw, 
  Volume2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ActorRehearsalModeProps {
  play: PlayMetadata;
  initialCharacterId?: string;
  onBackToReader: () => void;
}

export const ActorRehearsalMode: React.FC<ActorRehearsalModeProps> = ({
  play,
  initialCharacterId,
  onBackToReader,
}) => {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>(
    initialCharacterId || play.characters[0]?.id || ''
  );
  const [hideMyLines, setHideMyLines] = useState<boolean>(true);
  const [revealedLineIds, setRevealedLineIds] = useState<Record<string, boolean>>({});
  const [masteredLineIds, setMasteredLineIds] = useState<Record<string, boolean>>({});
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  const selectedCharacter: Character | undefined = play.characters.find(
    (c) => c.id === selectedCharacterId
  );
  const activeScene = play.scenes[activeSceneIndex] || play.scenes[0];

  // Filter dialogue lines belonging to selected character vs others
  const myLinesInScene = activeScene.lines.filter(
    (l) => l.characterId === selectedCharacterId && l.type === 'dialogue'
  );

  const masteredCount = myLinesInScene.filter((l) => masteredLineIds[l.id]).length;
  const progressPercent = myLinesInScene.length > 0
    ? Math.round((masteredCount / myLinesInScene.length) * 100)
    : 0;

  const toggleReveal = (lineId: string) => {
    setRevealedLineIds((prev) => ({
      ...prev,
      [lineId]: !prev[lineId],
    }));
  };

  const toggleMastered = (lineId: string) => {
    setMasteredLineIds((prev) => ({
      ...prev,
      [lineId]: !prev[lineId],
    }));
  };

  const resetRehearsal = () => {
    setRevealedLineIds({});
    setMasteredLineIds({});
  };

  const speakCue = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'ar-SA';
    utt.rate = 0.95;
    window.speechSynthesis.speak(utt);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Navigation & Title */}
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
              <span>استوديو التلقين والبروفة</span>
              <span aria-hidden="true">·</span>
              <span>حفظ الأدوار والتحضير للخشبة</span>
            </div>
            <h2 className="text-xl font-bold font-amiri text-stone-100">
              بروفة الممثل: {selectedCharacter?.name || 'اختر شخصية'}
            </h2>
          </div>
        </div>

        {/* Character Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-stone-400">دورك:</span>
          {play.characters.map((char) => (
            <button
              key={char.id}
              onClick={() => {
                setSelectedCharacterId(char.id);
                setRevealedLineIds({});
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedCharacterId === char.id
                  ? 'bg-amber-400 text-stone-950 font-bold shadow'
                  : 'bg-stone-800 text-stone-300 hover:text-white'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: char.color }}
              />
              <span>{char.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Actor Psychology & Cueing Card */}
      {selectedCharacter && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-stone-900/60 border border-stone-800 text-xs">
          <div className="space-y-1">
            <span className="text-stone-400 font-medium">الوصف والملامح المسرحية:</span>
            <p className="text-stone-200 leading-relaxed">{selectedCharacter.description}</p>
          </div>
          <div className="space-y-1 border-r md:border-r border-stone-800 pr-0 md:pr-4">
            <span className="text-amber-400 font-medium">الدوافع والحالة الباطنية:</span>
            <p className="text-stone-300 leading-relaxed">{selectedCharacter.psychology}</p>
          </div>
          <div className="space-y-1 border-r md:border-r border-stone-800 pr-0 md:pr-4">
            <span className="text-sky-400 font-medium">النبرة وإيقاع الحوار:</span>
            <p className="text-stone-300 leading-relaxed">{selectedCharacter.voiceTone}</p>
          </div>
        </div>
      )}

      {/* Rehearsal Mode Settings & Progress */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-stone-900/90 border border-stone-800">
        {/* Scene Selection */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-stone-400">المشهد الحالي:</span>
          {play.scenes.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveSceneIndex(idx);
                setRevealedLineIds({});
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                idx === activeSceneIndex
                  ? 'bg-stone-700 text-white font-bold'
                  : 'bg-stone-800/60 text-stone-400 hover:text-stone-200'
              }`}
            >
              المشهد {s.sceneNumber}
            </button>
          ))}
        </div>

        {/* Practice Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setHideMyLines(!hideMyLines)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              hideMyLines
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-stone-800 text-stone-300 border-stone-700'
            }`}
          >
            {hideMyLines ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{hideMyLines ? 'وضع التلقين (سطوري مخفية)' : 'إظهار سطوري كاملة'}</span>
          </button>

          <button
            onClick={resetRehearsal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-stone-400 hover:text-stone-200 bg-stone-800 transition-colors cursor-pointer"
            title="إعادة ضبط التقدم"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة التلقين</span>
          </button>
        </div>
      </div>

      {/* Progress Strip */}
      <div className="p-3 rounded-lg bg-stone-900/60 border border-stone-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="text-stone-400">نسبة إتقان سطور هذا المشهد:</span>
          <span className="font-mono font-bold text-amber-400">
            {masteredCount} من {myLinesInScene.length} جمل ({progressPercent}%)
          </span>
        </div>
        <div className="w-48 bg-stone-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-amber-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Rehearsal Script Feed */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {activeScene.lines.map((line, idx) => {
          const isMyTurn = line.characterId === selectedCharacterId && line.type === 'dialogue';
          const isRevealed = revealedLineIds[line.id];
          const isMastered = masteredLineIds[line.id];

          // Didascalia cue
          if (line.type === 'didascalia') {
            return (
              <div
                key={line.id}
                className="py-2 px-3 rounded-md bg-stone-900/40 border border-stone-800/60 text-xs text-stone-400 italic"
              >
                <span className="not-italic text-stone-500 ml-2 font-mono">[إرشاد]:</span>
                {line.text}
              </div>
            );
          }

          // Counter-Actor's line (The Cue / المثير المسرحي)
          if (!isMyTurn) {
            return (
              <div
                key={line.id}
                className="p-4 rounded-xl bg-stone-900/40 border border-stone-800 text-stone-300 space-y-1 transition-opacity opacity-75 hover:opacity-100"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-400">
                    {line.characterName} (مثير حواري):
                  </span>
                  <button
                    onClick={() => speakCue(line.text)}
                    className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>تلقين الجملة</span>
                  </button>
                </div>
                {line.stageDirection && (
                  <p className="text-xs text-stone-500 italic">({line.stageDirection})</p>
                )}
                <p className="font-amiri text-base leading-relaxed text-stone-300">{line.text}</p>
              </div>
            );
          }

          // MY LINE (Actor's Target)
          return (
            <div
              key={line.id}
              className={`p-5 rounded-2xl border transition-all ${
                isMastered
                  ? 'bg-emerald-950/20 border-emerald-600/40'
                  : 'bg-amber-950/20 border-amber-600/40 shadow-md'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-400 text-stone-950 font-amiri">
                    دورك: {selectedCharacter?.name}
                  </span>
                  {line.stageDirection && (
                    <span className="text-xs text-amber-300/80 italic font-sans">
                      ({line.stageDirection})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Mark as Mastered button */}
                  <button
                    onClick={() => toggleMastered(line.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      isMastered
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isMastered ? 'تم إتقان الجملة' : 'حدد كمتقن'}</span>
                  </button>
                </div>
              </div>

              {/* Spoken content: either hidden with reveal button or visible */}
              {hideMyLines && !isRevealed ? (
                <div className="my-3 p-4 rounded-xl bg-stone-900 border border-stone-800 text-center space-y-2">
                  <p className="text-xs text-stone-400">
                    استحضر جملتك الآن بعد سماعك لمثير المشهد أعلاه...
                  </p>
                  <button
                    onClick={() => toggleReveal(line.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>كشف النص للتحقق من الحفظ</span>
                  </button>
                </div>
              ) : (
                <div className="my-2 p-3 rounded-lg bg-stone-900/60 border border-stone-800 space-y-2">
                  <p className="font-amiri text-lg leading-loose text-stone-100 font-medium">
                    {line.text}
                  </p>
                  {hideMyLines && isRevealed && (
                    <button
                      onClick={() => toggleReveal(line.id)}
                      className="text-xs text-stone-400 hover:text-stone-200 underline cursor-pointer"
                    >
                      إعادة إخفاء النص للمحاولة مرة ثانية
                    </button>
                  )}
                </div>
              )}

              {/* Subtext advice */}
              {line.subtext && (
                <div className="mt-3 pt-2 border-t border-stone-800 text-xs text-purple-300 flex items-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-purple-200">الدافع الباطني للشخصية: </strong>
                    {line.subtext}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
