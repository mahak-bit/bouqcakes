"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useSyncExternalStore,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Sparkles,
  ArrowDown,
  ArrowUpRight,
  RotateCcw,
  Play,
  Pause,
} from "lucide-react";
import { Button } from "./ui/Button";

const TOTAL_FRAMES = 94;
const FRAME_BASE_PATH = "/videos/frames/frame-";

function getFrameUrl(indexZeroBased: number): string {
  const num = Math.min(TOTAL_FRAMES, Math.max(1, indexZeroBased + 1));
  return `${FRAME_BASE_PATH}${String(num).padStart(3, "0")}.webp`;
}

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

interface BouquetHeroProps {
  videoSrc?: string;
  className?: string;
}

export function BouquetHero({
  videoSrc = "/videos/cake.mp4",
  className = "",
}: BouquetHeroProps) {
  const trackRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Direct DOM refs for zero-re-render 60fps scroll choreography
  const introOverlayRef = useRef<HTMLDivElement>(null);
  const finalOverlayRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Frame sequence storage & animation refs
  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    Array.from({ length: TOTAL_FRAMES }, () => null)
  );
  const targetFrameRef = useRef<number>(0);
  const displayFrameRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);
  const rafIdRef = useRef<number | null>(null);
  const reducedPlayRafRef = useRef<number | null>(null);

  // State
  const [isReady, setIsReady] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isPlayingReduced, setIsPlayingReduced] = useState<boolean>(false);
  const [retryTick, setRetryTick] = useState<number>(0);

  // Hydration-safe reduced-motion subscription
  const isReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  // Find closest decoded frame so fast scrolling on slow mobile networks never flashes blank
  const getBestFrame = useCallback((desiredIndex: number): HTMLImageElement | null => {
    const imgs = imagesRef.current;
    const clamped = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(desiredIndex)));
    const exact = imgs[clamped];
    if (exact && exact.complete && exact.naturalWidth > 0) {
      return exact;
    }

    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = clamped - offset;
      if (prev >= 0) {
        const candidate = imgs[prev];
        if (candidate && candidate.complete && candidate.naturalWidth > 0) {
          return candidate;
        }
      }
      const next = clamped + offset;
      if (next < TOTAL_FRAMES) {
        const candidate = imgs[next];
        if (candidate && candidate.complete && candidate.naturalWidth > 0) {
          return candidate;
        }
      }
    }
    return null;
  }, []);

  // Responsive canvas renderer: full-bleed cover on landscape, full-bouquet seamless cinema framing on portrait phones
  const drawFrameToCanvas = useCallback(
    (frameIndex: number, forceRedraw = false) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rounded = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(frameIndex)));
      if (!forceRedraw && rounded === lastDrawnFrameRef.current) return;

      const img = getBestFrame(rounded);
      if (!img) return;

      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const cw = canvas.width;
      const ch = canvas.height;
      if (cw === 0 || ch === 0) return;

      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      if (iw === 0 || ih === 0) return;

      const isPortrait = ch > cw * 1.05;

      if (isPortrait) {
        // Seamless studio backdrop matching cake.mp4's warm taupe-champagne studio sweep
        const bgGrad = ctx.createLinearGradient(0, 0, 0, ch);
        bgGrad.addColorStop(0, "#9E8E78");
        bgGrad.addColorStop(0.5, "#B0A18B");
        bgGrad.addColorStop(1, "#C9BEAA");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, cw, ch);

        // Smart portrait scale: keeps 100% of the bouquet, piping nozzle, & cherry bow clearly visible on narrow phone screens
        const scale = Math.max(cw / (iw * 0.72), (ch * 0.62) / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        const dx = (cw - dw) / 2;
        const dy = (ch - dh) / 2 + ch * 0.01;

        ctx.drawImage(img, dx, dy, dw, dh);

        // Soft feathered top & bottom blend so the frame merges seamlessly into the studio backdrop
        const feather = Math.max(24, Math.min(72, ch * 0.08));
        if (dy > 0) {
          const topFade = ctx.createLinearGradient(0, dy - 2, 0, dy + feather);
          topFade.addColorStop(0, "#A4957F");
          topFade.addColorStop(1, "rgba(164, 149, 127, 0)");
          ctx.fillStyle = topFade;
          ctx.fillRect(0, dy - 2, cw, feather + 4);
        }
        const bottomEdge = dy + dh;
        if (bottomEdge < ch) {
          const botFade = ctx.createLinearGradient(
            0,
            bottomEdge - feather,
            0,
            bottomEdge + 2
          );
          botFade.addColorStop(0, "rgba(195, 184, 165, 0)");
          botFade.addColorStop(1, "#C3B8A5");
          ctx.fillStyle = botFade;
          ctx.fillRect(0, bottomEdge - feather, cw, feather + 4);
        }
      } else {
        // Landscape (tablets, laptops, desktops): crisp full-bleed object-fit: cover
        const scale = Math.max(cw / iw, ch / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        const dx = (cw - dw) / 2;
        const dy = (ch - dh) / 2;
        ctx.drawImage(img, dx, dy, dw, dh);
      }

      lastDrawnFrameRef.current = rounded;
    },
    [getBestFrame]
  );

  // Keep canvas resolution razor-sharp across screen resizes & orientation changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const nextW = Math.max(1, Math.round(rect.width * dpr));
      const nextH = Math.max(1, Math.round(rect.height * dpr));

      if (canvas.width !== nextW || canvas.height !== nextH) {
        canvas.width = nextW;
        canvas.height = nextH;
        drawFrameToCanvas(displayFrameRef.current, true);
      }
    };

    resizeCanvas();

    const observer = new ResizeObserver(resizeCanvas);
    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }
    window.addEventListener("orientationchange", resizeCanvas);

    return () => {
      observer.disconnect();
      window.removeEventListener("orientationchange", resizeCanvas);
    };
  }, [drawFrameToCanvas]);

  // Progressive 2-wave preloader: instant frame 1 -> keyframes -> smooth fill-in
  useEffect(() => {
    let cancelled = false;
    imagesRef.current = Array.from({ length: TOTAL_FRAMES }, () => null);
    lastDrawnFrameRef.current = -1;

    const loadSingleFrame = (idx: number): Promise<boolean> => {
      return new Promise((resolve) => {
        if (cancelled) {
          resolve(false);
          return;
        }
        const img = new window.Image();
        img.decoding = "async";
        img.src = getFrameUrl(idx);

        img.onload = () => {
          if (cancelled) {
            resolve(false);
            return;
          }
          imagesRef.current[idx] = img;
          // If this frame is currently displayed (or very close), refresh canvas cleanly
          if (Math.abs(displayFrameRef.current - idx) <= 2) {
            drawFrameToCanvas(displayFrameRef.current, true);
          }
          resolve(true);
        };

        img.onerror = () => {
          resolve(false);
        };
      });
    };

    const runPreload = async () => {
      // Wave 0: Load opening frame & final frame immediately so hero paints in <100ms
      const initialIdx = isReducedMotion ? TOTAL_FRAMES - 1 : 0;
      const [firstOk] = await Promise.all([
        loadSingleFrame(initialIdx),
        loadSingleFrame(isReducedMotion ? 0 : TOTAL_FRAMES - 1),
      ]);

      if (cancelled) return;

      if (!firstOk) {
        setHasError(true);
        setIsReady(false);
        return;
      }

      displayFrameRef.current = initialIdx;
      targetFrameRef.current = initialIdx;
      setHasError(false);
      setIsReady(true);
      drawFrameToCanvas(initialIdx, true);

      // Wave 1: Load every 4th frame first so full-range scrubbing is immediately smooth on mobile
      const wave1: number[] = [];
      const wave2: number[] = [];
      for (let i = 1; i < TOTAL_FRAMES - 1; i++) {
        if (i % 4 === 0) wave1.push(i);
        else wave2.push(i);
      }

      const loadInBatches = async (indices: number[], concurrency: number) => {
        let cursor = 0;
        const worker = async () => {
          while (!cancelled && cursor < indices.length) {
            const nextIdx = indices[cursor++];
            await loadSingleFrame(nextIdx);
          }
        };
        await Promise.all(
          Array.from({ length: Math.min(concurrency, indices.length) }, worker)
        );
      };

      await loadInBatches(wave1, 6);
      if (cancelled) return;
      await loadInBatches(wave2, 6);
    };

    runPreload();

    return () => {
      cancelled = true;
    };
  }, [isReducedMotion, retryTick, drawFrameToCanvas]);

  // Silky 60fps requestAnimationFrame loop with smooth exponential damping
  useEffect(() => {
    if (!isReady || isReducedMotion) return;

    const tick = () => {
      const target = targetFrameRef.current;
      const current = displayFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.04) {
        // Smooth damping makes touch flicks & wheel notches feel cinema-fluid
        const next = current + diff * 0.24;
        displayFrameRef.current = next;
        drawFrameToCanvas(next);
      } else if (Math.round(current) !== Math.round(target)) {
        displayFrameRef.current = target;
        drawFrameToCanvas(target);
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isReady, isReducedMotion, drawFrameToCanvas]);

  // GSAP ScrollTrigger over native CSS sticky track (zero mobile pin jitter!)
  useEffect(() => {
    if (typeof window === "undefined" || !isReady || isReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      if (introOverlayRef.current) {
        gsap.set(introOverlayRef.current, { opacity: 1, y: 0 });
      }
      if (finalOverlayRef.current) {
        gsap.set(finalOverlayRef.current, {
          opacity: 0,
          y: 26,
          scale: 0.97,
          pointerEvents: "none",
        });
      }
      if (vignetteRef.current) {
        gsap.set(vignetteRef.current, { opacity: 0.08 });
      }
      if (progressBarRef.current) {
        gsap.set(progressBarRef.current, {
          scaleX: 0,
          transformOrigin: "left center",
        });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = Math.max(0, Math.min(1, self.progress));
            targetFrameRef.current = progress * (TOTAL_FRAMES - 1);

            if (finalOverlayRef.current) {
              finalOverlayRef.current.style.pointerEvents =
                progress >= 0.85 ? "auto" : "none";
            }
          },
        },
      });

      if (progressBarRef.current) {
        tl.to(progressBarRef.current, { scaleX: 1, ease: "none", duration: 1 }, 0);
      }

      if (introOverlayRef.current) {
        tl.to(
          introOverlayRef.current,
          { opacity: 0, y: -22, ease: "power1.out", duration: 0.14 },
          0
        );
      }

      if (vignetteRef.current) {
        tl.to(
          vignetteRef.current,
          { opacity: 0.54, ease: "power1.inOut", duration: 0.2 },
          0.76
        );
      }

      if (finalOverlayRef.current) {
        tl.to(
          finalOverlayRef.current,
          { opacity: 1, y: 0, scale: 1, ease: "power2.out", duration: 0.16 },
          0.82
        );
      }
    }, track);

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
    };
  }, [isReady, isReducedMotion]);

  // Accessible manual playback for reduced-motion users
  useEffect(() => {
    if (!isReducedMotion || !isPlayingReduced) {
      if (reducedPlayRafRef.current !== null) {
        cancelAnimationFrame(reducedPlayRafRef.current);
        reducedPlayRafRef.current = null;
      }
      return;
    }

    let lastTimestamp = performance.now();
    const frameIntervalMs = 1000 / 15;

    if (displayFrameRef.current >= TOTAL_FRAMES - 1) {
      displayFrameRef.current = 0;
    }

    const step = (now: number) => {
      if (now - lastTimestamp >= frameIntervalMs) {
        lastTimestamp = now;
        const next = displayFrameRef.current + 1;
        if (next >= TOTAL_FRAMES) {
          displayFrameRef.current = TOTAL_FRAMES - 1;
          drawFrameToCanvas(TOTAL_FRAMES - 1, true);
          setIsPlayingReduced(false);
          return;
        }
        displayFrameRef.current = next;
        drawFrameToCanvas(next);
      }
      reducedPlayRafRef.current = requestAnimationFrame(step);
    };

    reducedPlayRafRef.current = requestAnimationFrame(step);

    return () => {
      if (reducedPlayRafRef.current !== null) {
        cancelAnimationFrame(reducedPlayRafRef.current);
        reducedPlayRafRef.current = null;
      }
    };
  }, [isReducedMotion, isPlayingReduced, drawFrameToCanvas]);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsReady(false);
    setRetryTick((t) => t + 1);
  }, []);

  const handleSmoothAnchor = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    const el = document.getElementById(targetId);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      ref={trackRef}
      data-video-source={videoSrc}
      aria-label="Bouqcakes Edible Floral Bouquet Assembly"
      className={`relative w-full bg-[#9E8E78] ${
        isReducedMotion ? "h-svh min-h-[540px]" : "h-[260svh] md:h-[300svh] lg:h-[340vh]"
      } ${className}`}
    >
      {/* Native GPU-Composited Sticky Stage — silky smooth on every iPhone, Android, tablet, and desktop */}
      <div className="sticky top-0 left-0 w-full h-svh min-h-[540px] overflow-hidden bg-[#9E8E78]">
        {/* Interactive Canvas Sequence Stage */}
        <canvas
          ref={canvasRef}
          className="block w-full h-full select-none pointer-events-none"
          aria-hidden="true"
        />

        {/* Deep Burgundy editorial contrast veil (animates in at final reveal) */}
        <div
          ref={vignetteRef}
          className="absolute inset-0 pointer-events-none bg-[#481923]"
          style={{ opacity: isReducedMotion ? 0.46 : 0.08 }}
          aria-hidden="true"
        />

        {/* Soft architectural framing shadow */}
        <div
          className="absolute inset-0 pointer-events-none shadow-[inset_0_0_110px_rgba(41,35,33,0.22)]"
          aria-hidden="true"
        />

        {/* INITIAL OVERLAY: Restrained animated scroll indicator */}
        {!isReducedMotion && (
          <div
            ref={introOverlayRef}
            className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end items-center px-5 sm:px-8 pb-6 sm:pb-9"
          >
            <div className="flex flex-col items-center gap-2.5">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#F5EEE5]/92 backdrop-blur-md border border-[#D9B9B2]">
                <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#292321] font-medium">
                  Scroll to Assemble
                </span>
                <ArrowDown className="w-3 h-3 text-[#8F1728]" />
              </div>
              <div className="w-px h-8 bg-[#F5EEE5]/45 overflow-hidden relative">
                <div className="w-full h-3.5 bg-[#F5EEE5] animate-editorial-glide" />
              </div>
            </div>
          </div>
        )}

        {/* FINAL REVEAL OVERLAY: Shown when the finished bouquet completes */}
        <div
          ref={finalOverlayRef}
          className="absolute inset-0 z-30 flex items-center justify-center px-5 sm:px-10"
          style={
            isReducedMotion
              ? { opacity: 1, pointerEvents: "auto" }
              : { opacity: 0, pointerEvents: "none" }
          }
        >
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center pt-14 sm:pt-12">
            <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#D9B9B2] mb-3.5 sm:mb-4">
              Bouqcakes • Dubai
            </span>

            <h1 className="font-serif text-[2.45rem] sm:text-6xl md:text-7xl lg:text-[4.75rem] font-normal text-[#F5EEE5] leading-[1.06] tracking-tight drop-shadow-md mb-3 sm:mb-4">
              The Art of Edible Gifting
            </h1>

            <p className="font-serif italic text-xl sm:text-3xl md:text-[2rem] text-[#D9B9B2] font-light leading-snug drop-shadow-sm mb-7 sm:mb-9">
              Flowers you can savour.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none sm:w-auto">
              <a
                href="#creations"
                onClick={(e) => handleSmoothAnchor(e, "creations")}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#F5EEE5] text-[#481923] border border-[#F5EEE5] font-sans text-[11px] sm:text-xs uppercase tracking-[0.22em] transition-colors duration-300 hover:bg-[#8F1728] hover:text-[#F5EEE5] hover:border-[#8F1728]"
              >
                <span>Explore The Collection</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#inquire"
                onClick={(e) => handleSmoothAnchor(e, "inquire")}
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-[#481923]/65 backdrop-blur-md text-[#F5EEE5] border border-[#D9B9B2]/50 font-sans text-[11px] sm:text-xs uppercase tracking-[0.22em] transition-colors duration-300 hover:bg-[#F5EEE5] hover:text-[#481923] hover:border-[#F5EEE5]"
              >
                Inquire
              </a>
            </div>
          </div>
        </div>

        {/* Hairline Scroll Progress Track */}
        {!isReducedMotion && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#292321]/15 z-30 pointer-events-none">
            <div
              ref={progressBarRef}
              className="w-full h-full bg-[#8F1728] origin-left"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        )}

        {/* Reduced-Motion Accessible Playback Toggle */}
        {isReducedMotion && isReady && (
          <div className="absolute bottom-6 right-6 z-30">
            <button
              type="button"
              onClick={() => setIsPlayingReduced((prev) => !prev)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5EEE5]/92 backdrop-blur-md text-[#292321] border border-[#D9B9B2] font-sans text-[11px] uppercase tracking-[0.2em] hover:bg-[#8F1728] hover:text-[#F5EEE5] hover:border-[#8F1728] transition-colors cursor-pointer"
            >
              {isPlayingReduced ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Film</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Play Assembly</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* LOADING STATE: Brief champagne preloader until frame 1 (10 KB) is painted */}
        {!isReady && !hasError && (
          <div className="absolute inset-0 z-40 bg-[#F5EEE5] flex flex-col items-center justify-center p-6 text-center">
            <div className="relative w-14 h-14 mb-5 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[#D9B9B2] border-t-[#8F1728] animate-spin" />
              <Sparkles className="w-5 h-5 text-[#8F1728]" />
            </div>
            <span className="font-serif text-2xl text-[#292321] tracking-wide mb-1.5">
              Bouqcakes Dubai
            </span>
            <span className="font-sans text-[11px] tracking-[0.24em] uppercase text-[#5E514D]">
              Preparing The Floral Assembly...
            </span>
          </div>
        )}

        {/* ERROR STATE: Graceful fallback if frames fail to load */}
        {hasError && (
          <div className="absolute inset-0 z-40 bg-[#F5EEE5] flex flex-col items-center justify-center p-8 text-center">
            <div className="max-w-md mx-auto flex flex-col items-center">
              <h1 className="font-serif text-4xl text-[#292321] mb-3">
                The Art of Edible Gifting
              </h1>
              <p className="font-serif italic text-2xl text-[#8F1728] mb-6">
                Flowers you can savour.
              </p>
              <p className="font-sans text-xs text-[#5E514D] leading-relaxed mb-6">
                We could not load the bouquet assembly right now. Please retry
                below.
              </p>
              <Button
                onClick={handleRetry}
                variant="primary"
                size="sm"
                icon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Retry
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default BouquetHero;
