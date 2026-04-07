'use client';

import React from 'react';

interface MarqueeScrollProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  speed?: number; // seconds for one full cycle
  className?: string;
  pauseOnHover?: boolean;
}

export function MarqueeScroll({
  children,
  direction = 'left',
  speed = 30,
  className = '',
  pauseOnHover = true,
}: MarqueeScrollProps) {
  const animClass = direction === 'left' ? 'marquee-left' : 'marquee-right';

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className={`flex gap-6 w-max ${animClass}`}
        style={{
          animationDuration: `${speed}s`,
          ...(pauseOnHover ? {} : { animationPlayState: 'running' }),
        }}
      >
        {/* Render children twice for seamless loop */}
        {children}
        {children}
      </div>
    </div>
  );
}
