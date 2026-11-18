"use client";

import React from "react";
import { motion } from "motion/react";
import { EditorialImage } from "../ui/EditorialImage";

export interface BouqcakesExperienceProps {
  id?: string;
  eyebrow?: string;
  headingLead?: string;
  headingAccent?: string;
  supportingCopy?: string;
  primaryImageSrc?: string;
  primaryImageAlt?: string;
  secondaryImageSrc?: string;
  secondaryImageAlt?: string;
  className?: string;
}

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function BouqcakesExperience({
  id = "atelier",
  eyebrow = "04 / THE EXPERIENCE",
  headingLead = "More than a bouquet.",
  headingAccent = "A moment to remember.",
  supportingCopy = "An unexpected way to celebrate, surprise and make someone feel special.",
  primaryImageSrc = "/images/WhatsApp Image 2026-11-18 at 1.14.50 PM (2).jpeg",
  primaryImageAlt = "BOUQCAKES hand-wrapped plum, cherry, and ivory edible floral bouquet",
  secondaryImageSrc = "/images/WhatsApp Image 2026-11-18 at 1.14.50 PM (1).jpeg",
  secondaryImageAlt = "BOUQCAKES blush rose edible bouquet wrapped with a satin ribbon",
  className = "",
}: BouqcakesExperienceProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`relative w-full bg-[#F5EEE5] text-[#292321] border-t border-[#D9B9B2]/60 overflow-x-clip ${className}`}
    >
      <div className="editorial-container section-space">
        {/* Editorial Magazine Masthead */}
        <div className="max-w-4xl mb-10 md:mb-12 lg:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: EDITORIAL_EASE }}
            className="flex items-center gap-3 mb-4 sm:mb-5"
          >
            <span
              className="w-7 h-px bg-[#8F1728] shrink-0"
              aria-hidden="true"
            />
            <span className="font-sans text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.26em] text-[#8F1728]">
              {eyebrow}
            </span>
          </motion.div>

          <motion.h2
            id={`${id}-heading`}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.95, delay: 0.08, ease: EDITORIAL_EASE }}
            className="font-serif text-[2.35rem] sm:text-5xl lg:text-[3.75rem] xl:text-[4.35rem] font-normal text-[#292321] leading-[1.05] tracking-[-0.015em]"
          >
            <span className="block">{headingLead}</span>
            <span className="block italic font-light text-[#8F1728] mt-1">
              {headingAccent}
            </span>
          </motion.h2>
        </div>

        {/* Asymmetric Editorial Diptych Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left: Primary Editorial Photograph */}
          <figure className="group lg:col-span-7 flex flex-col">
            <EditorialImage
              src={primaryImageSrc}
              alt={primaryImageAlt}
              aspectClass="aspect-[4/5] sm:aspect-[5/4]"
              sizes="(max-width: 1024px) 100vw, 58vw"
              parallax
              parallaxAmount={4}
              hoverZoom
            />
            <figcaption className="mt-3.5 pt-3 border-t border-[#D9B9B2]/65 flex items-center justify-between gap-4">
              <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-[#7C6D68]">
                THE GESTURE
              </span>
              <span className="font-serif italic text-sm text-[#5E514D]">
                BOUQCAKES Dubai
              </span>
            </figcaption>
          </figure>

          {/* Right: Editorial Statement + Baseline-Aligned Secondary Portrait */}
          <div className="lg:col-span-5 lg:pl-4 flex flex-col justify-between gap-8 lg:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, delay: 0.14, ease: EDITORIAL_EASE }}
            >
              <div
                className="w-12 h-px bg-[#D9B9B2] mb-5 sm:mb-6"
                aria-hidden="true"
              />
              <p className="font-sans text-sm sm:text-base md:text-[1.06rem] text-[#5E514D] leading-[1.8] font-light max-w-md">
                {supportingCopy}
              </p>
            </motion.div>

            <figure className="group w-full max-w-sm lg:max-w-none">
              <EditorialImage
                src={secondaryImageSrc}
                alt={secondaryImageAlt}
                aspectClass="aspect-[4/3]"
                sizes="(max-width: 1024px) 90vw, 38vw"
                parallax
                parallaxAmount={4}
                hoverZoom
                delay={0.12}
              />
              <figcaption className="mt-3.5 pt-3 border-t border-[#D9B9B2]/65 flex items-center justify-between gap-4">
                <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-[#7C6D68]">
                  THE MOMENT
                </span>
                <span className="font-serif italic text-sm text-[#5E514D]">
                  Edible floral gifting
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BouqcakesExperience;
