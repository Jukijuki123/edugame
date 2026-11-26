import React from 'react';

export type ItemKey =
  | 'pencil'
  | 'book'
  | 'backpack'
  | 'ruler'
  | 'eraser'
  | 'scissors'
  | 'lion'
  | 'elephant'
  | 'monkey'
  | 'cat'
  | 'rabbit'
  | 'dog'
  | 'apple'
  | 'banana'
  | 'orange'
  | 'strawberry'
  | 'bed'
  | 'lamp'
  | 'chair'
  | 'clock'
  | 'pillow'
  | 'table'
  | 'red'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'purple';

interface ItemIllustrationProps {
  name: string;
  isSilhouette?: boolean;
  className?: string;
  size?: number;
}

export const ItemIllustration: React.FC<ItemIllustrationProps> = ({
  name,
  isSilhouette = false,
  className = '',
  size = 64,
}) => {
  const normalized = name.toLowerCase().replace(/[^a-z]/g, '');

  if (isSilhouette) {
    return (
      <div
        className={`flex items-center justify-center filter brightness-0 opacity-25 ${className}`}
        style={{ width: size, height: size }}
      >
        {renderGraphic(normalized, size)}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center drop-shadow-sm transition-transform ${className}`}
      style={{ width: size, height: size }}
    >
      {renderGraphic(normalized, size)}
    </div>
  );
};

function renderGraphic(key: string, size: number): React.ReactNode {
  switch (key) {
    case 'pencil':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <rect x="25" y="35" width="50" height="20" rx="3" transform="rotate(-45 50 45)" fill="#FBBF24" />
          <path d="M 68 18 L 82 32 L 72 42 L 58 28 Z" fill="#F472B6" />
          <path d="M 20 66 L 34 80 L 14 86 Z" fill="#FDE68A" />
          <path d="M 14 86 L 20 80 L 18 78 Z" fill="#1E293B" />
          {/* cute eyes */}
          <circle cx="48" cy="46" r="2.5" fill="#1E293B" />
          <circle cx="56" cy="38" r="2.5" fill="#1E293B" />
        </svg>
      );

    case 'book':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <rect x="18" y="22" width="64" height="58" rx="8" fill="#3B82F6" />
          <rect x="24" y="20" width="56" height="58" rx="6" fill="#60A5FA" />
          <path d="M 28 20 L 28 78" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="4 4" />
          <rect x="36" y="36" width="34" height="26" rx="4" fill="#FFFFFF" opacity="0.9" />
          {/* bookmark */}
          <path d="M 50 18 L 50 36 L 55 31 L 60 36 L 60 18 Z" fill="#EF4444" />
          <circle cx="47" cy="49" r="2" fill="#3B82F6" />
          <circle cx="59" cy="49" r="2" fill="#3B82F6" />
          <path d="M 50 54 Q 53 57 56 54" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'backpack':
    case 'bag':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <rect x="22" y="32" width="56" height="52" rx="14" fill="#10B981" />
          <path d="M 36 32 C 36 20, 64 20, 64 32" stroke="#047857" strokeWidth="6" strokeLinecap="round" />
          <rect x="28" y="52" width="44" height="26" rx="8" fill="#34D399" />
          <circle cx="50" cy="58" r="4" fill="#FBBF24" />
          <circle cx="42" cy="42" r="3" fill="#065F46" />
          <circle cx="58" cy="42" r="3" fill="#065F46" />
          <path d="M 47 45 Q 50 48 53 45" stroke="#065F46" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'ruler':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <rect x="15" y="38" width="70" height="24" rx="4" fill="#F59E0B" />
          <line x1="25" y1="38" x2="25" y2="48" stroke="#78350F" strokeWidth="2" />
          <line x1="35" y1="38" x2="35" y2="54" stroke="#78350F" strokeWidth="2" />
          <line x1="45" y1="38" x2="45" y2="48" stroke="#78350F" strokeWidth="2" />
          <line x1="55" y1="38" x2="55" y2="54" stroke="#78350F" strokeWidth="2" />
          <line x1="65" y1="38" x2="65" y2="48" stroke="#78350F" strokeWidth="2" />
          <line x1="75" y1="38" x2="75" y2="54" stroke="#78350F" strokeWidth="2" />
          <circle cx="21" cy="50" r="3" fill="#FEF3C7" />
        </svg>
      );

    case 'eraser':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <g transform="rotate(-15 50 50)">
            <rect x="20" y="35" width="30" height="30" rx="4" fill="#F43F5E" />
            <rect x="50" y="35" width="30" height="30" rx="4" fill="#38BDF8" />
            <rect x="42" y="34" width="16" height="32" fill="#E2E8F0" />
            <circle cx="32" cy="48" r="2.5" fill="#FFFFFF" />
            <circle cx="68" cy="48" r="2.5" fill="#FFFFFF" />
          </g>
        </svg>
      );

    case 'scissors':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="30" cy="70" r="14" stroke="#EF4444" strokeWidth="6" fill="none" />
          <circle cx="70" cy="70" r="14" stroke="#EF4444" strokeWidth="6" fill="none" />
          <line x1="38" y1="60" x2="65" y2="22" stroke="#94A3B8" strokeWidth="7" strokeLinecap="round" />
          <line x1="62" y1="60" x2="35" y2="22" stroke="#CBD5E1" strokeWidth="7" strokeLinecap="round" />
          <circle cx="50" cy="46" r="4" fill="#F59E0B" />
        </svg>
      );

    case 'lion':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          {/* mane */}
          <circle cx="50" cy="50" r="36" fill="#F97316" />
          {/* head */}
          <circle cx="50" cy="52" r="25" fill="#FDE047" />
          {/* ears */}
          <circle cx="32" cy="34" r="8" fill="#FDE047" />
          <circle cx="32" cy="34" r="4" fill="#F472B6" />
          <circle cx="68" cy="34" r="8" fill="#FDE047" />
          <circle cx="68" cy="34" r="4" fill="#F472B6" />
          {/* face */}
          <circle cx="42" cy="48" r="3.5" fill="#1E293B" />
          <circle cx="58" cy="48" r="3.5" fill="#1E293B" />
          <ellipse cx="50" cy="56" rx="4" ry="3" fill="#B45309" />
          <path d="M 45 61 Q 50 66 55 61" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'elephant':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <ellipse cx="50" cy="52" rx="28" ry="24" fill="#94A3B8" />
          {/* big ears */}
          <ellipse cx="22" cy="46" rx="14" ry="18" fill="#CBD5E1" />
          <ellipse cx="23" cy="46" rx="8" ry="12" fill="#F472B6" />
          <ellipse cx="78" cy="46" rx="14" ry="18" fill="#CBD5E1" />
          <ellipse cx="77" cy="46" rx="8" ry="12" fill="#F472B6" />
          {/* trunk */}
          <path d="M 46 54 C 46 68, 56 74, 62 66" stroke="#94A3B8" strokeWidth="9" strokeLinecap="round" fill="none" />
          {/* eyes */}
          <circle cx="41" cy="44" r="3" fill="#1E293B" />
          <circle cx="59" cy="44" r="3" fill="#1E293B" />
        </svg>
      );

    case 'monkey':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          {/* ears */}
          <circle cx="20" cy="46" r="12" fill="#B45309" />
          <circle cx="20" cy="46" r="6" fill="#FDE68A" />
          <circle cx="80" cy="46" r="12" fill="#B45309" />
          <circle cx="80" cy="46" r="6" fill="#FDE68A" />
          {/* head */}
          <circle cx="50" cy="48" r="26" fill="#B45309" />
          <ellipse cx="50" cy="55" rx="18" ry="14" fill="#FDE68A" />
          {/* eyes */}
          <ellipse cx="43" cy="42" rx="7" ry="9" fill="#FDE68A" />
          <ellipse cx="57" cy="42" rx="7" ry="9" fill="#FDE68A" />
          <circle cx="43" cy="42" r="3.5" fill="#1E293B" />
          <circle cx="57" cy="42" r="3.5" fill="#1E293B" />
          <ellipse cx="50" cy="54" rx="3.5" ry="2.5" fill="#78350F" />
          <path d="M 44 60 Q 50 64 56 60" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'cat':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          {/* ears */}
          <polygon points="26,42 22,18 42,30" fill="#F97316" />
          <polygon points="27,39 25,23 39,32" fill="#F472B6" />
          <polygon points="74,42 78,18 58,30" fill="#F97316" />
          <polygon points="73,39 75,23 61,32" fill="#F472B6" />
          {/* head */}
          <circle cx="50" cy="52" r="26" fill="#F97316" />
          {/* cheeks */}
          <circle cx="36" cy="58" r="4" fill="#FDA4AF" opacity="0.6" />
          <circle cx="64" cy="58" r="4" fill="#FDA4AF" opacity="0.6" />
          {/* eyes */}
          <ellipse cx="42" cy="48" rx="3.5" ry="5" fill="#1E293B" />
          <ellipse cx="58" cy="48" rx="3.5" ry="5" fill="#1E293B" />
          <polygon points="50,55 47,52 53,52" fill="#F472B6" />
          <path d="M 44 58 Q 50 62 56 58" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          {/* whiskers */}
          <line x1="24" y1="52" x2="36" y2="54" stroke="#EA580C" strokeWidth="2" />
          <line x1="24" y1="60" x2="36" y2="58" stroke="#EA580C" strokeWidth="2" />
          <line x1="76" y1="52" x2="64" y2="54" stroke="#EA580C" strokeWidth="2" />
          <line x1="76" y1="60" x2="64" y2="58" stroke="#EA580C" strokeWidth="2" />
        </svg>
      );

    case 'rabbit':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          {/* long ears */}
          <ellipse cx="38" cy="24" rx="8" ry="20" fill="#E2E8F0" />
          <ellipse cx="38" cy="24" rx="4" ry="14" fill="#F472B6" />
          <ellipse cx="62" cy="24" rx="8" ry="20" fill="#E2E8F0" />
          <ellipse cx="62" cy="24" rx="4" ry="14" fill="#F472B6" />
          {/* head */}
          <circle cx="50" cy="56" r="24" fill="#F1F5F9" />
          <circle cx="40" cy="52" r="3.5" fill="#1E293B" />
          <circle cx="60" cy="52" r="3.5" fill="#1E293B" />
          <ellipse cx="50" cy="60" rx="3.5" ry="2.5" fill="#F472B6" />
          <path d="M 45 65 Q 50 68 55 65" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'dog':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          {/* floppy ears */}
          <ellipse cx="24" cy="48" rx="9" ry="18" fill="#78350F" transform="rotate(20 24 48)" />
          <ellipse cx="76" cy="48" rx="9" ry="18" fill="#78350F" transform="rotate(-20 76 48)" />
          {/* head */}
          <circle cx="50" cy="52" r="26" fill="#D97706" />
          <ellipse cx="50" cy="60" rx="14" ry="10" fill="#FEF3C7" />
          <circle cx="42" cy="46" r="3.5" fill="#1E293B" />
          <circle cx="58" cy="46" r="3.5" fill="#1E293B" />
          <ellipse cx="50" cy="56" rx="4.5" ry="3.5" fill="#1E293B" />
          <path d="M 46 64 Q 50 67 54 64" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <path d="M 50 64 C 50 71 54 71 54 64" fill="#F43F5E" />
        </svg>
      );

    case 'apple':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <path d="M 50 24 C 50 14 56 12 56 12" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="63" cy="18" rx="8" ry="4" fill="#22C55E" transform="rotate(-20 63 18)" />
          <path d="M 50 32 C 30 18, 14 36, 22 62 C 28 82, 46 82, 50 76 C 54 82, 72 82, 78 62 C 86 36, 70 18, 50 32 Z" fill="#EF4444" />
          <circle cx="38" cy="45" r="4" fill="#FCA5A5" />
          <circle cx="42" cy="55" r="2.5" fill="#1E293B" />
          <circle cx="58" cy="55" r="2.5" fill="#1E293B" />
          <path d="M 46 62 Q 50 65 54 62" stroke="#7F1D1D" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'banana':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <path d="M 24 28 C 30 55, 52 75, 82 68 C 80 74, 48 78, 22 46 C 18 40, 20 32, 24 28 Z" fill="#FACC15" />
          <path d="M 23 26 L 19 22" stroke="#854D0E" strokeWidth="4" strokeLinecap="round" />
          <circle cx="46" cy="50" r="2.5" fill="#713F12" />
          <circle cx="54" cy="54" r="2.5" fill="#713F12" />
          <path d="M 48 57 Q 52 61 56 58" stroke="#713F12" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'orange':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="52" r="30" fill="#F97316" />
          <ellipse cx="50" cy="22" rx="8" ry="4" fill="#22C55E" />
          <path d="M 50 24 L 50 18" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <circle cx="40" cy="40" r="4" fill="#FDBA74" />
          <circle cx="43" cy="52" r="3" fill="#7C2D12" />
          <circle cx="57" cy="52" r="3" fill="#7C2D12" />
          <path d="M 46 60 Q 50 64 54 60" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'strawberry':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <path d="M 50 84 C 28 72, 20 45, 30 32 C 40 22, 60 22, 70 32 C 80 45, 72 72, 50 84 Z" fill="#E11D48" />
          {/* green top */}
          <polygon points="50,28 42,16 48,22 36,22 46,26 50,14 54,26 64,22 52,22 58,16" fill="#16A34A" />
          {/* seeds */}
          <circle cx="42" cy="40" r="2" fill="#FDE047" />
          <circle cx="58" cy="40" r="2" fill="#FDE047" />
          <circle cx="36" cy="54" r="2" fill="#FDE047" />
          <circle cx="50" cy="52" r="2" fill="#FDE047" />
          <circle cx="64" cy="54" r="2" fill="#FDE047" />
          <circle cx="44" cy="66" r="2" fill="#FDE047" />
          <circle cx="56" cy="66" r="2" fill="#FDE047" />
        </svg>
      );

    case 'bed':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <rect x="14" y="38" width="10" height="42" rx="3" fill="#854D0E" />
          <rect x="76" y="50" width="10" height="30" rx="3" fill="#854D0E" />
          <rect x="20" y="54" width="60" height="18" rx="4" fill="#38BDF8" />
          <rect x="24" y="46" width="20" height="10" rx="3" fill="#FFFFFF" />
          <path d="M 38 54 L 80 54 L 80 66 L 38 66 Z" fill="#60A5FA" />
        </svg>
      );

    case 'lamp':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <polygon points="34,44 66,44 74,62 26,62" fill="#FACC15" />
          <line x1="50" y1="62" x2="50" y2="78" stroke="#64748B" strokeWidth="5" strokeLinecap="round" />
          <ellipse cx="50" cy="80" rx="16" ry="5" fill="#475569" />
          <circle cx="50" cy="40" r="4" fill="#F59E0B" />
        </svg>
      );

    case 'chair':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <rect x="30" y="24" width="8" height="46" rx="2" fill="#92400E" />
          <rect x="34" y="28" width="28" height="20" rx="4" fill="#F59E0B" />
          <rect x="30" y="52" width="40" height="8" rx="2" fill="#B45309" />
          <line x1="34" y1="60" x2="34" y2="82" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
          <line x1="66" y1="60" x2="66" y2="82" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'clock':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="32" fill="#6366F1" />
          <circle cx="50" cy="50" r="26" fill="#FFFFFF" />
          <line x1="50" y1="50" x2="50" y2="34" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          <line x1="50" y1="50" x2="62" y2="50" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="50" cy="50" r="3" fill="#1E293B" />
        </svg>
      );

    case 'pillow':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <rect x="22" y="32" width="56" height="36" rx="10" fill="#E0E7FF" stroke="#818CF8" strokeWidth="4" />
          <path d="M 34 44 Q 50 56 66 44" stroke="#A5B4FC" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'table':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <rect x="18" y="38" width="64" height="12" rx="3" fill="#92400E" />
          <line x1="26" y1="50" x2="26" y2="78" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
          <line x1="74" y1="50" x2="74" y2="78" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );

    case 'red':
      return (
        <div className="w-full h-full rounded-2xl bg-red-500 shadow-inner flex items-center justify-center border-4 border-red-300">
          <span className="text-white font-black text-xl">RED</span>
        </div>
      );
    case 'blue':
      return (
        <div className="w-full h-full rounded-2xl bg-blue-500 shadow-inner flex items-center justify-center border-4 border-blue-300">
          <span className="text-white font-black text-xl">BLUE</span>
        </div>
      );
    case 'green':
      return (
        <div className="w-full h-full rounded-2xl bg-green-500 shadow-inner flex items-center justify-center border-4 border-green-300">
          <span className="text-white font-black text-xl">GREEN</span>
        </div>
      );
    case 'yellow':
      return (
        <div className="w-full h-full rounded-2xl bg-yellow-400 shadow-inner flex items-center justify-center border-4 border-yellow-200">
          <span className="text-yellow-900 font-black text-xl">YELLOW</span>
        </div>
      );
    case 'purple':
      return (
        <div className="w-full h-full rounded-2xl bg-purple-500 shadow-inner flex items-center justify-center border-4 border-purple-300">
          <span className="text-white font-black text-xl">PURPLE</span>
        </div>
      );

    default:
      return (
        <div className="w-full h-full rounded-2xl bg-amber-200 flex items-center justify-center font-bold text-amber-900">
          {key.slice(0, 3).toUpperCase()}
        </div>
      );
  }
}
