import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowUp, ArrowRight, Check } from 'lucide-react';
import { AestificArchIcon } from './AestificLogo';
import { AestificEnhanceLogo } from './AestificEnhanceLogo';

interface CinematicLandingPageProps {
  user: any;
  onGetStarted: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onStartWithPrompt: (prompt: string) => void;
}

// Exact prompts from specification
const S1_RAW_PROMPT = 'write an essay about cows.';
const S1_ENHANCED_PROMPT =
  'write a well-organized bengali school essay about the cow (গরু). include an appropriate title, an introduction, the cow’s appearance, food and habitat, its importance in agriculture, the milk and other benefits it provides, its role in rural life, and a conclusion. use simple, grammatically correct bengali suitable for school students. organize the essay into clear paragraphs, keep the facts accurate, and make it easy to understand and memorize.';

const S2_RAW_PROMPT = 'গরু সম্পর্কে একটি রচনা লিখে দাও।';
const S2_ENHANCED_PROMPT =
  'সহজ ও শুদ্ধ বাংলায় স্কুলের শিক্ষার্থীদের উপযোগী ‘গরু’ বিষয়ে একটি পূর্ণাঙ্গ রচনা লেখো। রচনাটিতে একটি সুন্দর শিরোনাম, ভূমিকা, গরুর পরিচয় ও শারীরিক বৈশিষ্ট্য, খাদ্যাভ্যাস, মানুষের জীবনে গরুর গুরুত্ব, দুধ ও কৃষিকাজে গরুর অবদান এবং উপসংহার অন্তর্ভুক্ত করো। প্রতিটি বিষয় আলাদা ও সুসংগঠিত অনুচ্ছেদে ব্যাখ্যা করো। ভাষা সহজ, তথ্য নির্ভুল এবং রচনাটি পরীক্ষার খাতায় লেখার উপযোগী রাখো।';

/**
 * Exact Aestific Enhance O-Ring System:
 * - Faithful circular toroid geometry with precise inner/outer proportions
 * - Cinematic center-axis rotation with realistic 3D lighting highlights
 * - Concentric expanding rings emerging from inside the core
 * - Deep Blue -> Electric Blue -> Cyan -> Purple gradient
 */
export const CinematicORingSystem: React.FC<{
  size?: number;
  className?: string;
  isActivated?: boolean;
  expandIntensity?: number; // 0 to 1
  showRipples?: boolean;
  glow?: boolean;
  showWordmark?: boolean;
}> = ({
  size = 64,
  className = '',
  isActivated = false,
  expandIntensity = 0.5,
  showRipples = true,
  glow = true,
  showWordmark = false,
}) => {
  return (
    <AestificEnhanceLogo
      size={size}
      className={className}
      showWordmark={showWordmark}
      isRotating={isActivated || true}
      showRings={showRipples}
      ringIntensity={expandIntensity}
      theme="auto"
    />
  );
};


export const CinematicLandingPage: React.FC<CinematicLandingPageProps> = ({
  onGetStarted,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalized scroll progress 0.00 -> 1.00
  const progressValue = useMotionValue(0);
  const smoothProgress = useSpring(progressValue, {
    stiffness: 140,
    damping: 24,
    mass: 0.2,
  });

  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    const unsub = smoothProgress.on('change', (v) => setCurrentProgress(v));
    return () => unsub();
  }, [smoothProgress]);

  // Extended virtual scroll runway to provide generous stationary reading time
  const TOTAL_DISTANCE = 8400;

  const scrollToRatio = useCallback((ratio: number) => {
    const el = containerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(1, ratio));
    el.scrollTo({
      top: clamped * TOTAL_DISTANCE,
      behavior: 'smooth',
    });
    progressValue.set(clamped);
  }, [progressValue]);

  const updateProgressFromScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll > 0) {
      const p = Math.max(0, Math.min(1, el.scrollTop / maxScroll));
      progressValue.set(p);
    }
  }, [progressValue]);

  // Multi-input wheel, touch, and keyboard navigation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const current = el.scrollTop;
      const target = Math.max(0, Math.min(el.scrollHeight - el.clientHeight, current + e.deltaY * 1.15));
      el.scrollTop = target;
      updateProgressFromScroll();
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const deltaY = (touchStartY - currentY) * 1.5;
      touchStartY = currentY;
      el.scrollTop = Math.max(0, Math.min(el.scrollHeight - el.clientHeight, el.scrollTop + deltaY));
      updateProgressFromScroll();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        el.scrollBy({ top: 340, behavior: 'smooth' });
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        el.scrollBy({ top: -340, behavior: 'smooth' });
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    updateProgressFromScroll();

    return () => {
      el.removeEventListener('wheel', onWheel);
      window.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [updateProgressFromScroll]);

  // =========================================================================
  // SCENE TIMELINE & TRANSFORM VALUES
  // =========================================================================

  // Opening Phase: Black space active until 0.12
  const isDarkPhase = currentProgress < 0.12;

  // 1. BEAT 0-1 (0.00 -> 0.025): Faint deep-blue light pulse in near-total darkness
  const beat1SingularityOpacity = useTransform(smoothProgress, [0, 0.015, 0.035], [0.35, 0.9, 0.4]);
  const beat1SingularityScale = useTransform(smoothProgress, [0, 0.03], [0.85, 1.4]);

  // 2. BEAT 1-2 (0.025 -> 0.055): Thin blue/purple light trails sweeping from edges
  const beat2TrailsOpacity = useTransform(smoothProgress, [0.02, 0.035, 0.055], [0, 1, 0.2]);

  // 3. BEAT 2-3 (0.050 -> 0.075): Convergence beat into luminous O-ring outline + flash
  const beat3CircleOpacity = useTransform(smoothProgress, [0.048, 0.058, 0.075], [0, 1, 0.6]);
  const beat3CircleScale = useTransform(smoothProgress, [0.048, 0.06, 0.075], [1.8, 1, 1.05]);
  const beat3FlashOpacity = useTransform(smoothProgress, [0.056, 0.062, 0.072], [0, 0.85, 0]);

  // 4. BEAT 3-4 (0.070 -> 0.105): Title reveal: "introducing aestific enhance" (resolves from blur)
  const beat4TitleOpacity = useTransform(smoothProgress, [0.068, 0.08, 0.115, 0.128], [0, 1, 1, 0]);
  const beat4TitleScale = useTransform(smoothProgress, [0.068, 0.09, 0.128], [0.95, 1, 1.03]);

  // 5. BEAT 4-6 (0.095 -> 0.125): Soft blue-purple light wave travels behind title
  const beat5WaveOpacity = useTransform(smoothProgress, [0.088, 0.105, 0.125], [0, 0.85, 0]);
  const beat5WaveX = useTransform(smoothProgress, [0.088, 0.125], [-120, 120]);

  // =========================================================================
  // SCENE ONE: ENGLISH PROMPT (0.12 -> 0.44)
  // =========================================================================

  // 1A. Chat Input with Typing: "write an essay about cows." (0.12 -> 0.22)
  const s1InputOpacity = useTransform(smoothProgress, [0.12, 0.14, 0.23, 0.26], [0, 1, 1, 0]);
  const s1InputY = useTransform(smoothProgress, [0.12, 0.15, 0.23, 0.26], [35, 0, 0, -25]);

  const s1TypeRatio = Math.max(0, Math.min(1, (currentProgress - 0.135) / 0.075));
  const s1TypedLen = Math.floor(s1TypeRatio * S1_RAW_PROMPT.length);
  const s1TypedText = S1_RAW_PROMPT.slice(0, s1TypedLen);

  // 1B. Activation of Enhance with expanding O-ring ripples (0.22 -> 0.30)
  const s1ActivationOpacity = useTransform(smoothProgress, [0.22, 0.25, 0.29, 0.32], [0, 1, 1, 0]);
  const s1OrbActivated = currentProgress >= 0.22 && currentProgress < 0.42;

  // Dynamic ripple intensity driven by scroll in Scene 1
  const s1RippleIntensity = Math.min(1, Math.max(0, (currentProgress - 0.22) / 0.08));

  // 1C. Progressive Prompt Transformation (0.28 -> 0.38)
  const s1TransformOpacity = useTransform(smoothProgress, [0.28, 0.31, 0.37, 0.40], [0, 1, 1, 0]);
  const s1TransformY = useTransform(smoothProgress, [0.28, 0.32, 0.37, 0.40], [35, 0, 0, -25]);

  // 1D. Send Action & Conversation View with Bengali AI Essay (0.37 -> 0.48)
  const s1ConversationOpacity = useTransform(smoothProgress, [0.38, 0.41, 0.47, 0.50], [0, 1, 1, 0]);
  const s1ConversationY = useTransform(smoothProgress, [0.38, 0.41, 0.47, 0.50], [35, 0, 0, -25]);

  const s1AiStreamProgress = Math.max(0, Math.min(1, (currentProgress - 0.405) / 0.065));

  // =========================================================================
  // CINEMATIC BRIDGE BETWEEN EXAMPLES (0.48 -> 0.54)
  // O-Ring System anchors the transition with expanding ripples
  // =========================================================================
  const sBridgeOpacity = useTransform(smoothProgress, [0.48, 0.505, 0.525, 0.545], [0, 1, 1, 0]);
  const sBridgeScale = useTransform(smoothProgress, [0.48, 0.515], [0.92, 1.15]);
  const bridgeRippleIntensity = Math.min(1, Math.max(0, (currentProgress - 0.48) / 0.04));

  // =========================================================================
  // SCENE TWO: BANGLA-ONLY PROMPT (0.54 -> 0.78)
  // =========================================================================

  // 2A. Fresh Chat Input typing: "গরু সম্পর্কে একটি রচনা লিখে দাও।" (0.54 -> 0.63)
  const s2InputOpacity = useTransform(smoothProgress, [0.535, 0.56, 0.63, 0.66], [0, 1, 1, 0]);
  const s2InputY = useTransform(smoothProgress, [0.535, 0.57, 0.63, 0.66], [35, 0, 0, -25]);

  const s2TypeRatio = Math.max(0, Math.min(1, (currentProgress - 0.55) / 0.065));
  const s2TypedLen = Math.floor(s2TypeRatio * S2_RAW_PROMPT.length);
  const s2TypedText = S2_RAW_PROMPT.slice(0, s2TypedLen);

  // 2B. Activation of Enhance with O-ring ripples in Bengali (0.62 -> 0.70)
  const s2ActivationOpacity = useTransform(smoothProgress, [0.62, 0.65, 0.69, 0.72], [0, 1, 1, 0]);
  const s2OrbActivated = currentProgress >= 0.62 && currentProgress < 0.78;
  const s2RippleIntensity = Math.min(1, Math.max(0, (currentProgress - 0.62) / 0.07));

  // 2C. Transformation into detailed Bengali instruction (0.68 -> 0.76)
  const s2TransformOpacity = useTransform(smoothProgress, [0.68, 0.71, 0.75, 0.78], [0, 1, 1, 0]);
  const s2TransformY = useTransform(smoothProgress, [0.68, 0.72, 0.75, 0.78], [35, 0, 0, -25]);

  // 2D. Send Action & Conversation View with Bengali AI Essay (0.75 -> 0.82)
  const s2ConversationOpacity = useTransform(smoothProgress, [0.75, 0.775, 0.81, 0.835], [0, 1, 1, 0]);
  const s2ConversationY = useTransform(smoothProgress, [0.75, 0.78, 0.81, 0.835], [35, 0, 0, -25]);

  const s2AiStreamProgress = Math.max(0, Math.min(1, (currentProgress - 0.765) / 0.05));

  // =========================================================================
  // STAGE 4: OVERHAULED FINAL BUILD-UP & TWO DISTINCT TAGLINE REVEALS
  // (0.81 -> 1.00)
  //
  // 1. Central O-Ring System anchors the finale with expanding waves of intelligence (0.81 -> 0.98)
  // 2. Line 1: "end of prompt engineering" (0.825 -> 0.895) with LONG STATIONARY HOLD
  // 3. Short visual pause (0.895 -> 0.915)
  // 4. Line 2: "into the era of aestific enhance" (0.915 -> 0.980) with LONG STATIONARY HOLD
  // 5. Final expanding rings dissolve into radiant light -> Authentic Aestific Logo (0.98 -> 1.00)
  // =========================================================================

  // Central Finale O-Ring System Visual Anchor (0.815 -> 0.985)
  const finaleORingOpacity = useTransform(smoothProgress, [0.815, 0.835, 0.975, 0.985], [0, 1, 1, 0]);
  const finaleORingScale = useTransform(smoothProgress, [0.815, 0.90, 0.98], [0.85, 1, 1.25]);
  const finaleRippleIntensity = Math.min(1, Math.max(0, (currentProgress - 0.82) / 0.14));

  // =========================================================================
  // TAGLINE 1: "end of prompt engineering"
  // Fade-in & rise: 0.825 -> 0.84
  // STATIONARY READABLE HOLD: 0.840 -> 0.885 (massive scroll distance)
  // Smooth fade-out: 0.885 -> 0.900
  // =========================================================================
  const sTagline1Opacity = useTransform(smoothProgress, [0.825, 0.842, 0.888, 0.902], [0, 1, 1, 0]);
  const sTagline1Y = useTransform(smoothProgress, [0.825, 0.842, 0.888, 0.902], [28, 0, 0, -20]);

  // =========================================================================
  // TAGLINE 2: "into the era of aestific enhance"
  // (Never simultaneous with Line 1. Short visual pause at 0.900-0.915)
  // Confident dramatic entrance: 0.915 -> 0.932
  // STATIONARY READABLE HOLD: 0.932 -> 0.972 (massive scroll distance)
  // Dissolves into light: 0.972 -> 0.985
  // =========================================================================
  const sTagline2Opacity = useTransform(smoothProgress, [0.915, 0.932, 0.972, 0.985], [0, 1, 1, 0]);
  const sTagline2Y = useTransform(smoothProgress, [0.915, 0.932, 0.972, 0.985], [32, 0, 0, -18]);
  const sTagline2Glow = useTransform(smoothProgress, [0.915, 0.935, 0.97], [0, 0.85, 0.3]);

  // Final Authentic Aestific Emblem + "aestific" Wordmark (0.982 -> 1.00)
  const sFinalLogoOpacity = useTransform(smoothProgress, [0.982, 0.99, 1], [0, 1, 1]);
  const sFinalLogoScale = useTransform(smoothProgress, [0.982, 0.995], [0.92, 1]);

  return (
    <div
      ref={containerRef}
      onScroll={updateProgressFromScroll}
      className={`fixed inset-0 z-50 w-screen h-screen overflow-y-scroll overflow-x-hidden transition-colors duration-700 selection:bg-zinc-800 selection:text-white ${
        isDarkPhase ? 'bg-black text-white' : 'bg-white text-zinc-950'
      }`}
      style={{
        fontFamily: "'Comfortaa', 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y',
      }}
    >
      {/* 
        Virtual Scroll Runway
        Extended distance permits deliberate reading pauses without rushing
      */}
      <div style={{ height: `${TOTAL_DISTANCE + window.innerHeight}px` }} className="relative w-full pointer-events-none">

        {/* 
          Pinned Full-Screen Cinematic Viewport (100vw x 100svh)
          NO headers, NO footers, NO sidebars.
        */}
        <div
          className={`sticky top-0 w-full h-[100dvh] flex flex-col justify-between overflow-hidden select-none pointer-events-auto transition-colors duration-700 ${
            isDarkPhase ? 'bg-black text-white' : 'bg-white text-zinc-950'
          }`}
        >

          {/* =================================================================== */}
          {/* THE ONLY PERSISTENT UI ELEMENT: "open chat" (ALL LOWERCASE)         */}
          {/* =================================================================== */}
          <div className="absolute top-5 right-5 sm:top-6 sm:right-8 z-50 pointer-events-auto">
            <button
              onClick={onGetStarted}
              className={`group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold lowercase tracking-wide transition-all duration-300 cursor-pointer shadow-xs active:scale-95 ${
                isDarkPhase
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200/80'
              }`}
              title="open chat"
            >
              <span>open chat</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* =================================================================== */}
          {/* CENTER VIEWPORT STAGE: THE OVERHAULED CINEMATIC NARRATIVE           */}
          {/* =================================================================== */}
          <div className="relative flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-center">

            {/* ================================================================ */}
            {/* OVERHAULED OPENING: 4-6 SECONDS CHOREOGRAPHED ANTICIPATION       */}
            {/* ================================================================ */}

            {/* 0-1s: Central deep-blue singularity light pulse */}
            <motion.div
              style={{
                opacity: beat1SingularityOpacity,
                scale: beat1SingularityScale,
                pointerEvents: 'none',
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div
                className="w-48 h-48 sm:w-64 sm:h-64 rounded-full blur-3xl"
                style={{
                  background:
                    'radial-gradient(circle, rgba(30,58,138,0.7) 0%, rgba(37,99,235,0.3) 50%, transparent 80%)',
                }}
              />
            </motion.div>

            {/* 1-2s: Converging thin blue/purple light trails from edges */}
            <motion.div
              style={{
                opacity: beat2TrailsOpacity,
                pointerEvents: 'none',
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <svg className="w-full h-full max-w-2xl max-h-[500px]" viewBox="0 0 600 600" fill="none">
                <defs>
                  <linearGradient id="trailGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0" />
                    <stop offset="50%" stopColor="#2563eb" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="1" />
                  </linearGradient>
                  <linearGradient id="trailGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0" />
                    <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="1" />
                  </linearGradient>
                </defs>

                <line x1="80" y1="120" x2="300" y2="300" stroke="url(#trailGrad1)" strokeWidth="1.2" strokeDasharray="160 40" />
                <line x1="520" y1="140" x2="300" y2="300" stroke="url(#trailGrad2)" strokeWidth="1.2" strokeDasharray="140 30" />
                <line x1="100" y1="480" x2="300" y2="300" stroke="url(#trailGrad2)" strokeWidth="1.2" strokeDasharray="150 40" />
                <line x1="500" y1="460" x2="300" y2="300" stroke="url(#trailGrad1)" strokeWidth="1.2" strokeDasharray="180 30" />

                <circle cx="270" cy="270" r="1.5" fill="#3b82f6" opacity="0.75" />
                <circle cx="330" cy="280" r="1.5" fill="#8b5cf6" opacity="0.75" />
                <circle cx="290" cy="330" r="1.5" fill="#2563eb" opacity="0.6" />
                <circle cx="320" cy="320" r="1.5" fill="#60a5fa" opacity="0.7" />
              </svg>
            </motion.div>

            {/* 2-3s: Converged O-ring system reveal + controlled flash */}
            <motion.div
              style={{
                opacity: beat3CircleOpacity,
                scale: beat3CircleScale,
                pointerEvents: 'none',
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative flex items-center justify-center">
                <CinematicORingSystem size={96} isActivated={true} expandIntensity={0.8} />

                <motion.div
                  style={{
                    opacity: beat3FlashOpacity,
                    background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(96,165,250,0.6) 40%, transparent 75%)',
                  }}
                  className="absolute inset-0 rounded-full blur-xl -z-10"
                />
              </div>
            </motion.div>

            {/* 3-4s: Title reveal: "introducing aestific enhance" (resolves from blur) */}
            <motion.div
              style={{
                opacity: beat4TitleOpacity,
                scale: beat4TitleScale,
                pointerEvents: currentProgress < 0.12 ? 'auto' : 'none',
              }}
              className="absolute inset-x-0 mx-auto max-w-2xl flex flex-col items-center justify-center text-center px-4"
            >
              <motion.div
                style={{
                  opacity: beat5WaveOpacity,
                  x: beat5WaveX,
                  background:
                    'linear-gradient(90deg, rgba(30,58,138,0.6) 0%, rgba(37,99,235,0.8) 50%, rgba(139,92,246,0.6) 100%)',
                }}
                className="absolute w-72 h-20 rounded-full blur-2xl -z-10 pointer-events-none"
              />

              <h1
                className="text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white leading-tight lowercase"
                style={{
                  fontFamily: "'Comfortaa', cursive, sans-serif",
                  filter: `blur(${Math.max(0, (1 - Math.min(1, Math.max(0, (currentProgress - 0.068) / 0.018))) * 8)}px)`,
                }}
              >
                introducing aestific enhance
              </h1>

              <p className="mt-4 text-[11px] font-mono tracking-[0.25em] text-zinc-400 lowercase">
                scroll to explore
              </p>
            </motion.div>

            {/* ================================================================ */}
            {/* SCENE ONE: ENGLISH PROMPT DEMONSTRATION                          */}
            {/* "write an essay about cows."                                     */}
            {/* ================================================================ */}

            {/* 1A: Chat Input with Typing */}
            <motion.div
              style={{
                opacity: s1InputOpacity,
                y: s1InputY,
                pointerEvents: currentProgress >= 0.12 && currentProgress < 0.25 ? 'auto' : 'none',
              }}
              className="absolute inset-x-0 mx-auto max-w-2xl flex flex-col items-center px-4"
            >
              <div className="w-full bg-white rounded-3xl border border-zinc-200/90 p-5 sm:p-6 shadow-xl shadow-zinc-200/40 relative">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 mt-0.5">
                    <AestificArchIcon size={18} className="text-zinc-800" />
                  </div>
                  <div className="flex-1 min-h-[52px] flex items-center">
                    <p className="text-base sm:text-xl font-medium text-zinc-950 tracking-tight flex items-center lowercase">
                      <span>{s1TypedText || 'w'}</span>
                      <span className="w-2 h-5 bg-zinc-950 ml-1 animate-pulse" />
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-zinc-50 border border-zinc-100 lowercase">
                    user input
                  </span>

                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-800 shadow-2xs lowercase">
                      <CinematicORingSystem size={18} isActivated={false} showRipples={false} />
                      <span>enhance</span>
                    </div>

                    <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-400">
                      <ArrowUp className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 1B: Activation of Enhance with Expanding O-Ring Ripples */}
            <motion.div
              style={{
                opacity: s1ActivationOpacity,
                pointerEvents: currentProgress >= 0.22 && currentProgress < 0.31 ? 'auto' : 'none',
              }}
              className="absolute inset-x-0 mx-auto max-w-2xl flex flex-col items-center px-4"
            >
              <div className="w-full relative">
                <div
                  className="absolute -inset-1 rounded-[28px] blur-md -z-10 animate-pulse"
                  style={{
                    background:
                      'linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #8b5cf6 100%)',
                  }}
                />

                <div className="w-full bg-white rounded-3xl p-5 sm:p-6 shadow-2xl relative border border-blue-200">
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <AestificArchIcon size={18} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-h-[52px] flex items-center">
                      <p className="text-base sm:text-xl font-medium text-zinc-950 tracking-tight lowercase">
                        {S1_RAW_PROMPT}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-blue-100 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/80 border border-blue-200 text-xs font-semibold text-blue-700 lowercase">
                      <CinematicORingSystem size={20} isActivated={s1OrbActivated} expandIntensity={s1RippleIntensity} />
                      <span>enhancing your prompt...</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative flex items-center justify-center">
                        <span className="absolute -inset-1.5 rounded-full bg-blue-500/20 animate-ping" />
                        <div
                          className="px-3.5 py-1.5 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 shadow-md lowercase"
                          style={{
                            background:
                              'linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #8b5cf6 100%)',
                          }}
                        >
                          <CinematicORingSystem size={18} isActivated={true} expandIntensity={0.7} glow={false} />
                          <span>active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 1C: Progressive Transformation into Detailed Instruction */}
            <motion.div
              style={{
                opacity: s1TransformOpacity,
                y: s1TransformY,
                pointerEvents: currentProgress >= 0.28 && currentProgress < 0.39 ? 'auto' : 'none',
              }}
              className="absolute inset-x-0 mx-auto max-w-3xl flex flex-col items-center px-4"
            >
              <div className="w-full bg-white rounded-3xl border border-zinc-200 p-5 sm:p-7 shadow-2xl relative">
                <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-zinc-900 lowercase">
                      enhanced specification
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400 lowercase">
                    target: school essay (বাংলা)
                  </span>
                </div>

                <div className="text-sm sm:text-base md:text-[15px] text-zinc-800 leading-relaxed font-normal select-text space-y-2.5 lowercase">
                  <p>
                    write a well-organized bengali school essay about the cow (গরু).
                  </p>
                  <p>
                    include an appropriate title, an introduction, the cow’s appearance, food and habitat, its importance in agriculture, the milk and other benefits it provides, its role in rural life, and a conclusion.
                  </p>
                  <p>
                    use simple, grammatically correct bengali suitable for school students. organize the essay into clear paragraphs, keep the facts accurate, and make it easy to understand and memorize.
                  </p>
                </div>

                <div className="mt-4 pt-3.5 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500 font-mono lowercase">
                  <span>structured & ready to dispatch</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                </div>
              </div>
            </motion.div>

            {/* 1D: Send Action & Conversation View with Bengali AI Essay */}
            <motion.div
              style={{
                opacity: s1ConversationOpacity,
                y: s1ConversationY,
                pointerEvents: currentProgress >= 0.38 && currentProgress < 0.49 ? 'auto' : 'none',
              }}
              className="absolute inset-x-0 mx-auto max-w-3xl flex flex-col gap-4 px-4 w-full"
            >
              <div className="self-end max-w-xl bg-zinc-900 text-white rounded-2xl rounded-tr-sm p-4 text-xs sm:text-sm leading-relaxed shadow-md lowercase">
                <div className="text-[10px] uppercase font-mono text-zinc-400 mb-1">
                  sent prompt
                </div>
                {S1_ENHANCED_PROMPT}
              </div>

              <div className="self-start w-full bg-white border border-zinc-200/90 rounded-2xl rounded-tl-sm p-5 sm:p-7 shadow-xl">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-100">
                  <div className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center">
                    <AestificArchIcon size={14} className="text-white" />
                  </div>
                  <span className="text-xs font-semibold text-black lowercase">aestific ai</span>
                  <span className="text-[10px] font-mono text-zinc-400 ml-auto lowercase">
                    {s1AiStreamProgress < 1 ? 'streaming…' : 'complete'}
                  </span>
                </div>

                <div
                  className="space-y-3.5 text-xs sm:text-sm leading-relaxed text-zinc-800 select-text"
                  style={{ fontFamily: "'Comfortaa', 'Hind Siliguri', 'Noto Sans Bengali', system-ui, sans-serif" }}
                >
                  <h2 className="text-lg sm:text-xl font-bold text-center text-black py-1">
                    গরু
                  </h2>

                  <p>
                    <strong className="text-black font-semibold">ভূমিকা:</strong> গরু আমাদের অতি পরিচিত একটি চতুষ্পদ গৃহপালিত প্রাণী। প্রাচীনকাল থেকেই গ্রামবাংলার প্রতিটি পরিবারের সাথে গরুর সম্পর্ক অত্যন্ত নিবিড়। শান্ত স্বভাবের এই নিরীহ প্রাণীটি মানুষের বহুবিধ প্রয়োজনে নিজেকে নিয়োজিত রাখে।
                  </p>

                  {s1AiStreamProgress > 0.3 && (
                    <p>
                      <strong className="text-black font-semibold">আকৃতি ও বৈশিষ্ট্য:</strong> গরুর দুটি কান, দুটি চোখ, দুটি শিং, চারটি পা এবং একটি লম্বা লেজ রয়েছে। এদের সারা দেহ ছোট ছোট লোমে আবৃত থাকে। গরু বিভিন্ন বর্ণের হতে পারে—যেমন লাল, সাদা, কালো এবং চিত্রা। এদের পায়ে শক্ত খুর থাকে।
                    </p>
                  )}

                  {s1AiStreamProgress > 0.55 && (
                    <p>
                      <strong className="text-black font-semibold">খাদ্য ও বাসস্থান:</strong> গরু সম্পূর্ণ তৃণভোজী প্রাণী। কাঁচা ঘাস, খড়, কুঁড়া, ভাতের মাড় ও খৈল এদের প্রধান খাদ্য। কৃষকেরা এদের নিরাপদে থাকার জন্য গোয়ালঘর নির্মাণ করেন।
                    </p>
                  )}

                  {s1AiStreamProgress > 0.75 && (
                    <p>
                      <strong className="text-black font-semibold">কৃষিতে ভূমিকা ও উপকারিতা:</strong> আমাদের কৃষিপ্রধান দেশে জমি চাষাবাদ ও ভার বহনে বলদ গরুর অবদান অপরিসীম। গাই গরু আমাদের পুষ্টিকর দুধ দেয়, যা দিয়ে মিষ্টি, ছানা, দই ও মাখন প্রস্তুত হয়। এছাড়া গরুর গোবর উৎকৃষ্ট প্রাকৃতিক সার ও জ্বালানি হিসেবে ব্যবহৃত হয়।
                    </p>
                  )}

                  {s1AiStreamProgress > 0.9 && (
                    <p>
                      <strong className="text-black font-semibold">উপসংহার:</strong> গরু আমাদের পারিবারিক ও জাতীয় অর্থনীতির এক অমূল্য সম্পদ। এই উপকারী প্রাণীর প্রতি যত্নবান হওয়া এবং সঠিক লালনপালন করা আমাদের সকলের কর্তব্য।
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* ================================================================ */}
            {/* CINEMATIC TRANSITION WITH EXPANDING O-RINGS                      */}
            {/* ================================================================ */}
            <motion.div
              style={{
                opacity: sBridgeOpacity,
                scale: sBridgeScale,
                pointerEvents: 'none',
              }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <CinematicORingSystem size={120} isActivated={true} expandIntensity={bridgeRippleIntensity} />
              <div
                className="mt-4 text-xs font-mono lowercase tracking-widest font-semibold"
                style={{
                  background: 'linear-gradient(90deg, #1e3a8a, #2563eb, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                bangla prompt architecture
              </div>
            </motion.div>

            {/* ================================================================ */}
            {/* SCENE TWO: BANGLA-ONLY PROMPT DEMONSTRATION                      */}
            {/* "গরু সম্পর্কে একটি রচনা লিখে দাও।"                                 */}
            {/* ================================================================ */}

            {/* 2A: Fresh Chat Input with Bengali Prompt Typing */}
            <motion.div
              style={{
                opacity: s2InputOpacity,
                y: s2InputY,
                pointerEvents: currentProgress >= 0.54 && currentProgress < 0.65 ? 'auto' : 'none',
              }}
              className="absolute inset-x-0 mx-auto max-w-2xl flex flex-col items-center px-4"
            >
              <div className="w-full bg-white rounded-3xl border border-zinc-200/90 p-5 sm:p-6 shadow-xl shadow-zinc-200/40 relative">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 mt-0.5">
                    <AestificArchIcon size={18} className="text-zinc-800" />
                  </div>
                  <div className="flex-1 min-h-[52px] flex items-center">
                    <p
                      className="text-base sm:text-xl font-medium text-zinc-950 tracking-tight flex items-center"
                      style={{ fontFamily: "'Comfortaa', 'Hind Siliguri', 'Noto Sans Bengali', system-ui, sans-serif" }}
                    >
                      <span>{s2TypedText || 'গ'}</span>
                      <span className="w-2 h-5 bg-zinc-950 ml-1 animate-pulse" />
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-zinc-50 border border-zinc-100">
                    বাংলা ইনপুট
                  </span>

                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-800 shadow-2xs lowercase">
                      <CinematicORingSystem size={18} isActivated={false} showRipples={false} />
                      <span>enhance</span>
                    </div>

                    <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-400">
                      <ArrowUp className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 2B: Activation of Enhance in Bengali */}
            <motion.div
              style={{
                opacity: s2ActivationOpacity,
                pointerEvents: currentProgress >= 0.62 && currentProgress < 0.71 ? 'auto' : 'none',
              }}
              className="absolute inset-x-0 mx-auto max-w-2xl flex flex-col items-center px-4"
            >
              <div className="w-full relative">
                <div
                  className="absolute -inset-1 rounded-[28px] blur-md -z-10 animate-pulse"
                  style={{
                    background:
                      'linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #8b5cf6 100%)',
                  }}
                />

                <div className="w-full bg-white rounded-3xl p-5 sm:p-6 shadow-2xl relative border border-blue-200">
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <AestificArchIcon size={18} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-h-[52px] flex items-center">
                      <p
                        className="text-base sm:text-xl font-medium text-zinc-950 tracking-tight"
                        style={{ fontFamily: "'Comfortaa', 'Hind Siliguri', 'Noto Sans Bengali', system-ui, sans-serif" }}
                      >
                        {S2_RAW_PROMPT}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-blue-100 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/80 border border-blue-200 text-xs font-semibold text-blue-700">
                      <CinematicORingSystem size={20} isActivated={s2OrbActivated} expandIntensity={s2RippleIntensity} />
                      <span>প্রম্পটটি নিখুঁত ও সমৃদ্ধ করা হচ্ছে...</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative flex items-center justify-center">
                        <span className="absolute -inset-1.5 rounded-full bg-blue-500/20 animate-ping" />
                        <div
                          className="px-3.5 py-1.5 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
                          style={{
                            background:
                              'linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #8b5cf6 100%)',
                          }}
                        >
                          <CinematicORingSystem size={18} isActivated={true} expandIntensity={0.7} glow={false} />
                          <span>সক্রিয়</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 2C: Transformation into Full Bengali Enhanced Instruction */}
            <motion.div
              style={{
                opacity: s2TransformOpacity,
                y: s2TransformY,
                pointerEvents: currentProgress >= 0.68 && currentProgress < 0.77 ? 'auto' : 'none',
              }}
              className="absolute inset-x-0 mx-auto max-w-3xl flex flex-col items-center px-4"
            >
              <div className="w-full bg-white rounded-3xl border border-zinc-200 p-5 sm:p-7 shadow-2xl relative">
                <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-zinc-900">
                      পূর্ণাঙ্গ বাংলা নির্দেশিকা
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">
                    স্কুল স্তরের রচনা
                  </span>
                </div>

                <div
                  className="text-sm sm:text-base md:text-[15px] text-zinc-800 leading-relaxed font-normal select-text space-y-2.5"
                  style={{ fontFamily: "'Comfortaa', 'Hind Siliguri', 'Noto Sans Bengali', system-ui, sans-serif" }}
                >
                  <p>
                    সহজ ও শুদ্ধ বাংলায় স্কুলের শিক্ষার্থীদের উপযোগী ‘গরু’ বিষয়ে একটি পূর্ণাঙ্গ রচনা লেখো।
                  </p>
                  <p>
                    রচনাটিতে একটি সুন্দর শিরোনাম, ভূমিকা, গরুর পরিচয় ও শারীরিক বৈশিষ্ট্য, খাদ্যাভ্যাস, মানুষের জীবনে গরুর গুরুত্ব, দুধ ও কৃষিকাজে গরুর অবদান এবং উপসংহার অন্তর্ভুক্ত করো।
                  </p>
                  <p>
                    প্রতিটি বিষয় আলাদা ও সুসংগঠিত অনুচ্ছেদে ব্যাখ্যা করো। ভাষা সহজ, তথ্য নির্ভুল এবং রচনাটি পরীক্ষার খাতায় লেখার উপযোগী রাখো।
                  </p>
                </div>

                <div className="mt-4 pt-3.5 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500 font-mono">
                  <span>প্রেরণের জন্য সম্পূর্ণ প্রস্তুত</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                </div>
              </div>
            </motion.div>

            {/* 2D: Send Action & Bengali AI Essay */}
            <motion.div
              style={{
                opacity: s2ConversationOpacity,
                y: s2ConversationY,
                pointerEvents: currentProgress >= 0.75 && currentProgress < 0.83 ? 'auto' : 'none',
              }}
              className="absolute inset-x-0 mx-auto max-w-3xl flex flex-col gap-4 px-4 w-full"
            >
              <div
                className="self-end max-w-xl bg-zinc-900 text-white rounded-2xl rounded-tr-sm p-4 text-xs sm:text-sm leading-relaxed shadow-md"
                style={{ fontFamily: "'Comfortaa', 'Hind Siliguri', 'Noto Sans Bengali', system-ui, sans-serif" }}
              >
                <div className="text-[10px] uppercase font-mono text-zinc-400 mb-1">
                  প্রেরিত প্রম্পট
                </div>
                {S2_ENHANCED_PROMPT}
              </div>

              <div className="self-start w-full bg-white border border-zinc-200/90 rounded-2xl rounded-tl-sm p-5 sm:p-7 shadow-xl">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-100">
                  <div className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center">
                    <AestificArchIcon size={14} className="text-white" />
                  </div>
                  <span className="text-xs font-semibold text-black lowercase">aestific ai</span>
                  <span className="text-[10px] font-mono text-zinc-400 ml-auto">
                    {s2AiStreamProgress < 1 ? 'তৈরি হচ্ছে…' : 'সম্পূর্ণ'}
                  </span>
                </div>

                <div
                  className="space-y-3.5 text-xs sm:text-sm leading-relaxed text-zinc-800 select-text"
                  style={{ fontFamily: "'Comfortaa', 'Hind Siliguri', 'Noto Sans Bengali', system-ui, sans-serif" }}
                >
                  <h2 className="text-lg sm:text-xl font-bold text-center text-black py-1">
                    গরু
                  </h2>

                  <p>
                    <strong className="text-black font-semibold">ভূমিকা:</strong> আমাদের পরিচিত গৃহপালিত পশুদের মধ্যে গরু অন্যতম। এটি অত্যন্ত নিরীহ, শান্ত ও উপকারী প্রাণী। প্রাচীন কাল থেকে মানব সভ্যতার বিকাশ ও কৃষিকাজের অগ্রযাত্রায় গরুর অবদান অপরিসীম।
                  </p>

                  {s2AiStreamProgress > 0.3 && (
                    <p>
                      <strong className="text-black font-semibold">শারীরিক বৈশিষ্ট্য:</strong> গরুর একটি মাথা, দুটি কান, দুটি চোখ ও দুটি শিং থাকে। এদের চারটি পা এবং একটি লম্বা লেজ রয়েছে যার ডগায় একগুচ্ছ চুল থাকে। সারা শরীর মসৃণ লোমে আবৃত।
                    </p>
                  )}

                  {s2AiStreamProgress > 0.55 && (
                    <p>
                      <strong className="text-black font-semibold">খাদ্যাভ্যাস:</strong> গরু সম্পূর্ণ নিরামিষাশী। কাঁচা ঘাস, খড়, লতাপাতা, ভুষি এবং খৈল এদের প্রিয় খাদ্য। এরা খাবার দ্রুত গিলে পরে অবসর সময়ে জাবর কাটে।
                    </p>
                  )}

                  {s2AiStreamProgress > 0.75 && (
                    <p>
                      <strong className="text-black font-semibold">উপকারিতা ও ভূমিকা:</strong> গাভী আমাদের সুষম ও পুষ্টিকর খাদ্য দুধ দেয়। এই দুধ শিশুদের সুস্বাস্থ্য নিশ্চিত করে এবং তা থেকে মিষ্টান্ন, ছানা, মাখন ও ঘি তৈরি হয়। বলদ গরু জমি চাষ করে খাদ্য উৎপাদনে সহায়তা করে। গরুর বর্জ্য বা গোবর শ্রেষ্ঠ জৈব সার।
                    </p>
                  )}

                  {s2AiStreamProgress > 0.9 && (
                    <p>
                      <strong className="text-black font-semibold">উপসংহার:</strong> গরু কেবল একটি প্রাণী নয়, আমাদের গ্রামীণ অর্থনীতির মেরুদণ্ড। তাই গরুর স্বাস্থ্যরক্ষা, নিয়মিত পুষ্টিকর খাদ্য প্রদান ও গোয়ালঘরের পরিষ্কার-পরিচ্ছন্নতার দিকে সুনজর দেওয়া উচিত।
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* ================================================================ */}
            {/* STAGE 4: FINALE BUILD-UP & TWO DISTINCT, READABLE TAGLINES       */}
            {/* ================================================================ */}

            {/* Central O-Ring System Anchor: Elevates smoothly, rotates cinematically, expands ripples */}
            <motion.div
              style={{
                opacity: finaleORingOpacity,
                scale: finaleORingScale,
                pointerEvents: 'none',
              }}
              className="absolute inset-0 flex flex-col items-center justify-center -translate-y-16 sm:-translate-y-20 z-10"
            >
              <CinematicORingSystem
                size={120}
                isActivated={true}
                expandIntensity={finaleRippleIntensity}
                glow={true}
                showWordmark={false}
              />
            </motion.div>

            {/* ================================================================ */}
            {/* 4A. TAGLINE 1: "end of prompt engineering"                       */}
            {/* STATIONARY HOLD for ~3 seconds equivalent viewing time           */}
            {/* ================================================================ */}
            <motion.div
              style={{
                opacity: sTagline1Opacity,
                y: sTagline1Y,
                pointerEvents: currentProgress >= 0.835 && currentProgress < 0.90 ? 'auto' : 'none',
              }}
              className="absolute inset-x-0 mx-auto max-w-3xl flex flex-col items-center justify-center text-center px-4 z-20 translate-y-16 sm:translate-y-20"
            >
              <h2
                className="text-2xl sm:text-4xl md:text-5xl font-medium tracking-[0.14em] lowercase text-black leading-tight drop-shadow-xs"
                style={{ fontFamily: "'Comfortaa', cursive, sans-serif" }}
              >
                end of prompt engineering
              </h2>
            </motion.div>

            {/* ================================================================ */}
            {/* 4B. TAGLINE 2: "into the era of aestific enhance"                */}
            {/* Confident Entrance & STATIONARY HOLD for ~4 seconds viewing time */}
            {/* ================================================================ */}
            <motion.div
              style={{
                opacity: sTagline2Opacity,
                y: sTagline2Y,
                pointerEvents: currentProgress >= 0.92 && currentProgress < 0.98 ? 'auto' : 'none',
              }}
              className="absolute inset-x-0 mx-auto max-w-3xl flex flex-col items-center justify-center text-center px-4 z-20 translate-y-16 sm:translate-y-20"
            >
              {/* Refined gradient light sweep behind the text for contrast */}
              <motion.div
                style={{
                  opacity: sTagline2Glow,
                  background:
                    'radial-gradient(ellipse at center, rgba(37,99,235,0.2) 0%, rgba(139,92,246,0.15) 50%, transparent 80%)',
                }}
                className="absolute inset-0 rounded-full blur-3xl -z-10 pointer-events-none"
              />

              <h2
                className="text-2xl sm:text-4xl md:text-5xl font-medium tracking-[0.12em] lowercase leading-tight drop-shadow-xs"
                style={{
                  fontFamily: "'Comfortaa', cursive, sans-serif",
                  background: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                into the era of aestific enhance
              </h2>
            </motion.div>

            {/* ================================================================ */}
            {/* 4C. FINAL DESTINATION: AUTHENTIC AESTIFIC EMBLEM + WORDMARK      */}
            {/* ================================================================ */}
            <motion.div
              style={{
                opacity: sFinalLogoOpacity,
                scale: sFinalLogoScale,
                pointerEvents: currentProgress >= 0.982 ? 'auto' : 'none',
              }}
              className="absolute inset-x-0 mx-auto max-w-xl flex flex-col items-center justify-center text-center px-4 z-30"
            >
              <div className="mb-4 flex items-center justify-center">
                <AestificArchIcon size={60} className="text-black" />
              </div>

              <h2
                className="lowercase font-medium tracking-[0.24em] text-black text-3xl sm:text-4xl leading-none select-none mb-8"
                style={{
                  fontFamily: "'Comfortaa', cursive, sans-serif",
                }}
              >
                aestific
              </h2>

              <button
                onClick={onGetStarted}
                className="px-6 py-3 rounded-full bg-black text-white hover:bg-zinc-800 font-semibold text-xs sm:text-sm lowercase flex items-center gap-2 shadow-lg shadow-black/20 cursor-pointer transition-all active:scale-95"
              >
                <span>enter chat</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

          </div>

        </div>
      </div>
    </div>
  );
};
