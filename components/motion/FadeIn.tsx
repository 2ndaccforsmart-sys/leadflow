"use client";

import type { ReactNode } from "react";
import { m, useReducedMotion } from "framer-motion";
import type { Variants, Transition } from "framer-motion";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  scale?: number;
  className?: string;
}

const transition: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 24,
  mass: 0.8,
};

const hidden: Variants = {
  hidden: (custom: { y: number; x: number; scale: number }) => ({
    opacity: 0,
    y: custom.y,
    x: custom.x,
    scale: custom.scale,
    filter: "blur(4px)",
  }),
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    transition,
  },
};

export function FadeIn({
  children,
  delay = 0,
  duration,
  y = 12,
  x = 0,
  scale = 1,
  className,
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      custom={{ y, x, scale }}
      variants={hidden}
      initial="hidden"
      animate="visible"
      transition={{ ...transition, delay, ...(duration ? { duration } : {}) }}
      className={className}
    >
      {children}
    </m.div>
  );
}

interface FadeInStaggerProps {
  children: ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
}

export function FadeInStagger({
  children,
  stagger = 0.06,
  delay = 0,
  className,
}: FadeInStaggerProps) {
  const prefersReducedMotion = useReducedMotion();

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : stagger,
        delayChildren: prefersReducedMotion ? 0 : delay,
      },
    },
  };

  return (
    <m.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </m.div>
  );
}

interface FadeInStaggerItemProps {
  children: ReactNode;
  className?: string;
}

const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 8,
    filter: "blur(2px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

export function FadeInStaggerItem({
  children,
  className,
}: FadeInStaggerItemProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div variants={staggerItem} className={className}>
      {children}
    </m.div>
  );
}
