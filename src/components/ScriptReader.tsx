import React, { useState, useEffect } from 'react';
import { PlayMetadata, Scene, ScriptLine } from '../types/theatre';
import { 
  Printer, 
  Volume2, 
  Square, 
  Users, 
  Eye, 
  EyeOff, 
  Type, 
  BookOpen, 
  Compass, 
  Sparkles,
  Info
} from 'lucide-react';

interface ScriptReaderProps {
  play: PlayMetadata;
  allPlays: PlayMetadata[];
  onSelectPlay: (playId: string) => void;
  onOpenBlocking: (scene: Scene) => void;
  onOpenRehearsal: (characterId: string) => void;
}

export const ScriptReader: React.FC<ScriptReaderProps> = ({
  play,
  allPlays,
  onSelectPlay,
  onOpenBlocking,
  onOpenRehearsal,
}) => {
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [paperTheme, setPaperTheme] = useState<'dark' | 'parchment' | 'light'>('dark');
  const [fontSize, setFontSize] = useState<'md' | 'lg' | 'xl'>('lg');
  const [showDidascalia, setShowDidascalia] = useState(true);
  const [showSubtext, setShowSubtext] = useState(false);
  const [highlightCharacterId, setHighlightCharacterId] = useState<string>('all');
  const [showCastSheet, setShowCastSheet] = useState(false);
  const [currentSpeakingLineId, setCurrentSpeakingLineId] = useState<string | null>(null);

  const activeScene = play.scenes[selectedSceneIndex] || play.scenes[0];

  // Speech synthesis for lines
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakLine = (line: ScriptLine) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (currentSpeakingLineId === line.id) {
      setCurrentSpeakingLineId(null);
      return;
    }

    const textToRead = line.type === 'dialogue'
      ? `${line.characterName}: ${line.text}`
      : line.text;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.95;

    // Pick Arabic voice if present
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(v => v.lang.startsWith('ar'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onstart = () => setCurrentSpeakingLineId(line.id);
    utterance.onend = () => setCurrentSpeakingLineId(null);
    utterance.onerror = () => setCurrentSpeakingLineId(null);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setCurrentSpeakingLineId(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Paper theme styling
  const themeStyles = {
    dark: {
      container: 'bg-[#181514] text-[#E8DFD4] border-stone-800',
      sceneHeader: 'bg-[#201C1A] border-stone-800 text-[#E8DFD4]',
      didascalia: 'text-amber-200/80 italic bg-amber-950/20 border-amber-900/30',
      monologue: 'text-sky-200/90 italic bg-sky-950/20 border-sky-900/30',
      cue: 'text-stone-400 bg-stone-900/50 border-stone-800',
      activeHighlight: 'bg-amber-950/40 ring-1 ring-amber-500/30',
      characterTag: 'text-amber-400',
    },
    parchment: {
      container: 'bg-[#F6F1E7] text-[#2D241E] border-[#E2D7C5]',
      sceneHeader: 'bg-[#EDE4D2] border-[#DCCEBA] text-[#2D241E]',
      didascalia: 'text-[#694E34] italic bg-[#EFE7D5]/80 border-[#DDD2BC]',
      monologue: 'text-[#1D4E89] italic bg-[#E8EEF5] border-[#CAD8E8]',
      cue: 'text-[#7D6B58] bg-[#EDE4D2]/60 border-[#DCCEBA]',
      activeHighlight: 'bg-[#EADBC4]/70 ring-1 ring-[#B89874]',
      characterTag: 'text-[#8A3B14]',
    },
    light: {
      container: 'bg-white text-stone-900 border-stone-200',
      sceneHeader: 'bg-stone-50 border-stone-200 text-stone-900',
      didascalia: 'text-stone-600 italic bg-stone-50 border-stone-200',
      monologue: 'text-sky-800 italic bg-sky-50 border-sky-100',
      cue: 'text-stone-500 bg-stone-50 border-stone-200',
      activeHighlight: 'bg-amber-50 ring-1 ring-amber-200',
      characterTag: 'text-stone-950 font-bold',
    },
  }[paperTheme];

  const fontSizes = {
    md: 'text-base leading-relaxed',
    lg: 'text-lg leading-loose',
    xl: 'text-xl leading-loose',
  }[fontSize];

  return (
    <div className="space-y-6">
      {/* Script & Play Switcher Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-stone-900/80 border border-stone-800">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <span>النموذج المسرحي المعروض</span>
              <span aria-hidden="true">·</span>
              <span>{play.genre}</span>
            </div>
            <h1 className="text-xl font-bold text-stone-100 font-amiri mt-0.5">
              {play.title}
            </h1>
          </div>
        </div>

        {/* Play Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {allPlays.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                onSelectPlay(p.id);
                setSelectedSceneIndex(0);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                p.id === play.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-stone-800/80 text-stone-400 hover:text-stone-200 hover:bg-stone-800 border border-transparent'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Reader Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-stone-900/60 border border-stone-800/80 text-xs">
        {/* Scene Navigation */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-stone-500 font-medium ml-1">المشهد:</span>
          {play.scenes.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => setSelectedSceneIndex(idx)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                idx === selectedSceneIndex
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-sm'
                  : 'bg-stone-800 text-stone-300 hover:text-white'
              }`}
            >
              المشهد {sc.sceneNumber}
            </button>
          ))}
        </div>

        {/* Reading Options */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Paper Theme */}
          <div className="flex items-center p-0.5 bg-stone-800 rounded-md border border-stone-700">
            <button
              onClick={() => setPaperTheme('dark')}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                paperTheme === 'dark' ? 'bg-stone-950 text-amber-300' : 'text-stone-400 hover:text-stone-200'
              }`}
              title="النمط الداكن المسرحي"
            >
              مخملي
            </button>
            <button
              onClick={() => setPaperTheme('parchment')}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                paperTheme === 'parchment' ? 'bg-[#EDE4D2] text-[#2D241E] font-medium' : 'text-stone-400 hover:text-stone-200'
              }`}
              title="ورق المخطوطات القديم"
            >
              مخطوط
            </button>
            <button
              onClick={() => setPaperTheme('light')}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                paperTheme === 'light' ? 'bg-white text-stone-950 font-medium' : 'text-stone-400 hover:text-stone-200'
              }`}
              title="طباعي أبيض ناصع"
            >
              أبيض
            </button>
          </div>

          {/* Font Size */}
          <div className="flex items-center p-0.5 bg-stone-800 rounded-md border border-stone-700">
            <button
              onClick={() => setFontSize('md')}
              className={`px-2 py-1 rounded text-xs cursor-pointer ${fontSize === 'md' ? 'bg-stone-700 text-white' : 'text-stone-400'}`}
              title="خط عادي"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('lg')}
              className={`px-2 py-1 rounded text-xs cursor-pointer ${fontSize === 'lg' ? 'bg-stone-700 text-white' : 'text-stone-400'}`}
              title="خط متوسط"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('xl')}
              className={`px-2 py-1 rounded text-xs cursor-pointer ${fontSize === 'xl' ? 'bg-stone-700 text-white' : 'text-stone-400'}`}
              title="خط كبير"
            >
              A+
            </button>
          </div>

          {/* Didascalia Toggle */}
          <button
            onClick={() => setShowDidascalia(!showDidascalia)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs transition-colors cursor-pointer ${
              showDidascalia
                ? 'bg-stone-800 text-amber-300 border-stone-700'
                : 'bg-stone-800/50 text-stone-500 border-stone-800 line-through'
            }`}
            title="إظهار أو إخفاء الإرشادات الإخراجية"
          >
            {showDidascalia ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>الإرشادات</span>
          </button>

          {/* Subtext Toggle */}
          <button
            onClick={() => setShowSubtext(!showSubtext)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs transition-colors cursor-pointer ${
              showSubtext
                ? 'bg-purple-950/60 text-purple-300 border-purple-700/50'
                : 'bg-stone-800 text-stone-400 border-stone-700'
            }`}
            title="إظهار النوايا الدرامية الباطنية (Subtext)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>السبتكست</span>
          </button>

          {/* Character Highlight Filter */}
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={highlightCharacterId}
              onChange={(e) => setHighlightCharacterId(e.target.value)}
              aria-label="تظليل دور الشخصية"
              className="bg-stone-800 border border-stone-700 text-stone-200 rounded-md px-2 py-1 text-xs focus:outline-none focus:border-amber-400"
            >
              <option value="all">كل الأدوار</option>
              {play.characters.map((c) => (
                <option key={c.id} value={c.id}>
                  دور: {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs transition-colors cursor-pointer no-print"
            title="طباعة النص أو حفظه كملف PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة</span>
          </button>
        </div>
      </div>

      {/* Dramatis Personae (بطاقة الشخصيات) Accordion */}
      <div className="rounded-xl border border-stone-800 bg-stone-900/60 overflow-hidden">
        <button
          onClick={() => setShowCastSheet(!showCastSheet)}
          className="w-full flex items-center justify-between p-4 text-right hover:bg-stone-800/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-stone-200 text-sm font-amiri">
              بطاقة الشخصيات وفريق التمثيل (Dramatis Personae)
            </span>
            <span className="text-xs text-stone-500">· {play.characters.length} شخصيات مسرحية</span>
          </div>
          <span className="text-xs text-amber-400 font-medium">
            {showCastSheet ? 'إخفاء البطاقة' : 'عرض التفاصيل'}
          </span>
        </button>

        {showCastSheet && (
          <div className="p-4 pt-0 border-t border-stone-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
            {play.characters.map((char) => (
              <div
                key={char.id}
                className="p-3 rounded-lg bg-stone-900/90 border border-stone-800 space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: char.color }}
                    />
                    <h4 className="font-bold text-stone-100 font-amiri text-base">
                      {char.name}
                    </h4>
                  </div>
                  <span className="text-xs text-stone-400 font-mono">{char.age}</span>
                </div>

                <p className="text-xs text-amber-300/90 font-medium">{char.role}</p>
                <p className="text-xs text-stone-300 leading-relaxed">{char.description}</p>
                
                <div className="pt-2 border-t border-stone-800/60 text-[11px] text-stone-400 space-y-1">
                  <div>
                    <strong className="text-stone-300">الحالة النفسية: </strong>
                    {char.psychology}
                  </div>
                  <div>
                    <strong className="text-stone-300">النبرة الصوتية: </strong>
                    {char.voiceTone}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onOpenRehearsal(char.id)}
                    className="w-full py-1 text-center text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-950/30 hover:bg-amber-950/60 rounded border border-amber-800/40 transition-colors cursor-pointer"
                  >
                    بدء بروفة هذا الدور
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Theatrical Script Canvas */}
      <div
        className={`script-container rounded-2xl border p-6 md:p-12 shadow-xl transition-colors duration-200 ${themeStyles.container}`}
      >
        {/* Play & Scene Title Block (Standard Dramaturgy Layout) */}
        <div className="text-center max-w-2xl mx-auto pb-8 border-b border-stone-700/40 mb-8 space-y-3">
          <div className="text-xs uppercase tracking-widest text-stone-500 font-serif">
            {play.originalLanguage} · {play.year} · {play.estimatedDuration}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-amiri tracking-tight">
            {play.title}
          </h2>
          <p className="text-sm font-medium text-amber-600/90 dark:text-amber-400/90 font-amiri">
            تأليف: {play.author}
          </p>
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded bg-stone-500/10 border border-stone-500/20">
              {activeScene.title}
            </span>
          </div>
        </div>

        {/* Scene Scenography / Environment Banner */}
        <div className={`p-4 rounded-xl border mb-8 text-xs space-y-2 ${themeStyles.sceneHeader}`}>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-700/30 pb-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="font-bold">الفضاء المسرحي:</span>
              <span>{activeScene.settingPlace}</span>
              <span aria-hidden="true">·</span>
              <span>{activeScene.settingTime}</span>
            </div>
            {activeScene.blockings.length > 0 && (
              <button
                onClick={() => onOpenBlocking(activeScene)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500 text-stone-950 font-semibold rounded text-xs hover:bg-amber-400 transition-colors cursor-pointer"
              >
                <span>مخطط الميزانسين</span>
                <span className="text-[10px]">({activeScene.blockings.length} حركات)</span>
              </button>
            )}
          </div>
          <p className="italic leading-relaxed text-stone-400">
            <strong className="not-italic text-stone-300">وصف الخشبة والديكور: </strong>
            {activeScene.stageDescription}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-[11px] text-stone-400">
            <div>
              <strong className="text-stone-300">تصميم الإضاءة: </strong>
              {activeScene.lightingAtmosphere}
            </div>
            <div>
              <strong className="text-stone-300">تصميم الصوت: </strong>
              {activeScene.audioAtmosphere}
            </div>
          </div>
        </div>

        {/* Dialogue and Stage Directions Body */}
        <div className={`space-y-6 max-w-3xl mx-auto font-amiri ${fontSizes}`}>
          {activeScene.lines.map((line) => {
            const isCharacterTarget =
              highlightCharacterId === 'all' || line.characterId === highlightCharacterId;
            const isSpeaking = currentSpeakingLineId === line.id;

            // Didascalia (إرشادات إخراجية عامة)
            if (line.type === 'didascalia') {
              if (!showDidascalia) return null;
              return (
                <div
                  key={line.id}
                  className={`p-3.5 my-4 rounded-lg border text-sm leading-relaxed transition-all ${themeStyles.didascalia} ${
                    isSpeaking ? 'ring-2 ring-amber-400' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="flex-1">
                      <span className="font-sans text-xs uppercase tracking-wider font-semibold not-italic ml-2">
                        [إرشاد مسرحي]:
                      </span>
                      {line.text}
                    </p>
                    <button
                      onClick={() => speakLine(line)}
                      className="p-1 rounded hover:bg-stone-500/20 text-stone-400 hover:text-amber-400 transition-colors shrink-0 cursor-pointer"
                      title="استماع للإرشاد"
                    >
                      {isSpeaking ? <Square className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            }

            // Sound or Lighting Cues
            if (line.type === 'sound_cue' || line.type === 'lighting_cue') {
              if (!showDidascalia) return null;
              return (
                <div
                  key={line.id}
                  className={`p-2.5 my-3 rounded border text-xs font-sans tracking-wide transition-all ${themeStyles.cue}`}
                >
                  <p>{line.text}</p>
                </div>
              );
            }

            // Internal Monologue / Aside (مناجاة جانباً)
            if (line.type === 'internal_monologue') {
              return (
                <div
                  key={line.id}
                  className={`p-4 my-4 rounded-xl border transition-all ${themeStyles.monologue} ${
                    isSpeaking ? 'ring-2 ring-sky-400' : ''
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-sky-900/30 pb-1.5 mb-2">
                    <span className="font-bold text-sm">
                      {line.characterName} (حديث جانبي / مناجاة للنفس)
                    </span>
                    <button
                      onClick={() => speakLine(line)}
                      className="p-1 rounded hover:bg-stone-500/20 transition-colors shrink-0 cursor-pointer"
                      title="استماع للمناجاة"
                    >
                      {isSpeaking ? <Square className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {line.stageDirection && (
                    <p className="text-xs text-sky-400/80 mb-2 italic">
                      ({line.stageDirection})
                    </p>
                  )}
                  <p className="leading-loose font-medium">{line.text}</p>
                  {showSubtext && line.subtext && (
                    <div className="mt-2 pt-2 border-t border-sky-800/30 text-xs text-purple-300 font-sans flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 shrink-0 text-purple-400 mt-0.5" />
                      <span>{line.subtext}</span>
                    </div>
                  )}
                </div>
              );
            }

            // Standard Dialogue (حوار درامي بين الشخصيات)
            const character = play.characters.find((c) => c.id === line.characterId);

            return (
              <div
                key={line.id}
                className={`py-3 px-4 rounded-xl transition-all ${
                  isSpeaking ? 'ring-2 ring-amber-400 bg-amber-500/10' : ''
                } ${
                  highlightCharacterId !== 'all' && isCharacterTarget
                    ? themeStyles.activeHighlight
                    : ''
                }`}
              >
                {/* Character Header / Cue */}
                <div className="flex items-center justify-between gap-3 mb-1">
                  <div className="flex items-center gap-2">
                    {character && (
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: character.color }}
                        title={character.role}
                      />
                    )}
                    <span
                      className={`font-bold font-amiri text-lg tracking-wide ${themeStyles.characterTag}`}
                    >
                      {line.characterName}:
                    </span>
                    {/* Stage direction embedded in cue */}
                    {line.stageDirection && showDidascalia && (
                      <span className="text-xs text-stone-400 italic font-sans mr-2">
                        ({line.stageDirection})
                      </span>
                    )}
                  </div>

                  {/* Speech / Action button */}
                  <button
                    onClick={() => speakLine(line)}
                    className="p-1 rounded hover:bg-stone-500/20 text-stone-400 hover:text-amber-400 transition-colors shrink-0 cursor-pointer"
                    title="قراءة الجملة بصوت ممثل"
                  >
                    {isSpeaking ? (
                      <Square className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Spoken Dialogue Text */}
                <div className="pr-4 border-r-2 border-stone-700/40">
                  <p className="leading-loose text-justify">{line.text}</p>

                  {/* Subtext (نوايا باطنية للممثل) */}
                  {showSubtext && line.subtext && (
                    <div className="mt-2 p-2 rounded bg-purple-950/20 border border-purple-800/30 text-xs text-purple-300 font-sans flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 shrink-0 text-purple-400 mt-0.5" />
                      <div>
                        <strong className="text-purple-200">الدافع والسبتكست: </strong>
                        {line.subtext}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Scene Footer & Curtain Cue */}
        <div className="mt-12 pt-6 border-t border-stone-700/40 text-center space-y-2">
          <p className="text-xs uppercase tracking-widest text-stone-500 font-serif">
            — نهاية {activeScene.title} —
          </p>
          <div className="flex items-center justify-center gap-3">
            {selectedSceneIndex < play.scenes.length - 1 ? (
              <button
                onClick={() => setSelectedSceneIndex(selectedSceneIndex + 1)}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                الانتقال للمشهد التالي ({play.scenes[selectedSceneIndex + 1].title})
              </button>
            ) : (
              <span className="text-sm font-amiri font-bold text-amber-400">
                [يُسدل الستار ببطء ووقار]
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
