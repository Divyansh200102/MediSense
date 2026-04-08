import { useEffect, useRef } from 'react';

const MEDICAL_SYMBOLS = ['💊', '🩺', '🫀', '🧬', '🔬', '💉', '🩻', '🧪', '❤️‍🩹', '🏥'];

function FloatingIcon({ symbol, delay, duration, left, size }) {
  return (
    <div
      className="absolute pointer-events-none select-none animate-medical-float opacity-0"
      style={{
        left: `${left}%`,
        bottom: '-40px',
        fontSize: `${size}px`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      {symbol}
    </div>
  );
}

function HeartbeatLine() {
  return (
    <svg
      className="absolute bottom-0 left-0 w-full h-24 opacity-[0.08] pointer-events-none"
      viewBox="0 0 1200 100"
      preserveAspectRatio="none"
    >
      <path
        d="M0,50 L200,50 L230,50 L250,20 L270,80 L290,10 L310,90 L330,50 L360,50 L600,50 L630,50 L650,20 L670,80 L690,10 L710,90 L730,50 L760,50 L1000,50 L1030,50 L1050,20 L1070,80 L1090,10 L1110,90 L1130,50 L1160,50 L1200,50"
        fill="none"
        stroke="url(#heartbeat-gradient)"
        strokeWidth="2.5"
        className="animate-heartbeat-draw"
      />
      <defs>
        <linearGradient id="heartbeat-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function DNAHelix({ side = 'left' }) {
  const isLeft = side === 'left';
  return (
    <svg
      className={`absolute ${isLeft ? 'left-0 top-20' : 'right-0 top-40'} w-16 h-80 opacity-[0.08] pointer-events-none animate-dna-rotate`}
      viewBox="0 0 60 300"
      style={{ animationDelay: isLeft ? '0s' : '2s' }}
    >
      {[...Array(10)].map((_, i) => {
        const y = i * 30 + 15;
        const phase = i * 0.6;
        const x1 = 30 + Math.sin(phase) * 20;
        const x2 = 30 - Math.sin(phase) * 20;
        return (
          <g key={i}>
            <circle cx={x1} cy={y} r="3" fill="#6366f1" />
            <circle cx={x2} cy={y} r="3" fill="#10b981" />
            <line x1={x1} y1={y} x2={x2} y2={y} stroke="#6366f1" strokeWidth="1" opacity="0.5" />
          </g>
        );
      })}
    </svg>
  );
}

function GradientOrb({ className }) {
  return <div className={`absolute rounded-full blur-3xl pointer-events-none animate-orb-drift ${className}`} />;
}

function MoleculeGrid() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="molecule-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <circle cx="40" cy="40" r="1.5" fill="#6366f1" />
          <circle cx="0" cy="0" r="1" fill="#6366f1" />
          <circle cx="80" cy="0" r="1" fill="#6366f1" />
          <circle cx="0" cy="80" r="1" fill="#6366f1" />
          <circle cx="80" cy="80" r="1" fill="#6366f1" />
          <line x1="0" y1="0" x2="40" y2="40" stroke="#6366f1" strokeWidth="0.3" />
          <line x1="80" y1="0" x2="40" y2="40" stroke="#6366f1" strokeWidth="0.3" />
          <line x1="0" y1="80" x2="40" y2="40" stroke="#6366f1" strokeWidth="0.3" />
          <line x1="80" y1="80" x2="40" y2="40" stroke="#6366f1" strokeWidth="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#molecule-grid)" />
    </svg>
  );
}

export default function MedicalBackground({ variant = 'default' }) {
  const icons = MEDICAL_SYMBOLS.map((symbol, i) => ({
    symbol,
    delay: i * 3.2 + Math.random() * 2,
    duration: 14 + Math.random() * 8,
    left: (i * 10) + Math.random() * 5,
    size: 16 + Math.random() * 12,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <MoleculeGrid />

      {variant !== 'minimal' && (
        <>
          {icons.map((props, i) => (
            <FloatingIcon key={i} {...props} />
          ))}
          <DNAHelix side="left" />
          <DNAHelix side="right" />
        </>
      )}

      <GradientOrb className="w-[500px] h-[500px] bg-primary-200/30 -top-48 -left-48 animate-orb-drift" />
      <GradientOrb className="w-[400px] h-[400px] bg-accent-200/25 -bottom-32 -right-32 animate-orb-drift" />
      <GradientOrb className="w-[300px] h-[300px] bg-purple-200/20 top-1/3 right-1/4 animate-orb-drift" />
      <GradientOrb className="w-[350px] h-[350px] bg-rose-200/15 top-2/3 left-1/4 animate-orb-drift" />

      <HeartbeatLine />
    </div>
  );
}

export function MedicalIllustration({ type = 'stethoscope', className = '' }) {
  if (type === 'stethoscope') {
    return (
      <svg className={`${className}`} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="90" fill="url(#ill-bg)" opacity="0.08" />
        <path d="M70 60 C70 40, 130 40, 130 60 L130 110 C130 140, 100 160, 100 160 C100 160, 70 140, 70 110 Z" stroke="url(#ill-stroke)" strokeWidth="3" fill="none" />
        <circle cx="100" cy="165" r="10" fill="url(#ill-stroke)" opacity="0.3" />
        <circle cx="100" cy="165" r="5" fill="url(#ill-stroke)" />
        <circle cx="70" cy="55" r="6" fill="url(#ill-stroke)" opacity="0.5" />
        <circle cx="130" cy="55" r="6" fill="url(#ill-stroke)" opacity="0.5" />
        <defs>
          <linearGradient id="ill-bg" x1="0" y1="0" x2="200" y2="200">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="ill-stroke" x1="70" y1="40" x2="130" y2="170">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (type === 'dna') {
    return (
      <svg className={`${className}`} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="90" fill="url(#dna-bg)" opacity="0.06" />
        {[...Array(8)].map((_, i) => {
          const y = 25 + i * 22;
          const phase = i * 0.7;
          const x1 = 100 + Math.sin(phase) * 35;
          const x2 = 100 - Math.sin(phase) * 35;
          return (
            <g key={i}>
              <circle cx={x1} cy={y} r="5" fill="#6366f1" opacity={0.4 + i * 0.07} />
              <circle cx={x2} cy={y} r="5" fill="#10b981" opacity={0.4 + i * 0.07} />
              <line x1={x1} y1={y} x2={x2} y2={y} stroke="#6366f1" strokeWidth="1.5" opacity="0.2" />
            </g>
          );
        })}
        <defs>
          <linearGradient id="dna-bg" x1="0" y1="0" x2="200" y2="200">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (type === 'pulse') {
    return (
      <svg className={`${className}`} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="90" fill="url(#pulse-bg)" opacity="0.16" />
        <path
          d="M20,100 L60,100 L75,60 L90,140 L105,40 L120,160 L135,100 L180,100"
          stroke="url(#pulse-stroke)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="animate-heartbeat-draw"
        />
        <defs>
          <linearGradient id="pulse-bg" x1="0" y1="0" x2="200" y2="200">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="pulse-stroke" x1="20" y1="100" x2="180" y2="100">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (type === 'shield') {
    return (
      <svg className={`${className}`} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 15 L170 50 L170 110 C170 150 140 175 100 190 C60 175 30 150 30 110 L30 50 Z" fill="url(#shield-fill)" opacity="0.1" />
        <path d="M100 15 L170 50 L170 110 C170 150 140 175 100 190 C60 175 30 150 30 110 L30 50 Z" stroke="url(#shield-stroke)" strokeWidth="3" fill="none" />
        <path d="M80 105 L95 120 L125 85" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M90 55 L110 55 L110 70 L120 70 L120 85 L110 85 L110 100 L90 100 L90 85 L80 85 L80 70 L90 70 Z" fill="url(#shield-stroke)" opacity="0.15" />
        <defs>
          <linearGradient id="shield-fill" x1="30" y1="15" x2="170" y2="190"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#10b981" /></linearGradient>
          <linearGradient id="shield-stroke" x1="30" y1="15" x2="170" y2="190"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#10b981" /></linearGradient>
        </defs>
      </svg>
    );
  }

  if (type === 'capsule') {
    return (
      <svg className={`${className}`} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="90" fill="url(#cap-bg)" opacity="0.06" />
        <rect x="65" y="50" width="70" height="100" rx="35" stroke="url(#cap-stroke)" strokeWidth="3" fill="none" />
        <line x1="65" y1="100" x2="135" y2="100" stroke="url(#cap-stroke)" strokeWidth="2" />
        <rect x="68" y="52" width="64" height="46" rx="32" fill="#6366f1" opacity="0.15" />
        <rect x="68" y="102" width="64" height="46" rx="32" fill="#10b981" opacity="0.15" />
        <circle cx="100" cy="75" r="4" fill="#6366f1" opacity="0.4" />
        <circle cx="88" cy="82" r="2.5" fill="#6366f1" opacity="0.3" />
        <circle cx="112" cy="82" r="2.5" fill="#6366f1" opacity="0.3" />
        <defs>
          <linearGradient id="cap-bg" x1="0" y1="0" x2="200" y2="200"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#10b981" /></linearGradient>
          <linearGradient id="cap-stroke" x1="65" y1="50" x2="135" y2="150"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#10b981" /></linearGradient>
        </defs>
      </svg>
    );
  }

  if (type === 'microscope') {
    return (
      <svg className={`${className}`} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="90" fill="url(#micro-bg)" opacity="0.06" />
        <rect x="92" y="40" width="16" height="80" rx="3" stroke="url(#micro-stroke)" strokeWidth="2.5" fill="none" />
        <circle cx="100" cy="35" r="14" stroke="url(#micro-stroke)" strokeWidth="2.5" fill="url(#micro-bg)" fillOpacity="0.15" />
        <ellipse cx="100" cy="140" rx="40" ry="6" stroke="url(#micro-stroke)" strokeWidth="2" fill="none" />
        <line x1="100" y1="120" x2="100" y2="134" stroke="url(#micro-stroke)" strokeWidth="2.5" />
        <line x1="80" y1="80" x2="70" y2="95" stroke="url(#micro-stroke)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="65" cy="100" r="8" stroke="#10b981" strokeWidth="2" fill="none" opacity="0.4" />
        <circle cx="100" cy="35" r="5" fill="#6366f1" opacity="0.3" />
        <defs>
          <linearGradient id="micro-bg" x1="0" y1="0" x2="200" y2="200"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#10b981" /></linearGradient>
          <linearGradient id="micro-stroke" x1="60" y1="20" x2="140" y2="150"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#10b981" /></linearGradient>
        </defs>
      </svg>
    );
  }

  if (type === 'heart') {
    return (
      <svg className={`${className}`} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="90" fill="url(#heart-bg)" opacity="0.06" />
        <path d="M100 160 C60 130 30 100 30 70 C30 45 50 30 75 30 C90 30 100 40 100 40 C100 40 110 30 125 30 C150 30 170 45 170 70 C170 100 140 130 100 160 Z" stroke="url(#heart-stroke)" strokeWidth="3" fill="url(#heart-bg)" fillOpacity="0.12" />
        <path d="M65 90 L85 90 L92 70 L100 110 L108 65 L116 95 L135 95" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" className="animate-heartbeat-draw" />
        <defs>
          <linearGradient id="heart-bg" x1="30" y1="30" x2="170" y2="160"><stop offset="0%" stopColor="#ef4444" /><stop offset="100%" stopColor="#ec4899" /></linearGradient>
          <linearGradient id="heart-stroke" x1="30" y1="30" x2="170" y2="160"><stop offset="0%" stopColor="#ef4444" /><stop offset="100%" stopColor="#ec4899" /></linearGradient>
        </defs>
      </svg>
    );
  }

  return null;
}

export function CrossPattern({ className = '' }) {
  return (
    <svg className={`absolute opacity-[0.03] pointer-events-none ${className}`} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="med-cross" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M25,20 L35,20 L35,25 L40,25 L40,35 L35,35 L35,40 L25,40 L25,35 L20,35 L20,25 L25,25 Z" fill="#6366f1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#med-cross)" />
    </svg>
  );
}
