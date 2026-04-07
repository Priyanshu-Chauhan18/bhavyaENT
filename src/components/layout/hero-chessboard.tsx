'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const heroImages = [
  '/images/hero-1.png',
  '/images/hero-2.png',
  '/images/hero-3.png',
  '/images/hero-4.png',
  '/images/hero-5.png',
  '/images/hero-6.png',
  '/images/hero-1.png', // reuse to fill 8 cells
  '/images/hero-3.png',
];

// Chess-like pattern: even indices are "animated" cells, odd are "static"
// This creates the alternating chess pattern
const animatedCells = [0, 2, 5, 7]; // like black squares on a chessboard

export function HeroChessboard() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-[100vh] overflow-hidden">
      {/* Chessboard Grid */}
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-0">
        {heroImages.map((src, idx) => {
          const isAnimated = animatedCells.includes(idx);
          // For animated cells, cycle through different images
          const animatedSrc = isAnimated
            ? heroImages[(idx + currentSlide) % heroImages.length]
            : src;

          return (
            <div
              key={idx}
              className="relative overflow-hidden"
            >
              <Image
                src={animatedSrc}
                alt={`Manufacturing ${idx + 1}`}
                fill
                className={`object-cover transition-all duration-1000 ease-in-out ${
                  isAnimated ? 'scale-105' : 'scale-100'
                }`}
                sizes="(max-width: 768px) 50vw, 25vw"
                priority={idx < 4}
              />
              {/* Blur overlay on each cell */}
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
            </div>
          );
        })}
      </div>

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 z-10" />

      {/* Content overlay */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-[100vh] px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl"
        >
          {/* Free-floating Logo with soft aura */}
          <div className="relative mb-12 max-w-4xl mx-auto flex justify-center items-center py-8">
            {/* Soft pulsing aura behind the logo to ensure high contrast without sharp borders */}
            <motion.div 
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="absolute w-[80%] h-[80%] bg-surface/30 blur-[100px] rounded-full z-0"
            />
            
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
              className="relative z-10 w-full px-4 sm:px-8 group"
            >
              <Image
                src="/images/logo/bhavya-logo.png"
                alt="BHAVYAA ENTERPRISES"
                width={900}
                height={250}
                className="w-full h-auto object-contain drop-shadow-[0_12px_30px_rgba(0,0,0,0.8)] transition-transform duration-700 group-hover:scale-[1.03]"
                priority
              />
            </motion.div>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-white/85 mb-8 body-relaxed max-w-2xl mx-auto drop-shadow">
            Premium Bottle Cap Manufacturing — Precision Closures for Every Industry
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalog"
              className="px-8 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-accent-deep to-accent-green rounded-full hover:opacity-90 shadow-lg transition-all"
            >
              Explore Products
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3.5 text-sm font-semibold text-white border border-white/30 rounded-full hover:bg-white/10 backdrop-blur-sm transition-all"
            >
              Contact Sales
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
