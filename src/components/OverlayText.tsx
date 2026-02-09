"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface OverlayTextProps {
    text: string;
    start: number; // 0 to 1 (scroll progress)
    end: number;   // 0 to 1
    scrollProgress: any; // MotionValue passed from parent or context
}

export default function OverlayText({ text, start, end, scrollProgress }: OverlayTextProps) {
    const opacity = useTransform(
        scrollProgress,
        [start, start + 0.05, end - 0.05, end],
        [0, 1, 1, 0]
    );

    const y = useTransform(
        scrollProgress,
        [start, start + 0.05, end - 0.05, end],
        [50, 0, 0, -50]
    );

    return (
        <motion.div
            style={{ opacity, y }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full px-4 z-20 pointer-events-none"
        >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif italic text-white drop-shadow-md mix-blend-difference text-center leading-snug tracking-wide">
                {text}
            </h2>
        </motion.div>
    );
}
