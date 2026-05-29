import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function TiltCard({ children, className = "", onClick }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Initialize mouse motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics configs for realistic floating & rapid response
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), springConfig);

  // Transform depth effect on inner child elements (layering)
  const translateZ = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const el = cardRef.current;
    const rect = el.getBoundingClientRect();
    
    // Relative coordinates between -0.5 and +0.5
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    x.set(relX);
    y.set(relY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX: rotateX,
        rotateY: rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`glass-card-interactive bg-glass-bg border border-glass-border backdrop-blur-xl rounded-2xl transition-shadow duration-300 relative overflow-hidden select-none cursor-pointer ${
        isHovered ? "shadow-[0_20px_40px_rgba(0,229,204,0.12)] border-accent-teal/40" : "shadow-md"
      } ${className}`}
    >
      {/* 3D Reflection Glare Overlay */}
      <motion.div
        style={{
          transform: "translateZ(10px)",
          opacity: isHovered ? 0.08 : 0,
        }}
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent pointer-events-none transition-opacity duration-300 z-10"
      />

      {/* Cybernetic ambient hover spot light */}
      <motion.div
        style={{
          x: useTransform(x, [-0.5, 0.5], ["-30%", "30%"]),
          y: useTransform(y, [-0.5, 0.5], ["-30%", "30%"]),
          opacity: isHovered ? 0.15 : 0,
        }}
        className="absolute inset-0 bg-radial-[circle_at_center,rgba(0,229,204,0.4)_0%,transparent_70%] pointer-events-none transition-opacity duration-300 -z-10"
      />

      {/* Main card content, nested inside card depth preservation */}
      <div 
        style={{ 
          transform: "translateZ(20px)",
          transformStyle: "preserve-3d"
        }}
        className="relative z-20 h-full w-full flex flex-col justify-between"
      >
        {children}
      </div>
    </motion.div>
  );
}
