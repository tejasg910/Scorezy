"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  // Smooth springs for the ring
  const ringX = useSpring(0, { stiffness: 150, damping: 20 });
  const ringY = useSpring(0, { stiffness: 150, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      ringX.set(e.clientX - 18); // 18 is half of 36px width
      ringY.set(e.clientY - 18);

      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === "pointer" ||
          target.tagName === "A" ||
          target.tagName === "BUTTON"
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [ringX, ringY]);

  return (
    <>
      {/* Central Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-[#b18aff] rounded-full pointer-events-none z-[9999] mix-blend-screen"
        animate={{
          x: mousePos.x - 5,
          y: mousePos.y - 5,
          scale: isPointer ? 1.5 : 1,
        }}
        transition={{ type: "tween", ease: "linear", duration: 0 }}
      />

      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-9 h-9 border border-[#b18aff]/50 rounded-full pointer-events-none z-[9998]"
        style={{
          x: ringX,
          y: ringY,
        }}
        animate={{
          scale: isPointer ? 1.5 : 1,
          borderWidth: isPointer ? "2px" : "1.5px",
        }}
      />
    </>
  );
}
