"use client";

import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";

type ReducedMotion = "user" | "always" | "never";

interface MotionProviderProps {
  children: React.ReactNode;
  reducedMotion?: ReducedMotion;
}

export function MotionProvider({
  children,
  reducedMotion = "user",
}: MotionProviderProps) {
  return (
    <MotionConfig reducedMotion={reducedMotion}>
      <LazyMotion features={domAnimation}>{children}</LazyMotion>
    </MotionConfig>
  );
}
