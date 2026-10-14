import React from 'react';
import { BookOpen, CheckCircle, Award, Compass, Layers, Sparkles } from 'lucide-react';

export const DramaturgyGuideModal: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title & Introduction */}
      <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
        <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
          <Award className="w-4 h-4" />
          <span>المعايير الأكاديمية والمهنية لصناعة المسرح</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold font-amiri text-stone-100">
          دليل كتابة وتنسيق النص المسرحي الاحترافي
        </h2>
        <p className="text-sm text-stone-300 leading-relaxed">
          النص المسرحي يختلف جذرياً عن الرواية والسيناريو السينمائي؛ إنه نص كُتب ليُجسد حياً على الخشبة في زمن حقيقي أمام جمهور حاضر، وتخضع لغته لإيقاع الأنفاس، والفضاء الحركي، والصراع الدرامي المكثف.
        </p>
      </div>

      {/* Pillars of Professional Scripting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Pillar 1: Didascalia */}
        <div className="p-5 rounded-xl bg-stone-900/70 border border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold font-amiri text-lg">
            <Compass className="w-5 h-5" />
            <span>1. فن الديداسكاليا (الإرشادات المسرحية)</span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            الديداسكاليا (Didascalies) هي كل نص خارج أقوال الشخصيات؛ وتشمل وصف المنظر، الدخول والخروج، الإيماءات، ونبرات الصوت.
          </p>
          <ul className="text-xs text-stone-400 space-y-1.5 list-disc list-inside">
            <li><strong className="text-stone-200">الإيجاز البليغ:</strong> تجنب الإنشاء الأدبي الطويل؛ ركّز على الأفعال القابلة للتجسيد.</li>
            <li><strong className="text-stone-200">التمييز البصري:</strong> تُكتب الإرشادات بين قوسين أو بخط مائل أو بمسافة بادئة لتمييزها فوراً عن الحوار.</li>
            <li><strong className="text-stone-200">احترام المخرج:</strong> لا تحدد للمخرج كل خطوة؛ اترك له وللممثل مساحة التأويل الإبداعي.</li>
          </ul>
        </div>

        {/* Pillar 2: Dialogue vs Subtext */}
        <div className="p-5 rounded-xl bg-stone-900/70 border border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-sky-400 font-bold font-amiri text-lg">
            <Sparkles className="w-5 h-5" />
            <span>2. الحوار المسرحي والنص الباطني (Subtext)</span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            الشخصية المسرحية العظيمة نادراً ما تقول ما تفكر فيه مباشرة؛ الصدق يكمن في المسافة الفاصلة بين الكلمة المعلنة والدافع الخفي.
          </p>
          <ul className="text-xs text-stone-400 space-y-1.5 list-disc list-inside">
            <li><strong className="text-stone-200">الحوار فعل درامي:</strong> كل جملة يجب أن تكون محاولة لتغيير موقف الطرف الآخر أو الدفاع عن النفس.</li>
            <li><strong className="text-stone-200">إيقاع التبادل (Stichomythia):</strong> تنويع الإيقاع بين الجمل القصيرة اللاهثة والمناجاة الطويلة.</li>
            <li><strong className="text-stone-200">المناجاة (Soliloquy):</strong> حديث الشخصية مع نفسها أو مع الجمهور لاختراق أسرار باطنها.</li>
          </ul>
        </div>

        {/* Pillar 3: Aristotelian Arc */}
        <div className="p-5 rounded-xl bg-stone-900/70 border border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-purple-400 font-bold font-amiri text-lg">
            <Layers className="w-5 h-5" />
            <span>3. الهرم الدرامي والتصاعد التراجيدي</span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            البناء المسرحي المتين يقوم على تطور الصراع نحو لحظة لا رجعة فيها:
          </p>
          <ul className="text-xs text-stone-400 space-y-1.5 list-disc list-inside">
            <li><strong className="text-stone-200">التمهيد (Exposition):</strong> رسم الفضاء والشخصيات والوضع الراهن.</li>
            <li><strong className="text-stone-200">الحدث المحرك (Inciting Incident):</strong> كسر التوازن وبدء العاصفة.</li>
            <li><strong className="text-stone-200">الانقلاب والذروة (Peripeteia & Climax):</strong> لحظة الانكشاف الكبرى.</li>
            <li><strong className="text-stone-200">التطهير (Catharsis):</strong> التحرر الوجداني للمتلقي والشخصيات.</li>
          </ul>
        </div>

        {/* Pillar 4: Formatting Standards */}
        <div className="p-5 rounded-xl bg-stone-900/70 border border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold font-amiri text-lg">
            <CheckCircle className="w-5 h-5" />
            <span>4. معايير طباعة وتنسيق النص الدولي</span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            المعايير المتبعة في دور النشر المسرحية العالمية ومهرجانات المسرح العربي:
          </p>
          <ul className="text-xs text-stone-400 space-y-1.5 list-disc list-inside">
            <li><strong className="text-stone-200">اسم الشخصية:</strong> يُكتب في المنتصف أو بارزاً بخط أسود عريض متبوعاً بنقطتين.</li>
            <li><strong className="text-stone-200">بطاقة الشخصيات:</strong> تسبق النص متضمنة العمر، المظهر، والسمات النفسية.</li>
            <li><strong className="text-stone-200">رأس المشهد:</strong> تحديد المكان والزمان والإضاءة والمؤثرات كفقرة مستقلة.</li>
          </ul>
        </div>
      </div>

      {/* Interactive Model Breakdown */}
      <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4">
        <h3 className="font-bold text-stone-100 font-amiri text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <span>تشريح تطبيقي لنموذج "ظلال الغروب في محطة الانتظار"</span>
        </h3>
        <p className="text-xs text-stone-300 leading-relaxed">
          يمثل هذا النص نموذجاً للمسرح الفلسفي التعبيري ذي الفضاء المغلق. لاحظ كيف تم توظيف:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-stone-950 border border-stone-800">
            <span className="text-amber-400 font-bold block mb-1">رمزية المكان والزمان:</span>
            <span className="text-stone-300">الساعة المتوقفة عند السادسة وسبع دقائق والمحطة المعزولة كبرزخ رمزي بين الماضي والندم.</span>
          </div>
          <div className="p-3 rounded-lg bg-stone-950 border border-stone-800">
            <span className="text-sky-400 font-bold block mb-1">تطور الصراع:</span>
            <span className="text-stone-300">من صراع خارجي سطحي (التأخر عن موعد القطار) إلى صراع داخلي عميق (مواجهة الذنب وسر الحقائب).</span>
          </div>
          <div className="p-3 rounded-lg bg-stone-950 border border-stone-800">
            <span className="text-emerald-400 font-bold block mb-1">السينوغرافيا الصوتية:</span>
            <span className="text-stone-300">دقات قطرات الماء، عواء الرياح، صدى المنادي، وعزف الكمان الحي كوسائط درامية فعالة.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
