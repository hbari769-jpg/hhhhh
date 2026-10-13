import React from 'react';
import { motion } from 'motion/react';

export interface AestificEnhanceLogoProps {
  size?: number;
  className?: string;
  showWordmark?: boolean;
  wordmarkPosition?: 'bottom' | 'right';
  isRotating?: boolean;
  showRings?: boolean;
  ringIntensity?: number; // 0 to 1
  theme?: 'dark' | 'light' | 'auto';
  rotationSpeed?: 'normal' | 'slow' | 'fast';
  scrollRotateDeg?: number; // Optional rotation angle driven by scroll
}

/**
 * Official Aestific Enhance Logo:
 * 1. Exact O-Shaped Symbol:
 *    - Continuous circular toroid ring with precise inner/outer radius ratio
 *    - Signature deep-blue (#1e3a8a) -> electric-blue (#2563eb) -> cyan (#00d8ff) -> purple (#a855f7) gradient
 *    - 3D curvature, specular highlight crests, and subtle depth reflections
 *    - Perfectly centered continuous rotation around center axis with realistic lighting sweeps
 * 2. Concentric Expanding Rings:
 *    - Sequential thin rings emerging from INSIDE the O center core
 *    - Smoothly expanding outward while fading into the ambient atmosphere
 * 3. Stable Wordmark:
 *    - "aestific enhance" in lowercase Comfortaa font
 *    - Remains perfectly stable and readable while the O animates independently
 */
export const AestificEnhanceLogo: React.FC<AestificEnhanceLogoProps> = ({
  size = 72,
  className = '',
  showWordmark = true,
  wordmarkPosition = 'bottom',
  isRotating = true,
  showRings = true,
  ringIntensity = 1,
  theme = 'auto',
  rotationSpeed = 'normal',
  scrollRotateDeg = 0,
}) => {
  // Speed variations
  const animDuration =
    rotationSpeed === 'slow' ? '12s' : rotationSpeed === 'fast' ? '4s' : '7.5s';

  const isDark = theme === 'dark';
  const textColor = isDark ? '#ffffff' : '#09090b';

  return (
    <div
      className={`relative inline-flex ${
        wordmarkPosition === 'bottom'
          ? 'flex-col items-center justify-center text-center gap-4'
          : 'flex-row items-center justify-center gap-4'
      } select-none ${className}`}
    >
      {/* =================================================================== */}
      {/* O-SHAPED SYMBOL CONTAINER WITH EXPANDING RINGS                      */}
      {/* =================================================================== */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* Ambient Volumetric Glow Behind O */}
        <div
          className="absolute inset-0 rounded-full blur-2xl pointer-events-none -z-10 transition-opacity duration-500"
          style={{
            background:
              'radial-gradient(circle, rgba(0,216,255,0.25) 0%, rgba(37,99,235,0.3) 35%, rgba(168,85,247,0.2) 65%, transparent 80%)',
            transform: 'scale(1.4)',
            opacity: ringIntensity,
          }}
        />

        {/* ================================================================= */}
        {/* 1. EXPANDING CONCENTRIC RINGS EMERGING FROM INSIDE CORE           */}
        {/* ================================================================= */}
        {showRings && (
          <div
            className="absolute inset-0 pointer-events-none flex items-center justify-center -z-5"
            style={{ opacity: ringIntensity }}
          >
            {/* Sequential CSS/Motion expanding wave rings */}
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="absolute rounded-full border pointer-events-none"
                style={{
                  width: `${size * 0.45}px`,
                  height: `${size * 0.45}px`,
                  borderColor:
                    index % 2 === 0
                      ? 'rgba(0, 216, 255, 0.65)'
                      : 'rgba(168, 85, 247, 0.65)',
                  animation: `aestificRingExpand 4s cubic-bezier(0.16, 1, 0.3, 1) infinite`,
                  animationDelay: `${index * 1.0}s`,
                  boxShadow:
                    index % 2 === 0
                      ? '0 0 12px rgba(37, 99, 235, 0.3)'
                      : '0 0 14px rgba(168, 85, 247, 0.25)',
                }}
              />
            ))}
          </div>
        )}

        {/* ================================================================= */}
        {/* 2. THE ROTATING O-SHAPED SYMBOL (AUTHENTIC TOROID GEOMETRY)       */}
        {/* ================================================================= */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            perspective: 800,
          }}
        >
          {/* Animated Rotator Wrapper */}
          <div
            className="w-full h-full relative flex items-center justify-center"
            style={{
              transformOrigin: '50% 50%',
              transform: `rotate(${scrollRotateDeg}deg)`,
              animation: isRotating
                ? `aestificORotate ${animDuration} cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite`
                : 'none',
            }}
          >
            <svg
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full overflow-visible"
              style={{ filter: 'drop-shadow(0 4px 16px rgba(37,99,235,0.35))' }}
            >
              <defs>
                {/* Master Aestific Enhance Gradient: Deep Blue -> Royal Blue -> Cyan -> Purple */}
                <linearGradient
                  id="aestific-enhance-core-grad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="28%" stopColor="#2563eb" />
                  <stop offset="55%" stopColor="#00d8ff" />
                  <stop offset="78%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>

                {/* Counter Specular Rim Highlight Gradient */}
                <linearGradient
                  id="aestific-enhance-rim-grad"
                  x1="100%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                  <stop offset="35%" stopColor="#00d8ff" stopOpacity="0.6" />
                  <stop offset="70%" stopColor="#2563eb" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.6" />
                </linearGradient>

                {/* Inner Core Shadow for 3D Torus Volume */}
                <radialGradient
                  id="aestific-enhance-inner-bevel"
                  cx="50%"
                  cy="40%"
                  r="60%"
                >
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                  <stop offset="60%" stopColor="#000000" stopOpacity="0" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.45" />
                </radialGradient>

                {/* 3D Specular Soft Blur Filter */}
                <filter
                  id="aestific-specular-glow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feGaussianBlur stdDeviation="1.6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* 1. Main Solid Torus O-Body (Path with Outer Circle & Inner Hollow Cutout) */}
              <path
                d="M 60 14 A 46 46 0 1 0 60 106 A 46 46 0 1 0 60 14 Z M 60 35 A 25 25 0 1 1 60 85 A 25 25 0 1 1 60 35 Z"
                fill="url(#aestific-enhance-core-grad)"
                fillRule="evenodd"
                filter="url(#aestific-specular-glow)"
              />

              {/* 2. 3D Bevel & Depth Shading Layer */}
              <path
                d="M 60 14 A 46 46 0 1 0 60 106 A 46 46 0 1 0 60 14 Z M 60 35 A 25 25 0 1 1 60 85 A 25 25 0 1 1 60 35 Z"
                fill="url(#aestific-enhance-inner-bevel)"
                fillRule="evenodd"
                style={{ mixBlendMode: 'overlay' }}
                opacity="0.85"
              />

              {/* 3. Outer Edge Highlight Rim */}
              <circle
                cx="60"
                cy="60"
                r="46"
                stroke="url(#aestific-enhance-rim-grad)"
                strokeWidth="1.2"
                fill="none"
                opacity="0.8"
              />

              {/* 4. Inner Edge Highlight Rim (defining the clean hollow core) */}
              <circle
                cx="60"
                cy="60"
                r="25"
                stroke="url(#aestific-enhance-rim-grad)"
                strokeWidth="1.0"
                fill="none"
                opacity="0.9"
              />

              {/* 5. Traveling Specular Glint Arc on Toroid Crest */}
              <path
                d="M 40 20 A 42 42 0 0 1 80 20"
                stroke="#ffffff"
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity="0.75"
                filter="drop-shadow(0 0 4px #00d8ff)"
              />

              {/* 6. Secondary Soft Counter Glint Arc */}
              <path
                d="M 80 100 A 42 42 0 0 1 40 100"
                stroke="#00d8ff"
                strokeWidth="1.4"
                strokeLinecap="round"
                opacity="0.5"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. STABLE BRAND WORDMARK: "aestific enhance" (ALL LOWERCASE)         */}
      {/* =================================================================== */}
      {showWordmark && (
        <div
          className={`flex flex-col items-center justify-center transition-colors pointer-events-auto select-none ${
            wordmarkPosition === 'right' ? 'items-start text-left' : 'text-center'
          }`}
        >
          <div
            className="flex items-baseline gap-2 leading-none"
            style={{
              fontFamily: "'Comfortaa', cursive, sans-serif",
            }}
          >
            <span
              className="text-base sm:text-lg md:text-xl font-medium tracking-[0.20em] lowercase"
              style={{ color: textColor }}
            >
              aestific
            </span>
            <span
              className="text-base sm:text-lg md:text-xl font-normal tracking-[0.16em] lowercase"
              style={{
                background:
                  'linear-gradient(90deg, #2563eb 0%, #00d8ff 50%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              enhance
            </span>
          </div>
        </div>
      )}

      {/* Embedded Inlined Keyframe Animation Styles */}
      <style>{`
        @keyframes aestificORotate {
          0% {
            transform: rotate(0deg) scale(1);
          }
          30% {
            transform: rotate(115deg) scale(1.02);
          }
          60% {
            transform: rotate(235deg) scale(0.99);
          }
          85% {
            transform: rotate(320deg) scale(1.01);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }

        @keyframes aestificRingExpand {
          0% {
            transform: scale(0.65);
            opacity: 0.9;
            border-width: 1.8px;
          }
          40% {
            opacity: 0.65;
            border-width: 1.4px;
          }
          80% {
            opacity: 0.2;
            border-width: 0.9px;
          }
          100% {
            transform: scale(3.2);
            opacity: 0;
            border-width: 0.5px;
          }
        }
      `}</style>
    </div>
  );
};

export default AestificEnhanceLogo;
