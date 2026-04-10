'use client';

import { useState, useEffect, useCallback } from 'react';

interface Slide {
  title: string;
  subtitle: string;
  image: string;
}

const defaultSlides: Slide[] = [
  {
    title: 'Professional International Logistics',
    subtitle: 'Sea, Air, Rail & Multi-modal Transport Solutions',
    image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=1920&h=800&fit=crop',
  },
  {
    title: 'Global Shipping Network',
    subtitle: 'Connecting Your Business to the World',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&h=800&fit=crop',
  },
  {
    title: 'Reliable Customs Brokerage',
    subtitle: 'Professional Import & Export Services',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&h=800&fit=crop',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);

  useEffect(() => {
    fetch('/api/banners')
      .then(r => r.json())
      .then((banners: { title: string; subtitle: string; image: string }[]) => {
        if (banners && banners.length > 0) {
          setSlides(banners.map(b => ({ title: b.title || '', subtitle: b.subtitle || '', image: b.image })));
        }
      })
      .catch(() => {});
  }, []);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-[1.5s] ease-in-out ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[8s] ease-out"
            style={{
              backgroundImage: `url(${slide.image})`,
              transform: i === current ? 'scale(1)' : 'scale(1.05)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
          </div>
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 w-full">
              <div className="max-w-3xl">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white leading-[1.1] tracking-tight animate-fade-in-up">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-white/70 mt-6 md:mt-8 font-light tracking-wide animate-fade-in-up max-w-xl" style={{ animationDelay: '0.15s' }}>
                  {slide.subtitle}
                </p>
                <div className="flex gap-4 mt-10 md:mt-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <a href="/services" className="px-8 py-3.5 bg-white text-gray-900 text-sm font-medium rounded-full hover:bg-white/90 transition-all duration-200">
                    Explore Services
                  </a>
                  <a href="/contact" className="px-8 py-3.5 border border-white/40 text-white text-sm font-medium rounded-full hover:bg-white/10 transition-all duration-200">
                    Get a Quote
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slide indicators — bottom left, Tencent style */}
      <div className="absolute bottom-12 left-6 lg:left-10 z-20 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${i === current ? 'w-10 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/60'}`}
          />
        ))}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-12 right-6 lg:right-10 z-20 text-white/40 text-xs tracking-[0.2em] uppercase flex items-center gap-2">
        <span>Scroll</span>
        <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
      </div>
    </section>
  );
}
