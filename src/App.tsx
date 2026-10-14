import React, { useState } from 'react';
import { DEFAULT_PLAYS } from './data/defaultPlays';
import { PlayMetadata, Scene } from './types/theatre';
import { Header } from './components/Header';
import { AudioAmbienceBar } from './components/AudioAmbienceBar';
import { ScriptReader } from './components/ScriptReader';
import { ActorRehearsalMode } from './components/ActorRehearsalMode';
import { StageBlockingVisualizer } from './components/StageBlockingVisualizer';
import { PlaywrightWorkbench } from './components/PlaywrightWorkbench';
import { DramaturgyGuideModal } from './components/DramaturgyGuideModal';
import { BookOpen, Users, Clock, Compass, Sparkles, Feather, Printer } from 'lucide-react';

const STAGE_HERO_IMAGE = '/src/assets/images/theatre_stage_dramatic_1792003329022.jpg';
const SCRIPT_STILL_IMAGE = '/src/assets/images/theatre_script_quill_1792003329758.jpg';

export default function App() {
  const [plays, setPlays] = useState<PlayMetadata[]>(DEFAULT_PLAYS);
  const [selectedPlayId, setSelectedPlayId] = useState<string>(DEFAULT_PLAYS[0].id);
  const [currentTab, setCurrentTab] = useState<'reader' | 'rehearsal' | 'mise_en_scene' | 'workbench' | 'guide'>('reader');
  
  // Specific sub-state for rehearsal and blocking
  const [rehearsalCharId, setRehearsalCharId] = useState<string | undefined>(undefined);
  const [blockingScene, setBlockingScene] = useState<Scene | undefined>(undefined);

  const currentPlay = plays.find((p) => p.id === selectedPlayId) || plays[0];

  const handleSelectPlay = (id: string) => {
    setSelectedPlayId(id);
    const p = plays.find((x) => x.id === id);
    if (p) {
      setBlockingScene(p.scenes[0]);
    }
  };

  const handleOpenBlocking = (scene: Scene) => {
    setBlockingScene(scene);
    setCurrentTab('mise_en_scene');
  };

  const handleOpenRehearsal = (charId: string) => {
    setRehearsalCharId(charId);
    setCurrentTab('rehearsal');
  };

  const handleUpdatePlay = (updated: PlayMetadata) => {
    setPlays((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  return (
    <div className="min-h-screen bg-[#121010] text-[#E8DFD4] flex flex-col font-['Tajawal',sans-serif]">
      {/* 3-Zone Standard Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab as any)}
        onStartRehearsal={() => {
          setRehearsalCharId(currentPlay.characters[0]?.id);
          setCurrentTab('rehearsal');
        }}
      />

      {/* Live Audio Atmosphere Ribbon */}
      <div className="no-print">
        <AudioAmbienceBar />
      </div>

      {/* Hero Visual Spotlight (Only shown on reader tab for immersive orientation) */}
      {currentTab === 'reader' && (
        <section className="relative w-full border-b border-stone-800 bg-stone-950 no-print overflow-hidden">
          {/* Background Stage Image with measured scrim */}
          <div className="absolute inset-0 z-0">
            <img
              src={STAGE_HERO_IMAGE}
              alt="خشبة المسرح والستائر المخملية"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-25 filter blur-[1px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121010] via-[#121010]/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-16">
            <div className="max-w-3xl space-y-4">
              {/* Unboxed Metadata with separators */}
              <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
                <span className="uppercase tracking-wider">نموذج دراماتورجي موثق</span>
                <span aria-hidden="true">·</span>
                <span>المسرح العربي المعاصر</span>
                <span aria-hidden="true">·</span>
                <span>المعايير الدولية للتأليف والإخراج</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold font-amiri tracking-tight text-white leading-tight">
                {currentPlay.title}
              </h1>

              <p className="text-sm md:text-base text-stone-300 font-normal leading-relaxed text-balance max-w-2xl">
                {currentPlay.synopsis}
              </p>

              {/* Four Quantitative KPI Metric Badges (unboxed text discipline) */}
              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-stone-400 font-mono">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>المدة التقديرية: <strong className="text-stone-200">{currentPlay.estimatedDuration}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>فريق التمثيل: <strong className="text-stone-200">{currentPlay.characters.length} شخصيات</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>عدد المشاهد: <strong className="text-stone-200">{currentPlay.scenes.length} مشاهد مكتملة</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>الفضاء: <strong className="text-stone-200">{currentPlay.scenes[0]?.settingPlace}</strong></span>
                </div>
              </div>

              {/* Action Strip */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    const el = document.querySelector('.script-container');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-sm flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>قراءة النص المسرحي الكامل</span>
                </button>

                <button
                  onClick={() => {
                    setRehearsalCharId(currentPlay.characters[0]?.id);
                    setCurrentTab('rehearsal');
                  }}
                  className="px-4 py-2.5 bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>استوديو بروفة الممثلين والتلقين</span>
                </button>

                <button
                  onClick={() => setCurrentTab('guide')}
                  className="px-4 py-2.5 bg-stone-900/90 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Feather className="w-4 h-4 text-sky-400" />
                  <span>معايير الصياغة الدراماتورجية</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-6 py-8">
        {currentTab === 'reader' && (
          <ScriptReader
            play={currentPlay}
            allPlays={plays}
            onSelectPlay={handleSelectPlay}
            onOpenBlocking={handleOpenBlocking}
            onOpenRehearsal={handleOpenRehearsal}
          />
        )}

        {currentTab === 'rehearsal' && (
          <ActorRehearsalMode
            play={currentPlay}
            initialCharacterId={rehearsalCharId}
            onBackToReader={() => setCurrentTab('reader')}
          />
        )}

        {currentTab === 'mise_en_scene' && (
          <StageBlockingVisualizer
            scene={blockingScene || currentPlay.scenes[0]}
            characters={currentPlay.characters}
            onBackToReader={() => setCurrentTab('reader')}
          />
        )}

        {currentTab === 'workbench' && (
          <PlaywrightWorkbench
            play={currentPlay}
            onUpdatePlay={handleUpdatePlay}
            onBackToReader={() => setCurrentTab('reader')}
          />
        )}

        {currentTab === 'guide' && <DramaturgyGuideModal />}
      </main>

      {/* Institutional Editorial Footer */}
      <footer className="border-t border-stone-800/80 bg-stone-950 py-8 px-6 text-stone-400 text-xs no-print">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-amiri font-bold text-stone-200 text-base">الخزانة المسرحية</span>
            <span aria-hidden="true">·</span>
            <span>نموذج دراماتورجي وإخراجي احترافي موثق</span>
          </div>

          <div className="flex items-center gap-6 text-stone-400">
            <button
              onClick={() => setCurrentTab('reader')}
              className="hover:text-stone-200 transition-colors cursor-pointer"
            >
              النصوص الكاملة
            </button>
            <button
              onClick={() => setCurrentTab('rehearsal')}
              className="hover:text-stone-200 transition-colors cursor-pointer"
            >
              بروفة الممثلين
            </button>
            <button
              onClick={() => setCurrentTab('workbench')}
              className="hover:text-stone-200 transition-colors cursor-pointer"
            >
              المحرر المسرحي
            </button>
            <button
              onClick={() => setCurrentTab('guide')}
              className="hover:text-stone-200 transition-colors cursor-pointer"
            >
              دليل الكتابة
            </button>
            <button
              onClick={() => window.print()}
              className="hover:text-stone-200 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة النص</span>
            </button>
          </div>

          <p className="text-stone-400 font-mono text-[11px]">
            © {new Date().getFullYear()} الخزانة المسرحية · وثيقة تدريبية موجهة للكتاب والمخرجين والممثلين
          </p>
        </div>
      </footer>
    </div>
  );
}
