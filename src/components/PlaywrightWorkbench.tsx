import React, { useState } from 'react';
import { PlayMetadata, Scene, ScriptLine, LineType } from '../types/theatre';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Download, 
  Check, 
  Sparkles, 
  Edit3, 
  MessageSquare, 
  Eye, 
  Lightbulb, 
  Volume2,
  ArrowRight
} from 'lucide-react';

interface PlaywrightWorkbenchProps {
  play: PlayMetadata;
  onUpdatePlay: (updatedPlay: PlayMetadata) => void;
  onBackToReader: () => void;
}

export const PlaywrightWorkbench: React.FC<PlaywrightWorkbenchProps> = ({
  play,
  onUpdatePlay,
  onBackToReader,
}) => {
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  
  // New line form state
  const [newLineType, setNewLineType] = useState<LineType>('dialogue');
  const [newLineCharacterId, setNewLineCharacterId] = useState<string>(
    play.characters[0]?.id || ''
  );
  const [newLineDirection, setNewLineDirection] = useState<string>('');
  const [newLineText, setNewLineText] = useState<string>('');
  const [newLineSubtext, setNewLineSubtext] = useState<string>('');

  const activeScene = play.scenes[selectedSceneIndex] || play.scenes[0];

  const handleAddLine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLineText.trim()) return;

    const char = play.characters.find((c) => c.id === newLineCharacterId);

    const newLine: ScriptLine = {
      id: `line-${Date.now()}`,
      type: newLineType,
      characterId: newLineType === 'dialogue' || newLineType === 'internal_monologue' ? newLineCharacterId : undefined,
      characterName: newLineType === 'dialogue' || newLineType === 'internal_monologue' ? char?.name : undefined,
      stageDirection: newLineDirection.trim() ? newLineDirection.trim() : undefined,
      text: newLineText.trim(),
      subtext: newLineSubtext.trim() ? newLineSubtext.trim() : undefined,
      sceneBeat: 1,
    };

    const updatedScenes = [...play.scenes];
    updatedScenes[selectedSceneIndex] = {
      ...activeScene,
      lines: [...activeScene.lines, newLine],
    };

    onUpdatePlay({
      ...play,
      scenes: updatedScenes,
    });

    setNewLineText('');
    setNewLineDirection('');
    setNewLineSubtext('');
  };

  const handleDeleteLine = (lineId: string) => {
    const updatedScenes = [...play.scenes];
    updatedScenes[selectedSceneIndex] = {
      ...activeScene,
      lines: activeScene.lines.filter((l) => l.id !== lineId),
    };
    onUpdatePlay({
      ...play,
      scenes: updatedScenes,
    });
  };

  const copyFormattedScript = () => {
    let scriptText = `${play.title}\nتأليف: ${play.author}\nالنوع: ${play.genre}\n====================\n\n`;
    scriptText += `[الشخصيات]:\n`;
    play.characters.forEach((c) => {
      scriptText += `- ${c.name}: ${c.role} (${c.age}) - ${c.description}\n`;
    });
    scriptText += `\n====================\n\n`;

    play.scenes.forEach((sc) => {
      scriptText += `${sc.title}\n`;
      scriptText += `المكان: ${sc.settingPlace} · الزمان: ${sc.settingTime}\n`;
      scriptText += `[وصف الخشبة والديكور]: ${sc.stageDescription}\n\n`;

      sc.lines.forEach((l) => {
        if (l.type === 'didascalia') {
          scriptText += `    [إرشاد مسرحي: ${l.text}]\n\n`;
        } else if (l.type === 'sound_cue' || l.type === 'lighting_cue') {
          scriptText += `    ${l.text}\n\n`;
        } else if (l.type === 'internal_monologue') {
          scriptText += `${l.characterName} (جانباً) ${l.stageDirection ? `(${l.stageDirection})` : ''}:\n    "${l.text}"\n\n`;
        } else {
          scriptText += `${l.characterName} ${l.stageDirection ? `(${l.stageDirection})` : ''}:\n    "${l.text}"\n\n`;
        }
      });
      scriptText += `\n--- [نهاية المشهد] ---\n\n`;
    });

    navigator.clipboard.writeText(scriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadTextFile = () => {
    let scriptText = `${play.title}\nتأليف: ${play.author}\nالنوع: ${play.genre}\n\n`;
    play.scenes.forEach((sc) => {
      scriptText += `\n# ${sc.title}\n${sc.stageDescription}\n\n`;
      sc.lines.forEach((l) => {
        if (l.type === 'dialogue') {
          scriptText += `${l.characterName}: ${l.text}\n\n`;
        } else {
          scriptText += `[${l.text}]\n\n`;
        }
      });
    });

    const blob = new Blob([scriptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${play.title.replace(/\s+/g, '_')}_النص_المسرحي.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
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
              <span>مختبر التأليف والتحرير المسرحي</span>
              <span aria-hidden="true">·</span>
              <span>صياغة الحوارات والديداسكاليا</span>
            </div>
            <h2 className="text-xl font-bold font-amiri text-stone-100">
              محرر النص: {play.title}
            </h2>
          </div>
        </div>

        {/* Export / Copy Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={copyFormattedScript}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'تم نسخ النص الكامل' : 'نسخ النص المنسق'}</span>
          </button>
          <button
            onClick={downloadTextFile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-stone-950 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تنزيل ملف النص (.txt)</span>
          </button>
        </div>
      </div>

      {/* Scene Selector */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-stone-900/60 border border-stone-800 text-xs">
        <span className="text-stone-400">تعديل المشهد:</span>
        {play.scenes.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setSelectedSceneIndex(idx)}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              idx === selectedSceneIndex
                ? 'bg-amber-400 text-stone-950 font-bold'
                : 'bg-stone-800 text-stone-300 hover:text-white'
            }`}
          >
            المشهد {s.sceneNumber}: {s.title}
          </button>
        ))}
      </div>

      {/* Add New Line Form */}
      <form
        onSubmit={handleAddLine}
        className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4"
      >
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <h3 className="font-bold font-amiri text-base text-stone-100 flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" />
            <span>إضافة جملة أو إرشاد مسرحي جديد للمشهد</span>
          </h3>
          <span className="text-xs text-stone-400">
            تنسيق احترافي طبقاً لقواعد الدراماتورجيا
          </span>
        </div>

        {/* Line Type Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => setNewLineType('dialogue')}
            className={`flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              newLineType === 'dialogue'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-stone-800/80 text-stone-400 border-stone-700'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>حوار شخصية</span>
          </button>

          <button
            type="button"
            onClick={() => setNewLineType('didascalia')}
            className={`flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              newLineType === 'didascalia'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-stone-800/80 text-stone-400 border-stone-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>إرشاد مسرحي (داداسكاليا)</span>
          </button>

          <button
            type="button"
            onClick={() => setNewLineType('internal_monologue')}
            className={`flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              newLineType === 'internal_monologue'
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                : 'bg-stone-800/80 text-stone-400 border-stone-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>مناجاة داخلية (جانباً)</span>
          </button>

          <button
            type="button"
            onClick={() => setNewLineType('lighting_cue')}
            className={`flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              newLineType === 'lighting_cue' || newLineType === 'sound_cue'
                ? 'bg-stone-700 text-stone-200 border-stone-600'
                : 'bg-stone-800/80 text-stone-400 border-stone-700'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>مؤثر إضاءة / صوت</span>
          </button>
        </div>

        {/* Character selection if dialogue */}
        {(newLineType === 'dialogue' || newLineType === 'internal_monologue') && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-stone-400 mb-1">الشخصية المتكلمة:</label>
              <select
                value={newLineCharacterId}
                onChange={(e) => setNewLineCharacterId(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 text-stone-200 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-400"
              >
                {play.characters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-stone-400 mb-1">
                الإرشاد الحركي الملحق بالمتكلم (اختياري، مثلاً: بصوت هامس متوجس):
              </label>
              <input
                type="text"
                value={newLineDirection}
                onChange={(e) => setNewLineDirection(e.target.value)}
                placeholder="مثال: ينهض فجأة وينظر نحو الباب الخلفي..."
                className="w-full bg-stone-800 border border-stone-700 text-stone-200 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        )}

        {/* Line Text Input */}
        <div>
          <label className="block text-xs text-stone-400 mb-1">
            {newLineType === 'dialogue'
              ? 'نص الحوار الدرامي المسرحي:'
              : newLineType === 'didascalia'
              ? 'نص الإرشاد المسرحي ووصف الحركة والديكور:'
              : 'مضمون العبارة:'}
          </label>
          <textarea
            rows={3}
            value={newLineText}
            onChange={(e) => setNewLineText(e.target.value)}
            placeholder={
              newLineType === 'dialogue'
                ? 'اكتب كلام الشخصية هنا بنبرة مسرحية معبرة...'
                : 'اكتب تفاصيل الإرشاد المسرحي بين قوسين...'
            }
            className="w-full bg-stone-800 border border-stone-700 text-stone-100 rounded-lg p-3 text-sm font-amiri focus:outline-none focus:border-amber-400 leading-relaxed"
          />
        </div>

        {/* Subtext input */}
        {(newLineType === 'dialogue' || newLineType === 'internal_monologue') && (
          <div>
            <label className="block text-xs text-purple-300 mb-1">
              السبتكست والدافع الباطني (ملاحظة إخراجية سرية للممثل):
            </label>
            <input
              type="text"
              value={newLineSubtext}
              onChange={(e) => setNewLineSubtext(e.target.value)}
              placeholder="مثال: يحاول إخفاء ارتباكه بعد كشف كذبته السابقة..."
              className="w-full bg-stone-800/70 border border-stone-700 text-purple-200 rounded-lg p-2 text-xs focus:outline-none focus:border-purple-400"
            />
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>إدراج في المشهد</span>
          </button>
        </div>
      </form>

      {/* Existing Scene Lines List (Editable / Deletable) */}
      <div className="space-y-3">
        <h3 className="font-bold font-amiri text-stone-200 text-base">
          سطور المشهد الحالي ({activeScene.lines.length} عناصر):
        </h3>
        <div className="space-y-2">
          {activeScene.lines.map((l, index) => (
            <div
              key={l.id}
              className="p-3.5 rounded-xl bg-stone-900/60 border border-stone-800/80 flex items-start justify-between gap-4 group hover:border-stone-700 transition-colors"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-stone-500">#{index + 1}</span>
                  {l.characterName ? (
                    <span className="font-bold text-amber-400 font-amiri text-sm">
                      {l.characterName}:
                    </span>
                  ) : (
                    <span className="font-mono text-[11px] text-stone-400 uppercase">
                      [{l.type}]
                    </span>
                  )}
                  {l.stageDirection && (
                    <span className="text-stone-400 italic text-[11px]">
                      ({l.stageDirection})
                    </span>
                  )}
                </div>
                <p className="font-amiri text-stone-200 text-base leading-relaxed">
                  {l.text}
                </p>
                {l.subtext && (
                  <p className="text-[11px] text-purple-300 pt-1">
                    <strong className="text-purple-400">سبتكست: </strong>
                    {l.subtext}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleDeleteLine(l.id)}
                className="p-1.5 rounded text-stone-500 hover:text-red-400 hover:bg-stone-800 transition-colors opacity-60 group-hover:opacity-100 cursor-pointer"
                title="حذف هذا السطر"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
