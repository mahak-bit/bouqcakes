"use client";

import React from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { EditorialImage } from "../ui/EditorialImage";

export interface CustomGiftingProps {
  id?: string;
  eyebrow?: string;
  headingLead?: string;
  headingAccent?: string;
  supportingCopy?: string;
  ctaLabel?: string;
  ctaTargetId?: string;
  primaryImageSrc?: string;
  primaryImageAlt?: string;
  accentImageSrc?: string;
  accentImageAlt?: string;
  className?: string;
}

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function CustomGifting({
  id = "custom-gifting",
  eyebrow = "05 / CUSTOM GIFTING",
  headingLead = "Make it",
  headingAccent = "personal.",
  supportingCopy = "Some moments deserve something made just for them.",
  ctaLabel = "Create a custom gift",
  ctaTargetId = "inquire",
  primaryImageSrc = "/images/WhatsApp Image 2026-11-18 at 1.14.50 PM (3).jpeg",
  primaryImageAlt = "BOUQCAKES sunlit ivory and butter-yellow edible floral bouquet",
  accentImageSrc = "/images/WhatsApp Image 2026-11-18 at 1.14.52 PM (2).jpeg",
  accentImageAlt = "BOUQCAKES blush rose and ranunculus piped edible bouquet detail",
  className = "",
}: CustomGiftingProps) {
  const handleConceptCta = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(ctaTargetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`relative w-full bg-[#8F1728] text-[#F5EEE5] overflow-x-clip ${className}`}
    >
      <div className="editorial-container section-space">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-12 items-center">
          {/* LEFT COLUMN: Layered Editorial Image Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full max-w-lg mx-auto lg:max-w-none pb-4 sm:pb-6 lg:pb-0">
              <figure className="group">
                <EditorialImage
                  src={primaryImageSrc}
                  alt={primaryImageAlt}
                  aspectClass="aspect-[4/5] sm:aspect-[5/6]"
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  parallax
                  parallaxAmount={4}
                  hoverZoom
                  className="lg:max-h-[560px]"
                />
              </figure>

              {/* Editorial Offset Detail Inset (Cleanly nested within column bounds) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.95,
                  delay: 0.2,
                  ease: EDITORIAL_EASE,
                }}
                className="hidden sm:block absolute bottom-0 lg:-bottom-6 right-4 md:right-6 w-36 md:w-44 bg-[#F5EEE5] p-2 border border-[#D9B9B2]/50"
              >
                <div className="group">
                  <EditorialImage
                    src={accentImageSrc}
                    alt={accentImageAlt}
                    aspectClass="aspect-square"
                    sizes="176px"
                    parallax={false}
                    hoverZoom
                    delay={0.25}
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* RIGHT COLUMN: Bespoke Typography & Concept CTA */}
          <div className="lg:col-span-5 lg:col-start-8 flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: EDITORIAL_EASE }}
              className="flex items-center gap-3 mb-5 sm:mb-6"
            >
              <span
                className="w-7 h-px bg-[#D9B9B2] shrink-0"
                aria-hidden="true"
              />
              <span className="font-sans text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.26em] text-[#D9B9B2]">
                {eyebrow}
              </span>
            </motion.div>

            <motion.h2
              id={`${id}-heading`}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.95, delay: 0.08, ease: EDITORIAL_EASE }}
              className="font-serif text-[2.5rem] sm:text-5xl lg:text-[3.75rem] xl:text-[4.35rem] font-normal text-[#F5EEE5] leading-[1.05] tracking-[-0.015em]"
            >
              <span>{headingLead} </span>
              <span className="italic font-light text-[#D9B9B2] block sm:inline">
                {headingAccent}
              </span>
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.85, delay: 0.18, ease: EDITORIAL_EASE }}
              className="w-14 h-px bg-[#D9B9B2]/55 origin-left my-6 sm:my-7"
              aria-hidden="true"
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.9, delay: 0.24, ease: EDITORIAL_EASE }}
              className="font-sans text-sm sm:text-base md:text-[1.05rem] text-[#F5EEE5]/90 leading-[1.8] font-light max-w-md mb-8 sm:mb-9"
            >
              {supportingCopy}
            </motion.p>

            {/* Concept CTA — smoothly links to verified contact details */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, delay: 0.32, ease: EDITORIAL_EASE }}
              className="flex flex-col items-start gap-3"
            >
              <a
                href={`#${ctaTargetId}`}
                onClick={handleConceptCta}
                className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#F5EEE5] text-[#481923] border border-[#F5EEE5] font-sans text-[11px] sm:text-xs uppercase tracking-[0.22em] font-medium transition-colors duration-300 hover:bg-[#481923] hover:text-[#F5EEE5] hover:border-[#481923]"
              >
                <span>{ctaLabel}</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-[#D9B9B2] pl-1">
                Enquire directly with our Dubai studio
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CustomGifting;
