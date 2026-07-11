"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { m, useReducedMotion, useInView } from "framer-motion";
import type { Variants } from "framer-motion";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
  amount?: number;
  y?: number;
}

const variants: Variants = {
  hidden: (custom: { y: number }) => ({
    opacity: 0,
    y: custom.y,
    filter: "blur(3px)",
  }),
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 26,
      mass: 0.8,
    },
  },
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  once = true,
  amount = 0.15,
  y = 16,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount, once });

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      ref={ref}
      custom={{ y }}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 26,
        mass: 0.8,
        delay,
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}
