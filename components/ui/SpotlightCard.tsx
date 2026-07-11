"use client";

import { useEffect, useRef } from "react";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  size?: number; // Base size of the main blob
  opacity?: number;
  removeBlob?: boolean;
}

interface MetaballPoint {
  x: number;
  y: number;
  radius: number;
  elRef: React.RefObject<HTMLDivElement | null>;
}

export function SpotlightCard({
  children,
  className = "",
  size = 140,
  opacity = 0.85,
  removeBlob = false,
}: SpotlightCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track cursor target relative to container
  const cursorRef = useRef({ x: -9999, y: -9999, active: false });
  const rafRef = useRef<number>(0);

  // Initialize 5 trailing points with decreasing radii for the gooey trail
  const pointsRef = useRef<MetaballPoint[]>([
    { x: 0, y: 0, radius: size * 0.5, elRef: useRef<HTMLDivElement>(null) },
    { x: 0, y: 0, radius: size * 0.44, elRef: useRef<HTMLDivElement>(null) },
    { x: 0, y: 0, radius: size * 0.38, elRef: useRef<HTMLDivElement>(null) },
    { x: 0, y: 0, radius: size * 0.32, elRef: useRef<HTMLDivElement>(null) },
    { x: 0, y: 0, radius: size * 0.25, elRef: useRef<HTMLDivElement>(null) },
  ]);

  useEffect(() => {
    let time = 0;

    function tick() {
      time += 0.05;
      const points = pointsRef.current;
      const target = cursorRef.current;
      const container = containerRef.current;

      if (!container) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      // If cursor hasn't entered, hide offscreen
      if (!target.active) {
        points.forEach((p) => {
          p.x = -9999;
          p.y = -9999;
          if (p.elRef.current) {
            p.elRef.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
          }
        });
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      // 1. Physics: Leader (points[0]) follows the cursor
      points[0].x += (target.x - points[0].x) * 0.16;
      points[0].y += (target.y - points[0].y) * 0.16;

      // 2. Physics: Trailing points follow the point ahead of them
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        curr.x += (prev.x - curr.x) * 0.24;
        curr.y += (prev.y - curr.y) * 0.24;
      }

      // 3. Collision Avoidance against the Search Bar
      const obstacle = document.querySelector(".relative.group"); // Search bar wrapper
      if (obstacle) {
        const rect = obstacle.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Convert search bar boundary coordinates relative to our card container
        const ox = rect.left - containerRect.left;
        const oy = rect.top - containerRect.top;
        const ow = rect.width;
        const oh = rect.height;

        // Apply circle-vs-box collision push for each point individually
        points.forEach((p) => {
          const cx = Math.max(ox, Math.min(p.x, ox + ow));
          const cy = Math.max(oy, Math.min(p.y, oy + oh));

          const dx = p.x - cx;
          const dy = p.y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // If overlapping the box, push the point out
          if (dist < p.radius) {
            if (dist === 0) {
              p.y = oy - p.radius; // Failsafe push upward
            } else {
              const push = p.radius - dist;
              p.x += (dx / dist) * push;
              p.y += (dy / dist) * push;
            }
          }
        });
      }

      // 4. Render points with wobbly jelly border-radius and translate
      points.forEach((p, idx) => {
        const el = p.elRef.current;
        if (!el) return;

        // Organic wobble calculation
        const offset = idx * 0.8;
        const wobble = Math.sin(time + offset) * 6;
        const br1 = 50 + Math.sin(time + offset) * 7;
        const br2 = 50 + Math.cos(time + offset) * 7;

        el.style.transform = `translate3d(calc(${p.x}px - 50%), calc(${p.y}px - 50%), 0) scale(${1 + wobble * 0.005})`;
        el.style.borderRadius = `${br1}% ${100 - br1}% ${br2}% ${100 - br2}% / ${br2}% ${br1}% ${100 - br1}% ${100 - br2}%`;
      });

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [size]);

  // Pointer event listeners to set coordinates
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    cursorRef.current.x = e.clientX - rect.left;
    cursorRef.current.y = e.clientY - rect.top;
    cursorRef.current.active = true;
  };

  const handlePointerLeave = () => {
    cursorRef.current.active = false;
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={removeBlob ? undefined : handlePointerMove}
      onPointerEnter={removeBlob ? undefined : handlePointerMove}
      onPointerLeave={removeBlob ? undefined : handlePointerLeave}
      className={`relative overflow-hidden ${className}`}
    >
      {!removeBlob && (
        <>
          {/* 1. Liquid Gooey Container */}
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              filter: "url(#goo)",
              opacity,
              mixBlendMode: "difference",
            }}
          >
            {pointsRef.current.map((p, idx) => (
              <div
                key={idx}
                ref={p.elRef as any}
                className="absolute bg-white pointer-events-none"
                style={{
                  width: `${p.radius * 2}px`,
                  height: `${p.radius * 2}px`,
                  left: 0,
                  top: 0,
                  filter: "blur(4px)",
                }}
              />
            ))}
          </div>

          {/* 2. Hidden SVG Gooey Filter */}
          <svg
            style={{
              position: "absolute",
              width: "1px",
              height: "1px",
              left: "-9999px",
              top: "-9999px",
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            <defs>
              <filter id="goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 28 -10"
                  result="goo"
                />
                <feBlend in="SourceGraphic" in2="goo" />
              </filter>
            </defs>
          </svg>
        </>
      )}

      {/* 3. Content */}
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
