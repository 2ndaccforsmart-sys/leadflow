"use client";

import type { RefObject } from "react";
import { useScroll, useTransform, type MotionValue } from "framer-motion";

interface UseScrollProgressOptions {
  target: RefObject<HTMLElement | null>;
  offset?: ["start end", "end start"] | ["start start", "end end"];
}

interface UseScrollProgressReturn {
  progress: MotionValue<number>;
}

export function useScrollProgress({
  target,
  offset = ["start end", "end start"],
}: UseScrollProgressOptions): UseScrollProgressReturn {
  const { scrollYProgress } = useScroll({ target, offset });
  return { progress: scrollYProgress };
}

export function useTransformRange(
  progress: MotionValue<number>,
  inputRange: [number, number],
  outputRange: [number, number]
): MotionValue<number> {
  return useTransform(progress, inputRange, outputRange);
}
