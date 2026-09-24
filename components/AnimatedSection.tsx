"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  duration?: number;
}

const offsetForDirection = (
  direction: AnimatedSectionProps["direction"],
  visible: boolean
): string => {
  if (visible) return "translate3d(0, 0, 0)";
  switch (direction) {
    case "left":
      return "translate3d(-50px, 0, 0)";
    case "right":
      return "translate3d(50px, 0, 0)";
    case "up":
      return "translate3d(0, -50px, 0)";
    case "down":
    default:
      return "translate3d(0, 50px, 0)";
  }
};

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  direction,
  delay = 0,
  duration = 0.75,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-100px", threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: offsetForDirection(direction, visible),
        transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
        willChange: visible ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
