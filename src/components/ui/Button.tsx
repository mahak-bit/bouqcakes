"use client";

import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "editorial";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  children: React.ReactNode;
}

export function Button({
  href,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-sans tracking-widest uppercase transition-all duration-300 relative group overflow-hidden select-none cursor-pointer";

  const sizeStyles = {
    sm: "text-[11px] px-5 py-2.5 tracking-[0.2em] rounded-full",
    md: "text-xs px-7 py-3.5 tracking-[0.22em] rounded-full",
    lg: "text-xs md:text-sm px-9 py-4 tracking-[0.25em] rounded-full",
  };

  const variantStyles = {
    primary:
      "bg-[#8F1728] text-[#F5EEE5] hover:bg-[#481923] border border-[#8F1728] hover:border-[#481923]",
    secondary:
      "bg-transparent text-[#292321] border border-[#292321]/30 hover:border-[#8F1728] hover:bg-[#D9B9B2]/25 hover:text-[#8F1728]",
    editorial:
      "bg-[#481923] text-[#F5EEE5] hover:bg-[#8F1728] border border-[#481923] hover:border-[#8F1728]",
    ghost:
      "bg-transparent text-[#292321] hover:text-[#8F1728] px-0 py-1 rounded-none border-b border-transparent hover:border-[#8F1728]",
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      {icon && iconPosition === "left" && (
        <span className="mr-2.5 transition-transform duration-300 group-hover:-translate-x-0.5">
          {icon}
        </span>
      )}
      <span className="relative z-10">{children}</span>
      {icon && iconPosition === "right" && (
        <span className="ml-2.5 transition-transform duration-300 group-hover:translate-x-1">
          {icon}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {content}
    </button>
  );
}
