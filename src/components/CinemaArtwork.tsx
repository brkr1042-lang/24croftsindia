import React from 'react';

interface ArtworkProps {
  variant: number;
  title: string;
  subtitle?: string;
  badgeText?: string;
  className?: string;
}

const PALETTES = [
  { bg1: '#14110F', bg2: '#2B1D12', accent: '#F2B705', glow: '#D97706' },
  { bg1: '#0C131F', bg2: '#17253B', accent: '#38BDF8', glow: '#0284C7' },
  { bg1: '#1A0F14', bg2: '#331520', accent: '#F43F5E', glow: '#E11D48' },
  { bg1: '#0D1915', bg2: '#142E24', accent: '#34D399', glow: '#059669' },
  { bg1: '#171324', bg2: '#271E40', accent: '#A78BFA', glow: '#7C3AED' },
  { bg1: '#18181B', bg2: '#27272A', accent: '#FBBF24', glow: '#B45309' },
];

export const CinemaFrameArtwork: React.FC<ArtworkProps> = ({
  variant,
  title,
  subtitle,
  badgeText,
  className = '',
}) => {
  const pal = PALETTES[Math.abs(variant) % PALETTES.length];

  return (
    <div
      className={`relative overflow-hidden bg-[#121215] select-none ${className}`}
      aria-label={title}
    >
      <svg
        viewBox="0 0 640 360"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={title}
      >
        <defs>
          <linearGradient id={`grad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={pal.bg1} />
            <stop offset="100%" stopColor={pal.bg2} />
          </linearGradient>
          <radialGradient id={`flare-${variant}`} cx="72%" cy="35%" r="55%">
            <stop offset="0%" stopColor={pal.accent} stopOpacity="0.28" />
            <stop offset="60%" stopColor={pal.glow} stopOpacity="0.08" />
            <stop offset="100%" stopColor={pal.bg1} stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="640" height="360" fill={`url(#grad-${variant})`} />
        <rect width="640" height="360" fill={`url(#flare-${variant})`} />

        {/* Anamorphic cinema lens rings & studio light beams */}
        <circle
          cx="460"
          cy="140"
          r="110"
          fill="none"
          stroke={pal.accent}
          strokeOpacity="0.16"
          strokeWidth="1.5"
        />
        <circle
          cx="460"
          cy="140"
          r="72"
          fill="none"
          stroke={pal.accent}
          strokeOpacity="0.24"
          strokeWidth="1"
          strokeDasharray="6 6"
        />
        <path
          d="M0 290 L640 220 L640 360 L0 360 Z"
          fill="#09090B"
          fillOpacity="0.65"
        />

        {/* Film sprocket frame lines */}
        <line x1="24" y1="24" x2="616" y2="24" stroke="#FAFAFA" strokeOpacity="0.12" strokeWidth="1" />
        <line x1="24" y1="336" x2="616" y2="336" stroke="#FAFAFA" strokeOpacity="0.12" strokeWidth="1" />

        {/* Cinema camera silhouette */}
        <g transform="translate(415, 95)" opacity="0.45">
          <rect x="0" y="24" width="68" height="46" rx="6" fill="#09090B" stroke={pal.accent} strokeWidth="2" />
          <circle cx="20" cy="12" r="14" fill="#09090B" stroke={pal.accent} strokeWidth="2" />
          <circle cx="50" cy="10" r="16" fill="#09090B" stroke={pal.accent} strokeWidth="2" />
          <polygon points="68,35 94,22 94,62 68,52" fill={pal.accent} fillOpacity="0.35" stroke={pal.accent} strokeWidth="1.5" />
        </g>
      </svg>

      {/* Measured contrast scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

      {/* Play icon & framing */}
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        <div className="flex items-center justify-between text-xs text-zinc-300">
          <span className="font-mono tracking-wider uppercase text-[#F2B705]">
            {badgeText || '24CROFTS CINEMA'}
          </span>
          <span className="font-mono text-zinc-400">4K · YOUTUBE</span>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white line-clamp-1">{title}</p>
            {subtitle && (
              <p className="text-xs text-zinc-300 line-clamp-1 mt-0.5">{subtitle}</p>
            )}
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#F2B705] text-[#09090B] flex items-center justify-center shrink-0 shadow-sm">
            <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AvatarProps {
  name: string;
  craftId: number;
  theme: number;
  size?: 'sm' | 'md' | 'lg';
}

export const ArtistAvatar: React.FC<AvatarProps> = ({
  name,
  craftId,
  theme,
  size = 'md',
}) => {
  const pal = PALETTES[Math.abs(theme) % PALETTES.length];
  const initials = name
    .replace(/\([^)]*\)/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

  const dimensions =
    size === 'lg' ? 'w-20 h-20 text-xl' : size === 'sm' ? 'w-11 h-11 text-xs' : 'w-14 h-14 text-sm';

  return (
    <div
      className={`${dimensions} relative rounded-xl overflow-hidden shrink-0 border border-zinc-800 flex items-center justify-center select-none`}
      style={{
        background: `linear-gradient(135deg, ${pal.bg1} 0%, ${pal.bg2} 100%)`,
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 80 80" className="absolute inset-0 w-full h-full opacity-35">
        <circle cx="62" cy="18" r="24" fill={pal.accent} fillOpacity="0.3" />
        <path
          d="M16 74 C16 54, 64 54, 64 74"
          stroke={pal.accent}
          strokeWidth="2"
          fill="none"
        />
        <circle cx="40" cy="32" r="12" stroke={pal.accent} strokeWidth="2" fill="none" />
      </svg>
      <span className="relative z-10 font-display font-bold tracking-tight text-white">
        {initials || `C${craftId}`}
      </span>
    </div>
  );
};
