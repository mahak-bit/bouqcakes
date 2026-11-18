"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";

const NAV_LINKS = [
  { index: "01", label: "Concept", href: "#artistry" },
  { index: "02", label: "Collection", href: "#creations" },
  { index: "03", label: "Occasions", href: "#gifting" },
  { index: "04", label: "Experience", href: "#atelier" },
  { index: "05", label: "Custom", href: "#custom-gifting" },
];

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const next = window.scrollY > 24;
      setScrolled((prev) => (prev === next ? prev : next));
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll & handle Escape key when mobile drawer is open
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const handleSmoothScroll = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (href === "#") {
        e.preventDefault();
        setMobileMenuOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (href.startsWith("#")) {
        const target = document.getElementById(href.slice(1));
        if (target) {
          e.preventDefault();
          setMobileMenuOpen(false);
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    },
    []
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled || mobileMenuOpen
            ? "bg-[#F5EEE5]/96 md:bg-[#F5EEE5]/92 md:backdrop-blur-sm border-b border-[#D9B9B2]/65 py-3"
            : "bg-[#F5EEE5]/90 md:bg-[#F5EEE5]/75 md:backdrop-blur-sm border-b border-transparent py-3.5 md:py-4"
        }`}
      >
        <div className="editorial-container grid grid-cols-2 lg:grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* Left: Brand Wordmark */}
          <div className="flex items-center justify-start">
            <a
              href="#"
              onClick={(e) => handleSmoothScroll(e, "#")}
              aria-label="BOUQCAKES Home"
              className="group inline-flex flex-col items-start"
            >
              <span className="font-serif text-xl sm:text-2xl md:text-[1.7rem] font-normal tracking-[0.26em] text-[#292321] transition-colors duration-300 group-hover:text-[#8F1728] uppercase leading-none">
                Bouqcakes
              </span>
              <span className="font-sans text-[8.5px] sm:text-[9px] tracking-[0.32em] text-[#8F1728] uppercase mt-1">
                Dubai
              </span>
            </a>
          </div>

          {/* Center: Desktop Editorial Navigation */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center justify-center gap-8"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#292321] hover:text-[#8F1728] transition-colors duration-200 relative group py-1"
              >
                <span>{link.label}</span>
                <span
                  className="absolute bottom-0 left-0 w-0 h-px bg-[#8F1728] transition-all duration-300 group-hover:w-full"
                  aria-hidden="true"
                />
              </a>
            ))}
          </nav>

          {/* Right: Desktop CTA / Mobile Trigger */}
          <div className="flex items-center justify-end gap-3">
            <a
              href="#inquire"
              onClick={(e) => handleSmoothScroll(e, "#inquire")}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8F1728] text-[#F5EEE5] border border-[#8F1728] font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.22em] transition-colors duration-300 hover:bg-[#481923] hover:border-[#481923] group"
            >
              <span>Inquire</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              className="lg:hidden p-2 -mr-2 text-[#292321] hover:text-[#8F1728] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Editorial Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: EDITORIAL_EASE }}
            className="fixed inset-0 z-40 bg-[#F5EEE5] pt-24 pb-10 px-6 sm:px-10 flex flex-col justify-between overflow-y-auto lg:hidden"
          >
            <div className="flex flex-col mt-6">
              <span className="font-sans text-[10px] tracking-[0.28em] uppercase text-[#8F1728] mb-6">
                Directory
              </span>
              <nav
                aria-label="Mobile navigation links"
                className="border-t border-[#D9B9B2]/65"
              >
                {NAV_LINKS.map((link, idx) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.05 * idx,
                      duration: 0.4,
                      ease: EDITORIAL_EASE,
                    }}
                    className="border-b border-[#D9B9B2]/65"
                  >
                    <a
                      href={link.href}
                      onClick={(e) => handleSmoothScroll(e, link.href)}
                      className="py-4 flex items-baseline justify-between gap-4 group"
                    >
                      <div className="flex items-baseline gap-4">
                        <span className="font-sans text-[10px] tracking-[0.22em] text-[#8F1728]">
                          {link.index}
                        </span>
                        <span className="font-serif text-3xl text-[#292321] group-hover:text-[#8F1728] transition-colors">
                          {link.label}
                        </span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-[#7C6D68] group-hover:text-[#8F1728] transition-colors" />
                    </a>
                  </motion.div>
                ))}
              </nav>
            </div>

            <div className="pt-8 mt-8 border-t border-[#D9B9B2]/65 flex flex-col gap-5">
              <a
                href="#inquire"
                onClick={(e) => handleSmoothScroll(e, "#inquire")}
                className="w-full inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full bg-[#8F1728] text-[#F5EEE5] font-sans text-xs uppercase tracking-[0.24em] hover:bg-[#481923] transition-colors"
              >
                <span>Inquire</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <div className="flex items-center justify-between text-[10px] font-sans uppercase tracking-[0.22em] text-[#5E514D]">
                <span>Dubai Silicon Oasis</span>
                <a href="tel:+971502654257" className="hover:text-[#8F1728]">
                  +971 50 265 4257
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
