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
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Direct DOM refs for zero-re-render 60fps scroll choreography
  const introOverlayRef = useRef<HTMLDivElement>(null);
  const finalOverlayRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Scrubbing refs
  const targetTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const hasPrimedRef = useRef<boolean>(false);

  // State
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isPlayingReduced, setIsPlayingReduced] = useState<boolean>(false);

  // 1. Hydration-safe reduced-motion subscription (React 19 idiomatic)
  const isReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  // 2. Hydration-safe video metadata detection
  const markVideoReady = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const duration = video.duration;
    if (duration && Number.isFinite(duration) && duration > 0) {
      setVideoDuration(duration);
      setIsVideoLoaded(true);
      setHasError(false);

      // Ensure video never autoplays
      video.pause();

      // Prime first frame once so the opening frame is painted cleanly
      if (!hasPrimedRef.current) {
        hasPrimedRef.current = true;
        try {
          video.currentTime = 0.001;
        } catch {
          // Ignore seek errors during initialization
        }
      }
    }
  }, []);

  const handleVideoError = useCallback(() => {
    setHasError(true);
    setIsVideoLoaded(false);
  }, []);

  const handleRetry = useCallback(() => {
    hasPrimedRef.current = false;
    setHasError(false);
    setIsVideoLoaded(false);
    const video = videoRef.current;
    if (video) {
      video.load();
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Critical for Next.js SSR: the browser may have loaded metadata BEFORE React hydrated
    if (video.readyState >= 1) {
      markVideoReady();
    } else if (video.networkState === 0) {
      video.load();
    }

    video.addEventListener("loadedmetadata", markVideoReady);
    video.addEventListener("durationchange", markVideoReady);
    video.addEventListener("loadeddata", markVideoReady);
    video.addEventListener("canplay", markVideoReady);
    video.addEventListener("error", handleVideoError);

    return () => {
      video.removeEventListener("loadedmetadata", markVideoReady);
      video.removeEventListener("durationchange", markVideoReady);
      video.removeEventListener("loadeddata", markVideoReady);
      video.removeEventListener("canplay", markVideoReady);
      video.removeEventListener("error", handleVideoError);
    };
  }, [videoSrc, markVideoReady, handleVideoError]);

  // 3. Dedicated requestAnimationFrame loop for efficient video seeking
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideoLoaded || isReducedMotion) return;

    const seekLoop = () => {
      if (video.readyState >= 1) {
        const target = targetTimeRef.current;
        const current = video.currentTime;
        const delta = Math.abs(current - target);

        // Use native video.seeking to avoid overwhelming the decoder
        if (!video.seeking && delta > 0.015) {
          try {
            video.currentTime = target;
          } catch {
            // Ignore aborted seeks
          }
        }
      }
      rafIdRef.current = requestAnimationFrame(seekLoop);
    };

    rafIdRef.current = requestAnimationFrame(seekLoop);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isVideoLoaded, isReducedMotion]);

  // 4. GSAP ScrollTrigger pinning + scroll progress -> video.currentTime & text reveals
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !isVideoLoaded ||
      isReducedMotion ||
      videoDuration <= 0
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    // Leave a tiny safety buffer before EOF so browsers hold the final assembled frame
    const maxSafeTime = Math.max(0, videoDuration - 0.05);

    const ctx = gsap.context(() => {
      // Set initial visual states
      if (introOverlayRef.current) {
        gsap.set(introOverlayRef.current, { opacity: 1, y: 0 });
      }
      if (finalOverlayRef.current) {
        gsap.set(finalOverlayRef.current, {
          opacity: 0,
          y: 28,
          scale: 0.97,
          pointerEvents: "none",
        });
      }
      if (vignetteRef.current) {
        gsap.set(vignetteRef.current, { opacity: 0.08 });
      }
      if (progressBarRef.current) {
        gsap.set(progressBarRef.current, { scaleX: 0, transformOrigin: "left center" });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => (window.innerWidth < 768 ? "+=220%" : "+=300%"),
          pin: true,
          pinSpacing: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = Math.max(0, Math.min(1, self.progress));
            targetTimeRef.current = progress * maxSafeTime;

            if (finalOverlayRef.current) {
              finalOverlayRef.current.style.pointerEvents =
                progress >= 0.85 ? "auto" : "none";
            }
          },
        },
      });

      // Timeline normalized from 0 to 1
      // Progress bar tracks full 0 -> 1 scroll duration
      if (progressBarRef.current) {
        tl.to(progressBarRef.current, { scaleX: 1, ease: "none", duration: 1 }, 0);
      }

      // Intro cue & scroll indicator gently fade away as scrubbing starts (0 -> 0.14)
      if (introOverlayRef.current) {
        tl.to(
          introOverlayRef.current,
          { opacity: 0, y: -24, ease: "power1.out", duration: 0.14 },
          0
        );
      }

      // Subtle warm vignette deepens slightly near completion for crisp editorial contrast (0.76 -> 0.95)
      if (vignetteRef.current) {
        tl.to(
          vignetteRef.current,
          { opacity: 0.52, ease: "power1.inOut", duration: 0.2 },
          0.76
        );
      }

      // Reveal the final finished bouquet headline & CTA once the bouquet completes (0.82 -> 0.98)
      if (finalOverlayRef.current) {
        tl.to(
          finalOverlayRef.current,
          { opacity: 1, y: 0, scale: 1, ease: "power2.out", duration: 0.16 },
          0.82
        );
      }
    }, section);

    // Ensure ScrollTrigger recalculates page geometry right after pin creation
    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
    };
  }, [isVideoLoaded, videoDuration, isReducedMotion]);

  // 5. Reduced-motion: show the finished bouquet frame & reveal text immediately
  useEffect(() => {
    const video = videoRef.current;
    if (!isReducedMotion || !isVideoLoaded || !video || videoDuration <= 0) return;

    try {
      video.currentTime = Math.max(0, videoDuration - 0.05);
    } catch {
      // Ignore seek error
    }
  }, [isReducedMotion, isVideoLoaded, videoDuration]);

  const handleTogglePlayReduced = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlayingReduced) {
      video.pause();
      setIsPlayingReduced(false);
    } else {
      if (video.currentTime >= video.duration - 0.1) {
        video.currentTime = 0;
      }
      video
        .play()
        .then(() => setIsPlayingReduced(true))
        .catch(() => setIsPlayingReduced(false));
    }
  };

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
      ref={sectionRef}
      aria-label="Bouqcakes Edible Floral Bouquet Assembly"
      className={`relative w-full h-svh min-h-[540px] overflow-hidden bg-[#F5EEE5] ${className}`}
    >
      {/* Full-Bleed HTML5 Video Stage */}
      <div className="relative w-full h-full overflow-hidden bg-[#F5EEE5]">
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          controls={false}
          onLoadedMetadata={markVideoReady}
          onCanPlay={markVideoReady}
          onError={handleVideoError}
          onEnded={() => setIsPlayingReduced(false)}
          className="w-full h-full object-cover object-center select-none pointer-events-none"
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
          className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(41,35,33,0.22)]"
          aria-hidden="true"
        />

        {/* INITIAL OVERLAY: Restrained animated scroll indicator */}
        {!isReducedMotion && (
          <div
            ref={introOverlayRef}
            className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end items-center px-5 sm:px-8 pb-6 sm:pb-9"
          >
            <div className="flex flex-col items-center gap-2.5">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#F5EEE5]/90 backdrop-blur-md border border-[#D9B9B2]">
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
        {isReducedMotion && isVideoLoaded && (
          <div className="absolute bottom-6 right-6 z-30">
            <button
              onClick={handleTogglePlayReduced}
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

        {/* LOADING STATE: Shown cleanly until video metadata is available */}
        {!isVideoLoaded && !hasError && (
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

        {/* ERROR STATE: Graceful fallback if video fails to load */}
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
                We could not load the bouquet assembly video at this moment.
                Please retry below.
              </p>
              <Button
                onClick={handleRetry}
                variant="primary"
                size="sm"
                icon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Retry Video
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default BouquetHero;
