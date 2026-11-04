import Link from 'next/link';
import { Film, ChevronRight } from 'lucide-react';

interface LanguageCardProps {
  language: string;
}

const LANGUAGE_META: Record<
  string,
  { label: string; tag: string; color: string }
> = {
  Tamil: { label: 'Tamil Movies', tag: 'தமிழ்', color: 'border-red-500/40 text-red-400' },
  Telugu: { label: 'Telugu Movies', tag: 'తెలుగు', color: 'border-amber-500/40 text-amber-400' },
  Malayalam: { label: 'Malayalam Movies', tag: 'മലയാളം', color: 'border-emerald-500/40 text-emerald-400' },
  Kannada: { label: 'Kannada Movies', tag: 'ಕನ್ನಡ', color: 'border-purple-500/40 text-purple-400' },
  Hindi: { label: 'Hindi Bollywood', tag: 'हिंदी', color: 'border-blue-500/40 text-blue-400' },
  English: { label: 'English & Dubbed', tag: 'Hollywood', color: 'border-cyan-500/40 text-cyan-400' },
};

export default function LanguageCard({ language }: LanguageCardProps) {
  const meta = LANGUAGE_META[language] ?? {
    label: `${language} Releases`,
    tag: language,
    color: 'border-gray-700 text-gray-300',
  };

  return (
    <Link
      href={`/browse?language=${encodeURIComponent(language)}`}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-lg bg-[#111722] border border-[#1f293d] hover:border-emerald-500/60 p-3.5 transition-all duration-200 hover:-translate-y-0.5 shadow-md">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-black uppercase tracking-wider text-white group-hover:text-emerald-400 transition-colors">
            {language}
          </span>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/60 border ${meta.color}`}
          >
            {meta.tag}
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2 pt-2 border-t border-[#1f293d]">
          <span>View Catalogue</span>
          <ChevronRight className="h-3.5 w-3.5 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
}
