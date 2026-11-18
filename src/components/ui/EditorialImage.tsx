"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface EditorialImageProps {
  src: string;
  alt: string;
  aspectClass?: string;
  sizes?: string;
  parallax?: boolean;
  parallaxAmount?: number;
  hoverZoom?: boolean;
  delay?: number;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  placeholderLabel?: string;
}

const REVEAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function EditorialImage({
  src,
  alt,
  aspectClass = "aspect-[4/5]",
  sizes = "(max-width: 1024px) 100vw, 50vw",
  parallax = false,
  parallaxAmount = 5,
  hoverZoom = true,
  delay = 0,
  priority = false,
  className = "",
  imageClassName = "object-cover object-center",
  placeholderLabel = "BOUQCAKES Photography",
}: EditorialImageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!parallax || typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    // Keep mobile lightweight: run subtle parallax on desktop when motion is allowed
    if (prefersReducedMotion || !isDesktop) return;

    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!frame || !media) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        media,
        { yPercent: -parallaxAmount },
        {
          yPercent: parallaxAmount,
          ease: "none",
          scrollTrigger: {
            trigger: frame,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.75,
          },
        }
      );
    }, frame);

    return () => {
      ctx.revert();
    };
  }, [parallax, parallaxAmount]);

  return (
    <motion.div
      ref={frameRef}
      initial={
        prefersReduced
          ? { opacity: 1 }
          : { opacity: 0, clipPath: "inset(6% 0% 0% 0%)" }
      }
      whileInView={
        prefersReduced
          ? { opacity: 1 }
          : { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }
      }
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: prefersReduced ? 0 : 1.05, delay, ease: REVEAL_EASE }}
      className={`relative w-full ${aspectClass} overflow-hidden bg-[#EAE0D4] ${className}`}
    >
      {!hasError && src ? (
        <div
          ref={mediaRef}
          className={`relative w-full ${
            parallax ? "lg:h-[114%] lg:-top-[7%] h-full" : "h-full"
          } will-change-transform`}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            onError={() => setHasError(true)}
            className={`${imageClassName} ${
              hoverZoom
                ? "transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                : ""
            }`}
          />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center border border-dashed border-[#D9B9B2]">
          <span className="font-sans text-[10px] uppercase tracking-[0.26em] text-[#8F1728] mb-2">
            Image Placeholder
          </span>
          <span className="font-serif italic text-lg text-[#5E514D]">
            {placeholderLabel}
          </span>
        </div>
      )}
    </motion.div>
  );
}

export default EditorialImage;
