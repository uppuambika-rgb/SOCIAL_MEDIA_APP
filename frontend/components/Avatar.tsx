import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  neonBorder?: 'cyan' | 'violet' | 'emerald' | 'none';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  neonBorder = 'none',
  className = ''
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base font-semibold',
    xl: 'w-20 h-20 text-xl font-bold'
  }[size];

  const borderClasses = {
    none: 'ring-1 ring-white/10',
    cyan: 'ring-2 ring-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.4)]',
    violet: 'ring-2 ring-fuchsia-500 shadow-[0_0_12px_rgba(189,0,255,0.4)]',
    emerald: 'ring-2 ring-emerald-400 shadow-[0_0_12px_rgba(0,255,157,0.4)]'
  }[neonBorder];

  // Derive stable initials
  const initials = name
    .split(' ')
    .map(p => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'NV';

  // Deterministic gradient based on name
  const gradients = [
    'from-cyan-900 to-slate-900 text-cyan-300',
    'from-fuchsia-950 to-slate-900 text-fuchsia-300',
    'from-emerald-950 to-slate-900 text-emerald-300',
    'from-blue-950 to-slate-900 text-blue-300'
  ];
  const charCode = name.charCodeAt(0) || 0;
  const grad = gradients[charCode % gradients.length];

  return (
    <div
      className={`relative shrink-0 rounded-full overflow-hidden bg-slate-900 flex items-center justify-center transition-transform ${sizeClasses} ${borderClasses} ${className}`}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={name}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${grad} flex items-center justify-center font-mono select-none`}>
          {initials}
        </div>
      )}
    </div>
  );
};
