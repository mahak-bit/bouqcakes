"use client";

import React from "react";
import { ArrowUp, ArrowUpRight } from "lucide-react";

export interface FooterProps {
  id?: string;
  instagramUrl?: string;
  className?: string;
}

const FOOTER_NAV_LINKS = [
  { label: "The Concept", href: "#artistry" },
  { label: "Signature Collection", href: "#creations" },
  { label: "Shop by Occasion", href: "#gifting" },
  { label: "The Experience", href: "#atelier" },
  { label: "Custom Gifting", href: "#custom-gifting" },
];

export function Footer({
  id = "inquire",
  instagramUrl,
  className = "",
}: FooterProps) {
  const handleSmoothNav = (
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

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id={id}
      className={`relative z-20 w-full bg-[#481923] text-[#F5EEE5] border-t border-[#D9B9B2]/20 ${className}`}
    >
      <div className="editorial-container pt-14 pb-8 sm:pt-16 sm:pb-10 md:pt-20 md:pb-10">
        {/* Main Editorial Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-10 sm:pb-12 border-b border-[#D9B9B2]/20">
          {/* Column 1: Wordmark & Verified Tagline */}
          <div className="md:col-span-5 flex flex-col items-start">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleBackToTop();
              }}
              className="group inline-flex flex-col items-start"
            >
              <span className="font-serif text-2xl sm:text-3xl font-normal tracking-[0.26em] text-[#F5EEE5] uppercase transition-colors duration-300 group-hover:text-[#D9B9B2]">
                Bouqcakes
              </span>
              <span className="font-sans text-[10px] tracking-[0.28em] uppercase text-[#D9B9B2] mt-1">
                Dubai • Edible Floral Gifting
              </span>
            </a>

            <p className="font-serif italic text-base sm:text-lg text-[#D9B9B2] mt-4">
              &ldquo;Without us, it&apos;s just cake.&rdquo;
            </p>
          </div>

          {/* Column 2: Available Navigation Links */}
          <div className="md:col-span-3">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.28em] text-[#D9B9B2] mb-4 sm:mb-5">
              Explore
            </h3>
            <nav aria-label="Footer navigation" className="flex flex-col gap-2.5 sm:gap-3">
              {FOOTER_NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleSmoothNav(e, link.href)}
                  className="font-sans text-sm text-[#F5EEE5]/88 hover:text-[#D9B9B2] transition-colors duration-200 w-fit"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 3: Verified Contact Details (from BOUQCAKES brand card & bouqcakes.ae) */}
          <div className="md:col-span-4">
            <h3 className="font-sans text-[10px] uppercase tracking-[0.28em] text-[#D9B9B2] mb-4 sm:mb-5">
              Contact
            </h3>
            <address className="not-italic flex flex-col gap-2.5 sm:gap-3 font-sans text-sm text-[#F5EEE5]/88">
              <p className="text-[#F5EEE5]/75">
                Dubai Silicon Oasis, Dubai, UAE
              </p>

              <a
                href="tel:+971502654257"
                className="hover:text-[#D9B9B2] transition-colors duration-200 w-fit"
              >
                +971 50 265 4257
              </a>

              <a
                href="mailto:Bouqcakess@outlook.com"
                className="hover:text-[#D9B9B2] transition-colors duration-200 w-fit"
              >
                Bouqcakess@outlook.com
              </a>

              <a
                href="https://www.bouqcakes.ae"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 hover:text-[#D9B9B2] transition-colors duration-200 w-fit"
              >
                <span>bouqcakes.ae</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#D9B9B2] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 hover:text-[#D9B9B2] transition-colors duration-200 w-fit pt-1"
                >
                  <span>Instagram</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#D9B9B2] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )}
            </address>
          </div>
        </div>

        {/* Bottom Copyright & Quiet Back-to-Top Control */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#D9B9B2]/80 text-center sm:text-left">
            © 2026 BOUQCAKES. All rights reserved.
          </p>

          <button
            type="button"
            onClick={handleBackToTop}
            className="group inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.22em] text-[#F5EEE5]/80 hover:text-[#D9B9B2] transition-colors duration-200 cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
