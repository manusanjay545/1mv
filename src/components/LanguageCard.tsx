import Link from 'next/link';

interface LanguageCardProps {
  language: string;
}

const LANGUAGE_COLORS: Record<string, { from: string; to: string }> = {
  Tamil: { from: 'from-red-900/60', to: 'to-orange-900/40' },
  Telugu: { from: 'from-yellow-900/60', to: 'to-amber-900/40' },
  Malayalam: { from: 'from-green-900/60', to: 'to-emerald-900/40' },
  Kannada: { from: 'from-purple-900/60', to: 'to-violet-900/40' },
  Hindi: { from: 'from-blue-900/60', to: 'to-cyan-900/40' },
  English: { from: 'from-indigo-900/60', to: 'to-sky-900/40' },
};

export default function LanguageCard({ language }: LanguageCardProps) {
  const colors = LANGUAGE_COLORS[language] ?? {
    from: 'from-gray-800',
    to: 'to-gray-900',
  };

  return (
    <Link
      href={`/browse?language=${encodeURIComponent(language)}`}
      className="group block"
    >
      <div
        className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${colors.from} ${colors.to} p-6 ring-1 ring-white/10 transition-all duration-300 group-hover:ring-accent/50 group-hover:scale-[1.03]`}
      >
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/5 transition-transform duration-500 group-hover:scale-150" />
        <h3 className="relative text-lg font-bold text-white">{language}</h3>
        <p className="relative mt-1 text-sm text-gray-400">
          Browse {language} movies
        </p>
      </div>
    </Link>
  );
}
