"use client";

import React from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { EditorialImage } from "../ui/EditorialImage";

export interface CollectionPiece {
  id: string;
  index: string;
  label: string;
  meta: string;
  imageSrc: string;
  imageAlt: string;
  imageClassName?: string;
}

export interface SignatureCollectionProps {
  id?: string;
  eyebrow?: string;
  heading?: string;
  supportingLine?: string;
  pieces?: CollectionPiece[];
  className?: string;
}

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Real BOUQCAKES product imagery from public/images/ — no invented names, prices, or descriptions
const DEFAULT_PIECES: CollectionPiece[] = [
  {
    id: "piece-01",
    index: "01",
    label: "Signature Bouquet",
    meta: "Featured Arrangement",
    imageSrc: "/images/WhatsApp Image 2026-11-18 at 1.14.52 PM (2).jpeg",
    imageAlt:
      "BOUQCAKES blush and dusty rose piped floral bouquet wrapped in soft mauve paper",
    imageClassName: "object-cover object-center",
  },
  {
    id: "piece-02",
    index: "02",
    label: "Edible Bouquet",
    meta: "Wrapped Presentation",
    imageSrc: "/images/WhatsApp Image 2026-11-18 at 1.14.51 PM (1).jpeg",
    imageAlt:
      "BOUQCAKES crimson and soft pink floral bouquet wrapped in ivory paper with cherry ribbon",
    imageClassName: "object-cover object-center",
  },
  {
    id: "piece-03",
    index: "03",
    label: "Edible Bouquet",
    meta: "Floral Arrangement",
    imageSrc: "/images/WhatsApp Image 2026-11-18 at 1.14.49 PM.jpeg",
    imageAlt:
      "BOUQCAKES pastel peach, blush, and cream piped floral bouquet",
    imageClassName: "object-cover object-[60%_center] scale-[1.06]",
  },
  {
    id: "piece-04",
    index: "04",
    label: "Edible Bouquet",
    meta: "Wrapped Presentation",
    imageSrc: "/images/WhatsApp Image 2026-11-18 at 1.14.52 PM (1).jpeg",
    imageAlt:
      "BOUQCAKES cream, blush, and deep cherry floral bouquet in warm ivory wrap",
    imageClassName: "object-cover object-center",
  },
  {
    id: "piece-05",
    index: "05",
    label: "Floral Craft",
    meta: "Close-Up Study",
    imageSrc: "/images/WhatsApp Image 2026-11-18 at 1.14.51 PM.jpeg",
    imageAlt:
      "Close-up detail of hand-piped BOUQCAKES edible flowers in cherry, blush, and cream",
    imageClassName: "object-cover object-center",
  },
];

function PieceCaption({ piece }: { piece: CollectionPiece }) {
  return (
    <figcaption className="mt-3.5 pt-3 border-t border-[#D9B9B2]/65 flex items-baseline justify-between gap-4">
      <div className="flex items-baseline gap-3">
        <span className="font-sans text-[10px] tracking-[0.24em] uppercase text-[#8F1728]">
          {piece.index}
        </span>
        <span className="font-serif text-lg sm:text-xl text-[#292321] transition-colors duration-300 group-hover:text-[#8F1728]">
          {piece.label}
        </span>
      </div>
      <div className="flex items-center gap-2 text-[#7C6D68] transition-colors duration-300 group-hover:text-[#8F1728]">
        <span className="font-sans text-[10px] uppercase tracking-[0.22em] hidden sm:inline">
          {piece.meta}
        </span>
        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </figcaption>
  );
}

export function SignatureCollection({
  id = "creations",
  eyebrow = "02 / COLLECTION",
  heading = "Signature Collection",
  supportingLine = "Thoughtfully made to be admired, gifted, and savoured.",
  pieces = DEFAULT_PIECES,
  className = "",
}: SignatureCollectionProps) {
  const [featured, second, third, fourth, fifth] = pieces;

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`relative w-full bg-[#F5EEE5] text-[#292321] border-t border-[#D9B9B2]/60 overflow-x-clip ${className}`}
    >
      <div className="editorial-container section-space">
        {/* Asymmetric Section Masthead */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-end pb-8 md:pb-10 lg:pb-12 border-b border-[#D9B9B2]/60">
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

        {/* BAND 1: Large Featured Piece (Left) + Offset Supporting Piece (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 pt-10 md:pt-12 lg:pt-14 items-start">
          {featured && (
            <figure className="group lg:col-span-7">
              <EditorialImage
                src={featured.imageSrc}
                alt={featured.imageAlt}
                aspectClass="aspect-[4/5] md:aspect-[5/4]"
                sizes="(max-width: 1024px) 100vw, 58vw"
                parallax
                parallaxAmount={4}
                hoverZoom
                imageClassName={featured.imageClassName}
              />
              <PieceCaption piece={featured} />
            </figure>
          )}

          {second && (
            <figure className="group lg:col-span-4 lg:col-start-9 lg:pt-12 max-w-md lg:max-w-none">
              <EditorialImage
                src={second.imageSrc}
                alt={second.imageAlt}
                aspectClass="aspect-[4/5]"
                sizes="(max-width: 1024px) 100vw, 33vw"
                parallax
                parallaxAmount={4}
                hoverZoom
                delay={0.1}
                imageClassName={second.imageClassName}
              />
              <PieceCaption piece={second} />
            </figure>
          )}
        </div>

        {/* BAND 2: Inverted Asymmetric Rhythm — Upright Left, Wide Feature Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 pt-12 md:pt-16 lg:pt-20 items-start">
          {third && (
            <figure className="group lg:col-span-5 lg:pt-8 max-w-md lg:max-w-none">
              <EditorialImage
                src={third.imageSrc}
                alt={third.imageAlt}
                aspectClass="aspect-[4/5]"
                sizes="(max-width: 1024px) 100vw, 40vw"
                parallax
                parallaxAmount={4}
                hoverZoom
                imageClassName={third.imageClassName}
              />
              <PieceCaption piece={third} />
            </figure>
          )}

          {fourth && (
            <figure className="group lg:col-span-6 lg:col-start-7">
              <EditorialImage
                src={fourth.imageSrc}
                alt={fourth.imageAlt}
                aspectClass="aspect-[4/5] md:aspect-[5/4]"
                sizes="(max-width: 1024px) 100vw, 48vw"
                parallax
                parallaxAmount={4}
                hoverZoom
                delay={0.1}
                imageClassName={fourth.imageClassName}
              />
              <PieceCaption piece={fourth} />
            </figure>
          )}
        </div>

        {/* BAND 3: Wide Editorial Close-Up Study */}
        {fifth && (
          <div className="grid grid-cols-1 lg:grid-cols-12 pt-12 md:pt-16 lg:pt-20">
            <figure className="group lg:col-span-10 lg:col-start-2">
              <EditorialImage
                src={fifth.imageSrc}
                alt={fifth.imageAlt}
                aspectClass="aspect-[4/3] sm:aspect-[16/9]"
                sizes="(max-width: 1024px) 100vw, 80vw"
                parallax
                parallaxAmount={4}
                hoverZoom
                imageClassName={fifth.imageClassName}
              />
              <PieceCaption piece={fifth} />
            </figure>
          </div>
        )}
      </div>
    </section>
  );
}

export default SignatureCollection;
