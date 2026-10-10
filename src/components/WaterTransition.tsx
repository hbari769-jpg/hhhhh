import React, { useEffect, useRef } from 'react';

interface WaterTransitionProps {
  isTransitioning: boolean;
  initialText?: string;
  onComplete?: () => void;
}

export const WaterTransition: React.FC<WaterTransitionProps> = ({
  isTransitioning,
  initialText = '',
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioPlayedRef = useRef(false);
  const stateRef = useRef({
    isTransitioning,
    transitionStartTime: 0,
    initialText,
    onComplete,
  });

  // Keep stateRef up to date across renders
  useEffect(() => {
    stateRef.current.isTransitioning = isTransitioning;
    stateRef.current.initialText = initialText;
    stateRef.current.onComplete = onComplete;

    if (isTransitioning && stateRef.current.transitionStartTime === 0) {
      stateRef.current.transitionStartTime = performance.now();
      audioPlayedRef.current = false;
    }
  }, [isTransitioning, initialText, onComplete]);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (isTransitioning && onComplete) {
        onComplete();
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // High-fidelity synthesized dual-harmonic crystal water droplet impact
    const playImpactSound = () => {
      if (audioPlayedRef.current) return;
      audioPlayedRef.current = true;
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const audioCtx = new AudioCtx();
        if (audioCtx.state === 'suspended') {
          audioCtx.resume().catch(() => {});
        }

        const now = audioCtx.currentTime;

        // 1. Primary resonant fluid bubble drop
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(460, now);
        osc1.frequency.exponentialRampToValueAtTime(1180, now + 0.065);
        osc1.frequency.exponentialRampToValueAtTime(720, now + 0.22);

        gain1.gain.setValueAtTime(0, now);
        gain1.gain.linearRampToValueAtTime(0.05, now + 0.012);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.start(now);
        osc1.stop(now + 0.44);

        // 2. High crystal water droplet ping overtone (creates that authentic "plink" shimmer)
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1380, now + 0.01);
        osc2.frequency.exponentialRampToValueAtTime(890, now + 0.16);

        gain2.gain.setValueAtTime(0, now + 0.01);
        gain2.gain.linearRampToValueAtTime(0.022, now + 0.02);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start(now + 0.01);
        osc2.stop(now + 0.25);

        // 3. Gentle low-frequency oceanic swell resonance
        const osc3 = audioCtx.createOscillator();
        const gain3 = audioCtx.createGain();
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(120, now + 0.08);
        osc3.frequency.exponentialRampToValueAtTime(65, now + 0.55);

        gain3.gain.setValueAtTime(0, now + 0.08);
        gain3.gain.linearRampToValueAtTime(0.035, now + 0.18);
        gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

        osc3.connect(gain3);
        gain3.connect(audioCtx.destination);
        osc3.start(now + 0.08);
        osc3.stop(now + 0.68);
      } catch {
        // Silently ignore if Web Audio is blocked by browser policy
      }
    };

    const TOTAL_DURATION = 1950; // Total transition length in ms
    let hasCompleted = false;

    // Pre-calculate swirl particle offsets for droplet genesis
    const swirlParticles = Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const dist = 32 + (i % 3) * 16;
      return { angle, dist, speed: 1.2 + (i % 4) * 0.25, size: 1.6 + (i % 3) * 0.8 };
    });

    const render = (currentTime: number) => {
      ctx.clearRect(0, 0, width, height);

      const { isTransitioning: active, transitionStartTime, initialText: text, onComplete: finish } = stateRef.current;
      const baseWaterHeight = Math.max(80, Math.min(115, height * 0.13));
      const baseWaterY = height - baseWaterHeight;
      const centerX = width / 2;
      const startDropY = height * 0.52; // Composer dock origin

      // -------------------------------------------------------------
      // CASE A: IDLE STATE (Calm water waiting peacefully at bottom)
      // -------------------------------------------------------------
      if (!active || transitionStartTime === 0) {
        drawCalmWaterSurface(ctx, width, height, baseWaterY, currentTime, 0, 1);
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // -------------------------------------------------------------
      // CASE B: ACTIVE TRANSITION SEQUENCE (WOW Cinematic Flow)
      // -------------------------------------------------------------
      const elapsed = currentTime - transitionStartTime;

      // Overall ease-out fade in the final 350ms
      let globalAlpha = 1;
      if (elapsed > 1600) {
        globalAlpha = Math.max(0, 1 - (elapsed - 1600) / 350);
      }

      if (globalAlpha <= 0) {
        if (!hasCompleted) {
          hasCompleted = true;
          if (finish) finish();
        }
        return;
      }

      ctx.save();
      ctx.globalAlpha = globalAlpha;

      // -----------------------------------------------------------
      // 1. GENESIS & DESCENT (0ms to 760ms)
      // -----------------------------------------------------------
      if (elapsed < 770) {
        if (elapsed < 420) {
          // --- Phase 1A: Message Detaches & Swirling Condensation into Droplet ---
          const morphP = elapsed / 420;
          const textOpacity = Math.max(0, 1 - morphP * 1.5);
          const dropletAlpha = Math.min(1, morphP * 2.2);

          // Ethereal text floating up and dissolving into light
          if (textOpacity > 0 && text) {
            ctx.save();
            ctx.font = '500 13.5px ui-sans-serif, system-ui, -apple-system, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = `rgba(186, 230, 253, ${textOpacity * 0.95})`;
            ctx.shadowColor = 'rgba(56, 189, 248, 0.7)';
            ctx.shadowBlur = 10;
            const displayText = text.length > 26 ? text.slice(0, 24) + '...' : text;
            ctx.fillText(`"${displayText}"`, centerX, startDropY - morphP * 16);
            ctx.restore();
          }

          // Swirling crystal liquid micro-beads coalescing into the central droplet
          const orbitCollapse = 1 - Math.pow(morphP, 1.8);
          swirlParticles.forEach((sp) => {
            const curAngle = sp.angle + morphP * Math.PI * 3 * sp.speed;
            const curDist = sp.dist * orbitCollapse;
            const px = centerX + Math.cos(curAngle) * curDist;
            const py = (startDropY - morphP * 10) + Math.sin(curAngle) * (curDist * 0.45);

            ctx.save();
            ctx.beginPath();
            ctx.arc(px, py, sp.size * (1 - morphP * 0.5), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * (1 - morphP * 0.4)})`;
            ctx.shadowColor = 'rgba(56, 189, 248, 0.9)';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.restore();
          });

          // Growing central 3D water droplet
          const currentRadius = 4 + Math.sin(morphP * Math.PI) * 5;
          drawCinematicDroplet(
            ctx,
            centerX,
            startDropY - morphP * 10,
            currentRadius * dropletAlpha,
            1,
            morphP * 0.4,
            dropletAlpha
          );
        } else {
          // --- Phase 1B: Natural Gravitational Plunge toward Bottom Surface ---
          const fallP = (elapsed - 420) / (750 - 420);
          // Realistic gravity acceleration (power 2.2)
          const fallEased = Math.pow(fallP, 2.2);
          const currentY = startDropY - 10 + (baseWaterY - (startDropY - 10)) * fallEased;

          // Surface tension aerodynamic wobble (oscillates slightly between spherical and teardrop)
          const wobble = Math.sin(fallP * Math.PI * 5) * 0.08;
          const stretch = 1 + fallP * 0.45 + wobble;
          const rotation = fallP * 0.65;
          const dropRadius = 9;

          // Subtle luminous liquid refraction trail behind the falling droplet
          if (fallP > 0.1) {
            const trailLen = Math.min(28, fallP * 35);
            ctx.save();
            const trailGrad = ctx.createLinearGradient(centerX, currentY - trailLen, centerX, currentY);
            trailGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
            trailGrad.addColorStop(1, 'rgba(186, 230, 253, 0.45)');
            ctx.strokeStyle = trailGrad;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(centerX, currentY - trailLen);
            ctx.lineTo(centerX, currentY - 4);
            ctx.stroke();
            ctx.restore();
          }

          drawCinematicDroplet(ctx, centerX, currentY, dropRadius, stretch, rotation, 1);
        }
      }

      // -----------------------------------------------------------
      // 2. THE IMPACT & SURGING WAVE FROM BOTTOM SURFACE
      // -----------------------------------------------------------
      let impactDistortion = 0;
      let waveRisingProgress = 0;

      if (elapsed >= 750) {
        // Trigger impact sound once at impact
        playImpactSound();

        const impactTime = elapsed - 750;
        // High-fidelity physical depression (damped oscillation)
        impactDistortion = Math.exp(-impactTime / 190) * Math.sin(impactTime * 0.024) * 20;

        // Wave rises upward from the bottom water surface starting at 880ms
        if (elapsed >= 880) {
          waveRisingProgress = Math.min(1, (elapsed - 880) / 720);
        }
      }

      // Draw bottom water surface and its surge into a full-screen wave
      drawSurgingWaterSurface(
        ctx,
        width,
        height,
        baseWaterY,
        currentTime,
        impactDistortion,
        waveRisingProgress,
        elapsed
      );

      // -----------------------------------------------------------
      // 3. THE "WOW" WORTHINGTON JET & ROYAL CROWN SPLASH (750ms to 1250ms)
      // -----------------------------------------------------------
      if (elapsed >= 750 && elapsed < 1280) {
        const impactElapsed = elapsed - 750;

        // 3A. Concentric Elliptical Surface Ripples (Perspective View on Water Plane)
        const rippleRadius = impactElapsed * 1.15;
        const rippleAlpha = Math.max(0, 1 - impactElapsed / 480);

        [0, 28, 64, 110].forEach((offset, idx) => {
          const r = rippleRadius - offset;
          if (r > 0 && r < width * 0.75) {
            ctx.save();
            ctx.beginPath();
            // Perspective ellipse matching the horizontal water line
            ctx.ellipse(centerX, baseWaterY, r, r * 0.24, 0, 0, Math.PI * 2);
            ctx.strokeStyle = idx === 0
              ? `rgba(255, 255, 255, ${rippleAlpha * 0.95})`
              : `rgba(186, 230, 253, ${rippleAlpha * 0.75})`;
            ctx.lineWidth = Math.max(1, 3.2 - (r / 90));
            ctx.shadowColor = 'rgba(56, 189, 248, 0.85)';
            ctx.shadowBlur = 8;
            ctx.stroke();

            // Refractive trough shadow right inside crest
            if (r > 6) {
              ctx.beginPath();
              ctx.ellipse(centerX, baseWaterY, Math.max(1, r - 3), Math.max(1, (r - 3) * 0.24), 0, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(7, 24, 56, ${rippleAlpha * 0.7})`;
              ctx.lineWidth = 2;
              ctx.shadowBlur = 0;
              ctx.stroke();
            }
            ctx.restore();
          }
        });

        // 3B. The Royal Crown Splash (8 Radial Crystal Micro-Beads Arc Outward)
        if (impactElapsed < 320) {
          const crownP = impactElapsed / 320;
          const crownAlpha = Math.max(0, 1 - crownP * 1.1);
          const crownLift = Math.sin(crownP * Math.PI) * 26;

          [-42, -28, -14, -4, 4, 14, 28, 42].forEach((xOffset, i) => {
            const spread = xOffset * (1 + crownP * 1.1);
            const py = baseWaterY - crownLift * (1 - Math.abs(xOffset) * 0.012) - (i % 2 === 0 ? 3 : 0);

            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX + spread, py, 2.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${crownAlpha * 0.98})`;
            ctx.shadowColor = 'rgba(56, 189, 248, 0.95)';
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.restore();
          });
        }

        // 3C. The Central Worthington Jet (Vertical Water Rebound Column & Pinch-off Bead)
        // This is the signature physical slow-mo water drop rebound that creates a true "WOW"!
        if (impactElapsed > 40 && impactElapsed < 440) {
          const jetP = (impactElapsed - 40) / 400;
          const jetAlpha = Math.max(0, 1 - jetP * 1.2);
          const jetMaxHeight = 36;
          // Jet shoots upward, hangs, and recedes
          const jetHeight = Math.sin(jetP * Math.PI) * jetMaxHeight;

          if (jetHeight > 2) {
            ctx.save();
            // Slender water column
            const jetGrad = ctx.createLinearGradient(centerX, baseWaterY, centerX, baseWaterY - jetHeight);
            jetGrad.addColorStop(0, `rgba(14, 55, 120, ${jetAlpha * 0.9})`);
            jetGrad.addColorStop(0.6, `rgba(56, 189, 248, ${jetAlpha * 0.95})`);
            jetGrad.addColorStop(1, `rgba(255, 255, 255, ${jetAlpha * 0.98})`);

            ctx.strokeStyle = jetGrad;
            ctx.lineWidth = Math.max(1.8, 4.5 * (1 - jetP * 0.6));
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(centerX, baseWaterY);
            ctx.lineTo(centerX, baseWaterY - jetHeight);
            ctx.shadowColor = 'rgba(56, 189, 248, 0.9)';
            ctx.shadowBlur = 8;
            ctx.stroke();

            // Rebound droplet bead at the summit
            ctx.beginPath();
            ctx.arc(centerX, baseWaterY - jetHeight - 1, 2.6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${jetAlpha * 0.98})`;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.restore();
          }
        }
      }

      ctx.restore();

      if (elapsed < TOTAL_DURATION) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        if (!hasCompleted) {
          hasCompleted = true;
          if (finish) finish();
        }
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [isTransitioning, onComplete]);

  return (
    <div
      className="fixed inset-0 z-40 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

/**
 * Draws the calm, elegant horizontal liquid water surface extending across the bottom of the screen.
 * Modeled with multi-layered oceanic waves, subtle caustics, and crisp specular crest highlights.
 */
function drawCalmWaterSurface(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  baseWaterY: number,
  time: number,
  impactDistortion: number,
  alpha: number
) {
  ctx.save();
  ctx.globalAlpha = alpha;

  const t = time * 0.0014;
  const step = 8;
  const points: { x: number; y: number }[] = [];

  for (let x = 0; x <= width + step; x += step) {
    // Harmonious liquid sinusoidal surface wave
    const w1 = Math.sin(x * 0.0075 + t * 1.7) * 3.8;
    const w2 = Math.cos(x * 0.015 - t * 2.1) * 2.2;
    const w3 = Math.sin(x * 0.0035 + t * 1.0) * 1.6;

    // Localized impact depression
    let centerDip = 0;
    if (impactDistortion !== 0) {
      const distFromCenter = Math.abs(x - width / 2);
      const gaussian = Math.exp(-(distFromCenter * distFromCenter) / 3800);
      centerDip = impactDistortion * gaussian;
    }

    const y = baseWaterY + w1 + w2 + w3 + centerDip;
    points.push({ x, y });
  }

  // 1. Water Body Fill (Deep sapphire blue gradient to midnight ocean base)
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const mx = (prev.x + curr.x) / 2;
    const my = (prev.y + curr.y) / 2;
    ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
  }

  ctx.lineTo(width, height);
  ctx.closePath();

  const waterGrad = ctx.createLinearGradient(0, baseWaterY - 12, 0, height);
  waterGrad.addColorStop(0, 'rgba(14, 46, 92, 0.48)');
  waterGrad.addColorStop(0.28, 'rgba(8, 30, 68, 0.74)');
  waterGrad.addColorStop(1, 'rgba(2, 12, 32, 0.95)');
  ctx.fillStyle = waterGrad;
  ctx.fill();

  // 2. Liquid Subsurface Caustic Light Ribbons (undulating sunlight refraction)
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i < points.length; i += 2) {
    const pt = points[i];
    const cy = pt.y + 18 + Math.sin(pt.x * 0.011 + t * 2.6) * 4.5;
    if (i === 0) ctx.moveTo(pt.x, cy);
    else ctx.lineTo(pt.x, cy);
  }
  ctx.strokeStyle = 'rgba(186, 230, 253, 0.18)';
  ctx.lineWidth = 1.6;
  ctx.stroke();
  ctx.restore();

  // 3. Crisp Surface Crest Specular Highlights
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const mx = (prev.x + curr.x) / 2;
    const my = (prev.y + curr.y) / 2;
    ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
  }

  // Soft Cyan Glow
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.78)';
  ctx.lineWidth = 2.6;
  ctx.shadowColor = 'rgba(56, 189, 248, 0.85)';
  ctx.shadowBlur = 9;
  ctx.stroke();

  // Clean White Specular Edge
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.lineWidth = 1.3;
  ctx.shadowBlur = 0;
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws the surge of the water surface expanding FROM THE BOTTOM upward and outward
 * until it covers the entire screen in a cinematic liquid wave.
 */
function drawSurgingWaterSurface(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  baseWaterY: number,
  time: number,
  impactDistortion: number,
  waveProgress: number,
  elapsed: number
) {
  ctx.save();

  // Eased progress for wave surge
  const easeProgress = waveProgress < 0.5
    ? 2 * waveProgress * waveProgress
    : 1 - Math.pow(-2 * waveProgress + 2, 2) / 2;

  // Surge from baseWaterY all the way up to -140px (covering full viewport from bottom to top)
  const currentHeight = baseWaterY - (baseWaterY + 160) * easeProgress;
  const t = time * 0.0022;
  const step = 8;

  // Wave amplitude swells then smooths as it covers screen
  const amp = (1 - easeProgress * 0.55) * 24;

  const points: { x: number; y: number }[] = [];

  for (let x = 0; x <= width + step; x += step) {
    const w1 = Math.sin(x * 0.007 + t * 2.4) * amp;
    const w2 = Math.cos(x * 0.014 - t * 1.9) * (amp * 0.5);

    // Ripple effect after impact
    let rippleDisplace = 0;
    if (elapsed >= 750 && elapsed < 1250) {
      const dist = Math.abs(x - width / 2);
      const rTime = elapsed - 750;
      const waveFront = rTime * 0.9;
      if (Math.abs(dist - waveFront) < 65) {
        rippleDisplace = Math.cos((dist - waveFront) * 0.1) * 9 * (1 - rTime / 500);
      }
    }

    const y = currentHeight + w1 + w2 + rippleDisplace;
    points.push({ x, y });
  }

  // 1. Rising Deep Water Body Fill
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const mx = (prev.x + curr.x) / 2;
    const my = (prev.y + curr.y) / 2;
    ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
  }

  ctx.lineTo(width, height);
  ctx.closePath();

  // Premium liquid gradient: deep ocean blue, rich sapphire, luminous crest
  const waveGrad = ctx.createLinearGradient(0, currentHeight - 25, 0, height);
  waveGrad.addColorStop(0, 'rgba(16, 62, 134, 0.82)');
  waveGrad.addColorStop(0.32, 'rgba(8, 34, 82, 0.9)');
  waveGrad.addColorStop(0.78, 'rgba(3, 16, 44, 0.97)');
  waveGrad.addColorStop(1, 'rgba(1, 8, 24, 0.99)');
  ctx.fillStyle = waveGrad;
  ctx.fill();

  // 2. Liquid Internal Caustic Ribbons (sweeping upward with wave)
  if (waveProgress > 0.04) {
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < points.length; i += 2) {
      const pt = points[i];
      const cy = pt.y + 26 + Math.sin(pt.x * 0.009 + t * 3.2) * 7;
      if (i === 0) ctx.moveTo(pt.x, cy);
      else ctx.lineTo(pt.x, cy);
    }
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.32)';
    ctx.lineWidth = 2.6;
    ctx.stroke();
    ctx.restore();
  }

  // 3. Cinematic Wave Crest Specular Highlights (Bright white + luminous cyan)
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const mx = (prev.x + curr.x) / 2;
    const my = (prev.y + curr.y) / 2;
    ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
  }

  // Cyan luminous crest
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.88)';
  ctx.lineWidth = 3.6;
  ctx.shadowColor = 'rgba(56, 189, 248, 0.92)';
  ctx.shadowBlur = 14;
  ctx.stroke();

  // Crisp white specular glint
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.98)';
  ctx.lineWidth = 1.8;
  ctx.shadowBlur = 0;
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws a photorealistic, 3D glass liquid water droplet with caustic light focus,
 * multi-layered specular reflections, and chromatic refractive glow.
 */
function drawCinematicDroplet(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  stretch: number,
  rotation: number,
  alpha: number
) {
  if (radius <= 0.1 || alpha <= 0.01) return;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(1, stretch);

  // 1. Soft Refractive Cyan Outer Glow (Fresnel rim)
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, radius * 1.4, 0, Math.PI * 2);
  const glowGrad = ctx.createRadialGradient(0, 0, radius * 0.45, 0, 0, radius * 1.4);
  glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.52)');
  glowGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = glowGrad;
  ctx.fill();
  ctx.restore();

  // 2. 3D Liquid Volume Body (Cyan refraction core to deep royal ocean)
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  const bodyGrad = ctx.createRadialGradient(
    -radius * 0.28,
    -radius * 0.28,
    radius * 0.07,
    0,
    0,
    radius
  );
  bodyGrad.addColorStop(0, 'rgba(224, 242, 254, 0.98)'); // Bright crystal core
  bodyGrad.addColorStop(0.32, 'rgba(56, 189, 248, 0.92)'); // Luminous cyan
  bodyGrad.addColorStop(0.72, 'rgba(14, 55, 120, 0.96)'); // Deep sapphire ocean
  bodyGrad.addColorStop(1, 'rgba(2, 16, 42, 0.98)'); // Refraction shadow rim
  ctx.fillStyle = bodyGrad;
  ctx.shadowColor = 'rgba(2, 132, 199, 0.7)';
  ctx.shadowBlur = 10;
  ctx.fill();

  // 3. Primary Crisp White Specular Crescent Reflection Arc (Sun Glint)
  ctx.beginPath();
  ctx.ellipse(
    -radius * 0.32,
    -radius * 0.35,
    radius * 0.44,
    radius * 0.22,
    -Math.PI / 4,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
  ctx.fill();

  // 4. Secondary Micro Caustic Highlight (Internal light bounce at bottom right)
  ctx.beginPath();
  ctx.arc(radius * 0.32, radius * 0.36, radius * 0.16, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.76)';
  ctx.fill();

  ctx.restore();
}
