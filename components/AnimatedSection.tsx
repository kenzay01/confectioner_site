"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  duration?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  direction,
  delay,
  duration = 0.75,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const getInitialPosition = () => {
    switch (direction) {
      case "left":
        return { opacity: 0, x: -50 };
      case "right":
        return { opacity: 0, x: 50 };
      case "up":
        return { opacity: 0, y: -50 };
      case "down":
        return { opacity: 0, y: 50 };
      default:
        return { opacity: 0, y: 50 };
    }
  };
  const getAnimation = () => {
    return isInView ? { opacity: 1, x: 0, y: 0 } : getInitialPosition();
  };
  const getTransition = () => {
    return { duration, delay: delay || 0 };
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitialPosition()}
      animate={getAnimation()}
      transition={getTransition()}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
