"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export interface FinalCtaProps {
  id?: string;
  eyebrow?: string;
  headingLead?: string;
  headingAccent?: string;
  ctaLabel?: string;
  collectionSectionId?: string;
  backgroundImageSrc?: string;
  backgroundImageAlt?: string;
  className?: string;
}

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function FinalCta({
  id = "finale",
  eyebrow = "BOUQCAKES • DUBAI",
  headingLead = "Make someone's day",
  headingAccent = "a little sweeter.",
  ctaLabel = "Discover the Collection",
  collectionSectionId = "creations",
  backgroundImageSrc = "/images/WhatsApp Image 2026-11-18 at 1.14.51 PM.jpeg",
  backgroundImageAlt = "Close-up of handcrafted BOUQCAKES edible buttercream flowers",
  className = "",
}: FinalCtaProps) {
  const handleDiscoverClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(collectionSectionId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`relative w-full bg-[#481923] text-[#F5EEE5] overflow-hidden ${className}`}
    >
      {/* Subtle Atmospheric Real Floral Backdrop */}
      <motion.div
        initial={{ scale: 1.06, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 0.2 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.3, ease: EDITORIAL_EASE }}
        className="absolute inset-0 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src={backgroundImageSrc}
          alt={backgroundImageAlt}
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Deep Burgundy Veil for Dramatic Editorial Contrast */}
      <div
        className="absolute inset-0 bg-[#481923]/76 pointer-events-none"
        aria-hidden="true"
      />

      {/* Centered Campaign Finale Composition */}
      <div className="relative z-10 editorial-container py-20 sm:py-24 md:py-28 lg:py-32 flex flex-col items-center text-center">
        {/* Delicate vertical hairline */}
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.85, ease: EDITORIAL_EASE }}
          className="w-px h-10 bg-[#D9B9B2]/50 origin-top mb-6 sm:mb-7"
          aria-hidden="true"
        />

        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.08, ease: EDITORIAL_EASE }}
          className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#D9B9B2] mb-4 sm:mb-5"
        >
          {eyebrow}
        </motion.span>

        <motion.h2
          id={`${id}-heading`}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.95, delay: 0.14, ease: EDITORIAL_EASE }}
          className="font-serif text-[2.45rem] sm:text-5xl md:text-6xl lg:text-[4.5rem] font-normal text-[#F5EEE5] leading-[1.06] tracking-[-0.015em] max-w-3xl mb-8 sm:mb-10"
        >
          <span className="block">{headingLead}</span>
          <span className="block italic font-light text-[#D9B9B2] mt-1">
            {headingAccent}
          </span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, delay: 0.24, ease: EDITORIAL_EASE }}
        >
          <a
            href={`#${collectionSectionId}`}
            onClick={handleDiscoverClick}
            className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#F5EEE5] text-[#481923] border border-[#F5EEE5] font-sans text-[11px] sm:text-xs uppercase tracking-[0.22em] font-medium transition-colors duration-300 hover:bg-[#8F1728] hover:text-[#F5EEE5] hover:border-[#8F1728]"
          >
            <span>{ctaLabel}</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default FinalCta;
