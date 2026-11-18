"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export interface OccasionItem {
  id: string;
  index: string;
  title: string;
  ctaLabel: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  imageClassName?: string;
}

export interface ShopByOccasionProps {
  id?: string;
  eyebrow?: string;
  heading?: string;
  supportingLine?: string;
  occasions?: OccasionItem[];
  className?: string;
}

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Real BOUQCAKES photographs used strictly as atmospheric gifting visuals (no invented product associations)
const DEFAULT_OCCASIONS: OccasionItem[] = [
  {
    id: "birthday",
    index: "01",
    title: "Birthday",
    ctaLabel: "Explore",
    href: "#inquire",
    imageSrc: "/images/WhatsApp Image 2026-11-18 at 1.14.50 PM (1).jpeg",
    imageAlt: "BOUQCAKES hand-wrapped blush and rose edible floral bouquet",
    imageClassName: "object-cover object-center",
  },
  {
    id: "anniversary",
    index: "02",
    title: "Anniversary",
    ctaLabel: "Explore",
    href: "#inquire",
    imageSrc: "/images/WhatsApp Image 2026-11-18 at 1.14.50 PM (2).jpeg",
    imageAlt: "BOUQCAKES plum, cherry, and ivory edible floral bouquet",
    imageClassName: "object-cover object-center",
  },
  {
    id: "thank-you",
    index: "03",
    title: "Thank You",
    ctaLabel: "Explore",
    href: "#inquire",
    imageSrc: "/images/WhatsApp Image 2026-11-18 at 1.14.50 PM (3).jpeg",
    imageAlt: "BOUQCAKES warm ivory and butter-yellow edible floral bouquet",
    imageClassName: "object-cover object-center",
  },
  {
    id: "just-because",
    index: "04",
    title: "Just Because",
    ctaLabel: "Explore",
    href: "#inquire",
    imageSrc: "/images/WhatsApp Image 2026-11-18 at 1.14.50 PM.jpeg",
    imageAlt: "BOUQCAKES vibrant garden-inspired edible floral bouquet",
    imageClassName: "object-cover object-[center_62%] scale-[1.08]",
  },
];

export function ShopByOccasion({
  id = "gifting",
  eyebrow = "03 / OCCASIONS",
  heading = "Shop by Occasion",
  supportingLine = "For the moments worth marking sweetly.",
  occasions = DEFAULT_OCCASIONS,
  className = "",
}: ShopByOccasionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeOccasion = occasions[activeIndex] ?? occasions[0];

  const handleCtaScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href.startsWith("#")) return;
    const target = document.getElementById(href.slice(1));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`relative w-full bg-[#F5EEE5] text-[#292321] border-t border-[#D9B9B2]/60 overflow-x-clip ${className}`}
    >
      <div className="editorial-container section-space">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-end mb-10 md:mb-12 lg:mb-14">
          <div className="lg:col-span-7">
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.95, delay: 0.08, ease: EDITORIAL_EASE }}
              className="font-serif text-[2.35rem] sm:text-5xl lg:text-[3.75rem] xl:text-[4.35rem] font-normal text-[#292321] leading-[1.05] tracking-[-0.015em]"
            >
              {heading}
            </motion.h2>
          </div>

          <div className="lg:col-span-5 lg:flex lg:justify-end">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, delay: 0.16, ease: EDITORIAL_EASE }}
              className="font-sans text-sm sm:text-base text-[#5E514D] leading-[1.75] font-light max-w-sm lg:text-right"
            >
              {supportingLine}
            </motion.p>
          </div>
        </div>

        {/* Asymmetric Editorial Index (Left) + Cross-Fading Visual Stage (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Mobile Visual Stage (Compact & Balanced) */}
          <div className="lg:hidden w-full max-w-md mx-auto">
            <div className="relative aspect-[5/4] w-full overflow-hidden bg-[#EAE0D4]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeOccasion.id}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: EDITORIAL_EASE }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeOccasion.imageSrc}
                    alt={activeOccasion.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className={
                      activeOccasion.imageClassName ??
                      "object-cover object-center"
                    }
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#D9B9B2]/65 flex items-center justify-between">
              <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-[#8F1728]">
                {activeOccasion.index} / 0{occasions.length}
              </span>
              <span className="font-serif italic text-sm text-[#5E514D]">
                {activeOccasion.title}
              </span>
            </div>
          </div>

          {/* LEFT COLUMN: Editorial Typographic Index */}
          <div className="lg:col-span-7 border-t border-[#D9B9B2]/65">
            {occasions.map((item, idx) => {
              const isActive = idx === activeIndex;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    duration: 0.8,
                    delay: idx * 0.06,
                    ease: EDITORIAL_EASE,
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onFocus={() => setActiveIndex(idx)}
                  className="relative border-b border-[#D9B9B2]/65 group"
                >
                  {/* Animated Deep Cherry accent hairline */}
                  <span
                    className={`absolute bottom-0 left-0 h-px bg-[#8F1728] transition-all duration-500 ease-out ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                    aria-hidden="true"
                  />

                  <div className="py-5 sm:py-6 md:py-7 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-pressed={isActive}
                      className="flex items-baseline gap-4 sm:gap-7 text-left focus:outline-hidden cursor-pointer flex-1"
                    >
                      <span
                        className={`font-sans text-[10px] sm:text-[11px] tracking-[0.24em] uppercase transition-colors duration-300 ${
                          isActive
                            ? "text-[#8F1728]"
                            : "text-[#7C6D68] group-hover:text-[#8F1728]"
                        }`}
                      >
                        {item.index}
                      </span>

                      <span
                        className={`font-serif text-[1.85rem] sm:text-4xl md:text-[2.85rem] leading-[1.08] tracking-[-0.01em] transition-all duration-500 ease-out ${
                          isActive
                            ? "text-[#8F1728] italic translate-x-2"
                            : "text-[#292321] group-hover:text-[#8F1728] group-hover:translate-x-2"
                        }`}
                      >
                        {item.title}
                      </span>
                    </button>

                    <Link
                      href={item.href}
                      onClick={(e) => handleCtaScroll(e, item.href)}
                      aria-label={`${item.ctaLabel} ${item.title} gifting`}
                      className={`inline-flex items-center gap-2 font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.22em] py-1 transition-all duration-300 shrink-0 ${
                        isActive
                          ? "text-[#292321] opacity-100"
                          : "text-[#5E514D] opacity-75 group-hover:opacity-100 group-hover:text-[#292321]"
                      }`}
                    >
                      <span>{item.ctaLabel}</span>
                      <ArrowUpRight
                        className={`w-3.5 h-3.5 transition-transform duration-300 ${
                          isActive
                            ? "translate-x-0.5 -translate-y-0.5 text-[#8F1728]"
                            : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#8F1728]"
                        }`}
                      />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: Desktop Editorial Visual Stage */}
          <div className="hidden lg:block lg:col-span-5 lg:pl-4">
            <motion.figure
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1, ease: EDITORIAL_EASE }}
            >
              <div className="relative aspect-[4/5] max-h-[500px] w-full overflow-hidden bg-[#EAE0D4]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeOccasion.id}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.65, ease: EDITORIAL_EASE }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeOccasion.imageSrc}
                      alt={activeOccasion.imageAlt}
                      fill
                      sizes="38vw"
                      className={
                        activeOccasion.imageClassName ??
                        "object-cover object-center"
                      }
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <figcaption className="mt-3.5 pt-3 border-t border-[#D9B9B2]/65 flex items-center justify-between">
                <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-[#8F1728]">
                  {activeOccasion.index} / 0{occasions.length}
                </span>
                <span className="font-serif italic text-sm text-[#5E514D]">
                  {activeOccasion.title}
                </span>
              </figcaption>
            </motion.figure>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ShopByOccasion;
