import React, { useMemo } from 'react';

interface HeartParticle {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  rotate: number;
  color: string;
}

export const FloatingHearts: React.FC = () => {
  const particles = useMemo(() => {
    const colors = ['#F7C8D0', '#E85D75', '#B42345', '#FFD1DC', '#FFAAA6'];
    const items: HeartParticle[] = [];
    for (let i = 0; i < 22; i++) {
      items.push({
        id: i,
        left: Math.random() * 96 + 2,
        top: Math.random() * 100,
        size: Math.floor(Math.random() * 14) + 12,
        duration: Math.random() * 14 + 16,
        delay: Math.random() * 12,
        opacity: Math.random() * 0.35 + 0.15,
        rotate: Math.floor(Math.random() * 60) - 30,
        color: colors[i % colors.length],
      });
    }
    return items;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Soft romantic ambient gradient blooms */}
      <div className="ambient-bloom ambient-bloom-one absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#F7C8D0]/35 blur-3xl pointer-events-none" />
      <div className="ambient-bloom ambient-bloom-two absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-[#E85D75]/15 blur-3xl pointer-events-none" />
      <div className="ambient-bloom ambient-bloom-three absolute -bottom-32 left-1/4 w-96 h-96 rounded-full bg-[#F7C8D0]/30 blur-3xl pointer-events-none" />

      {/* Floating hearts */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute select-none transform"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            fontSize: `${p.size}px`,
            color: p.color,
            opacity: p.opacity,
            animation: `floatUp ${p.duration}s linear infinite`,
            animationDelay: `-${p.delay}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        >
          {p.id % 5 === 0 ? '🌸' : '💗'}
        </span>
      ))}

      <style>{`
        @keyframes floatUp {
          0% {
            transform: translate3d(-12px, 110vh, 0) rotate(-12deg) scale(0.85);
            opacity: 0;
          }
          10% {
            opacity: 0.35;
          }
          50% {
            transform: translate3d(14px, 45vh, 0) rotate(12deg) scale(1.02);
          }
          90% {
            opacity: 0.35;
          }
          100% {
            transform: translate3d(-8px, -20vh, 0) rotate(32deg) scale(1.15);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
