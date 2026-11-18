"use client";

import React from "react";
import { motion } from "motion/react";
import { EditorialImage } from "../ui/EditorialImage";

export interface EditorialIntroProps {
  id?: string;
  label?: string;
  headingLead?: string;
  headingAccent?: string;
  description?: string;
  signatureQuote?: string;
  locationNote?: string;
  imageSrc?: string;
  imageAlt?: string;
  captionIndex?: string;
  captionText?: string;
  className?: string;
}

const DEFAULT_IMAGE_SRC =
  "/images/WhatsApp Image 2026-11-18 at 1.14.51 PM (2).jpeg";

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function EditorialIntro({
  id = "artistry",
  label = "EDIBLE FLORAL GIFTING",
  headingLead = "A bouquet,",
  headingAccent = "but make it sweet.",
  description = "Edible floral gifting, crafted to make ordinary moments feel a little more special.",
  signatureQuote = "Without us, it's just cake.",
  locationNote = "Dubai",
  imageSrc = DEFAULT_IMAGE_SRC,
  imageAlt = "BOUQCAKES hand-wrapped edible floral bouquet in deep burgundy paper with an ivory satin ribbon",
  captionIndex = "01 / EDITORIAL",
  captionText = "BOUQCAKES Dubai",
  className = "",
}: EditorialIntroProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`relative w-full bg-[#F5EEE5] text-[#292321] overflow-x-clip ${className}`}
    >
      {/* Visual continuity thread from the cinematic hero */}
      <div
        className="w-full flex justify-center pt-7 sm:pt-9"
        aria-hidden="true"
      >
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: EDITORIAL_EASE }}
          className="w-px h-10 sm:h-12 bg-[#8F1728]/35 origin-top"
        />
      </div>

      {/* Asymmetrical Editorial Spread */}
      <div className="editorial-container pt-8 pb-16 sm:pt-10 sm:pb-20 lg:pt-12 lg:pb-24 xl:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-12 xl:gap-16 items-center">
          {/* LEFT COLUMN: Balanced Editorial Typography */}
          <div className="lg:col-span-6 lg:pr-6 flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: EDITORIAL_EASE }}
              className="flex items-center gap-3 mb-5 sm:mb-6"
            >
              <span
                className="w-7 h-px bg-[#8F1728] shrink-0"
                aria-hidden="true"
              />
              <span className="font-sans text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.26em] text-[#8F1728]">
                {label}
              </span>
            </motion.div>

            <motion.h2
              id={`${id}-heading`}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.95, delay: 0.08, ease: EDITORIAL_EASE }}
              className="font-serif text-[2.5rem] sm:text-5xl lg:text-[3.65rem] xl:text-[4.35rem] font-normal text-[#292321] leading-[1.05] tracking-[-0.015em]"
            >
              <span className="block">{headingLead}</span>
              <span className="block italic font-light text-[#8F1728] mt-1">
                {headingAccent}
              </span>
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.85, delay: 0.2, ease: EDITORIAL_EASE }}
              className="w-14 h-px bg-[#D9B9B2] origin-left my-6 sm:my-7"
              aria-hidden="true"
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.9, delay: 0.26, ease: EDITORIAL_EASE }}
              className="font-sans text-sm sm:text-base md:text-[1.04rem] text-[#5E514D] leading-[1.8] font-light max-w-md"
            >
              {description}
            </motion.p>

            {/* Quiet Verified Colophon */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, delay: 0.34, ease: EDITORIAL_EASE }}
              className="mt-8 sm:mt-10 pt-5 border-t border-[#D9B9B2]/65 w-full max-w-md flex items-baseline justify-between gap-4"
            >
              <p className="font-serif italic text-base sm:text-lg text-[#8F1728]">
                &ldquo;{signatureQuote}&rdquo;
              </p>
              <span className="font-sans text-[10px] uppercase tracking-[0.26em] text-[#7C6D68] shrink-0">
                {locationNote}
              </span>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Proportionate Unboxed Editorial Photograph */}
          <div className="lg:col-span-6">
            <figure className="group w-full max-w-lg mx-auto lg:max-w-none">
              <EditorialImage
                src={imageSrc}
                alt={imageAlt}
                aspectClass="aspect-[4/5] sm:aspect-[5/6]"
                sizes="(max-width: 1024px) 100vw, 48vw"
                parallax
                parallaxAmount={4}
                hoverZoom
                delay={0.1}
                className="lg:max-h-[580px]"
              />

              <figcaption className="mt-3.5 flex items-center justify-between gap-4 border-t border-[#D9B9B2]/60 pt-3">
                <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-[#7C6D68]">
                  {captionIndex}
                </span>
                <span className="font-serif italic text-sm text-[#5E514D]">
                  {captionText}
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EditorialIntro;
