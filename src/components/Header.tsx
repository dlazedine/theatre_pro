import React from 'react';
import { Play } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onStartRehearsal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onStartRehearsal,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-stone-800 bg-[#141212]/95 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onSelectTab('reader');
        }}
        className="text-xl font-bold tracking-tight text-[#E8DFD4] font-amiri whitespace-nowrap shrink-0 hover:text-amber-400 transition-colors"
      >
        الخزانة المسرحية
      </a>

      {/* Zone 2: 4–5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-400">
        <button
          onClick={() => onSelectTab('reader')}
          className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentTab === 'reader' ? 'text-amber-400 border-b border-amber-400 pb-0.5' : ''
          }`}
        >
          النص المسرحي
        </button>
        <button
          onClick={() => onSelectTab('rehearsal')}
          className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentTab === 'rehearsal' ? 'text-amber-400 border-b border-amber-400 pb-0.5' : ''
          }`}
        >
          بروفة الممثلين
        </button>
        <button
          onClick={() => onSelectTab('mise_en_scene')}
          className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentTab === 'mise_en_scene' ? 'text-amber-400 border-b border-amber-400 pb-0.5' : ''
          }`}
        >
          توزيع الخشبة
        </button>
        <button
          onClick={() => onSelectTab('workbench')}
          className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentTab === 'workbench' ? 'text-amber-400 border-b border-amber-400 pb-0.5' : ''
          }`}
        >
          محرر النص
        </button>
        <button
          onClick={() => onSelectTab('guide')}
          className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentTab === 'guide' ? 'text-amber-400 border-b border-amber-400 pb-0.5' : ''
          }`}
        >
          دليل الكتابة
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onStartRehearsal}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>بدء البروفة</span>
        </button>
      </div>
    </header>
  );
};
