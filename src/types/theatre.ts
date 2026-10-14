export type LineType = 
  | 'dialogue'       // حوار مباشر
  | 'didascalia'     // إرشاد مسرحي / إخراجي عام
  | 'internal_monologue' // مناجاة داخلية / جانباً (Aside)
  | 'lighting_cue'   // تعليمات إضاءة
  | 'sound_cue'      // تعليمات صوت وموسيقى
  | 'entrance_exit'; // دخول أو خروج شخصية

export interface ScriptLine {
  id: string;
  type: LineType;
  characterId?: string; // id of speaking character
  characterName?: string;
  stageDirection?: string; // e.g. (بصوت يرتجف، متراجعاً إلى الخلف)
  text: string;
  subtext?: string; // تفسير درامي داخلي للممثل والمخرج
  sceneBeat?: number; // رقم الحركة الدرامية
}

export interface Character {
  id: string;
  name: string;
  role: string; // e.g. ناظر المحطة المتقاعد
  age: string;
  description: string;
  psychology: string; // الحالة النفسية والدوافع
  voiceTone: string; // نبرة الصوت والإيقاع
  costume: string; // الزي المقترح
  color: string; // اللون المميز في البروفة
  stageInitPosition: { x: number; y: number; label: string };
}

export interface SceneBlocking {
  beatNumber: number;
  description: string;
  positions: {
    characterId: string;
    x: number; // percentage 0-100 across stage width
    y: number; // percentage 0-100 stage depth (0: upstage, 100: downstage)
    facing: 'left' | 'right' | 'center' | 'audience';
    action: string;
  }[];
  lightingFocus: string;
}

export interface Scene {
  id: string;
  actNumber: number;
  sceneNumber: number;
  title: string;
  settingTime: string; // الزمان: ليل شتوي عاصف
  settingPlace: string; // المكان: رصيف محطة مهجورة
  stageDescription: string; // الوصف الطوبوغرافي للخشبة والديكور
  lightingAtmosphere: string; // تصميم الإضاءة
  audioAtmosphere: string; // تصميم الصوت
  lines: ScriptLine[];
  blockings: SceneBlocking[];
}

export interface PlayMetadata {
  id: string;
  title: string;
  genre: string; // دراما نفسية، تراجيديا، كوميديا سوداء...
  author: string;
  originalLanguage: string;
  year: string;
  estimatedDuration: string; // مثلاً 45 دقيقة
  targetCast: string; // 2 ممثلين + ممثلة
  synopsis: string;
  dramaturgicalVision: string; // الرؤية الإخراجية والدراماتورجية
  characters: Character[];
  scenes: Scene[];
}
