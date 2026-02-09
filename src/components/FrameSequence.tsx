"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionValue, motion } from "framer-motion";
import OverlayText from "./OverlayText";

gsap.registerPlugin(ScrollTrigger);

interface SceneText {
    content: string;
    start: number;
    end: number;
}

interface FrameSequenceProps {
    frameFolder: string; // e.g., "/frames/entrada"
    frameCount: number; // e.g., 73
    texts: SceneText[];
    sceneIndex: number;
}

export default function FrameSequence({ frameFolder, frameCount, texts, sceneIndex }: FrameSequenceProps) {
    const spacerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const scrollProgress = useMotionValue(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const imagesRef = useRef<HTMLImageElement[]>([]);

    // Generate frame URLs
    const frameUrls = useMemo(() => {
        return Array.from({ length: frameCount }, (_, i) => {
            const frameNumber = String(i + 1).padStart(4, '0');
            return `${frameFolder}/frame_${frameNumber}.webp`;
        });
    }, [frameFolder, frameCount]);

    // Preload all images
    useEffect(() => {
        const images: HTMLImageElement[] = [];
        let loadedCount = 0;

        frameUrls.forEach((url, index) => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === frameCount) {
                    setIsLoaded(true);
                }
            };
            img.onerror = () => {
                console.error(`Failed to load frame: ${url}`);
                loadedCount++;
            };
            images[index] = img;
        });

        imagesRef.current = images;
    }, [frameUrls, frameCount]);

    // Draw frame to canvas based on scroll
    useEffect(() => {
        const canvas = canvasRef.current;
        const spacer = spacerRef.current;
        const container = containerRef.current;

        if (!canvas || !spacer || !container || !isLoaded) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // Draw first frame
        if (imagesRef.current[0]) {
            ctx.drawImage(imagesRef.current[0], 0, 0, canvas.width, canvas.height);
        }

        // Initial State
        gsap.set(container, {
            opacity: sceneIndex === 0 ? 1 : 0,
            zIndex: sceneIndex
        });

        // ScrollTrigger
        const trigger = ScrollTrigger.create({
            trigger: spacer,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => {
                // Calculate which frame to show
                const frameIndex = Math.min(
                    Math.floor(self.progress * frameCount),
                    frameCount - 1
                );

                // Draw the frame
                const img = imagesRef.current[frameIndex];
                if (img && ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                }

                scrollProgress.set(self.progress);

                // Fade logic for non-first scenes
                if (sceneIndex > 0) {
                    const fadeWindow = 0.2;
                    let opacity = self.progress < fadeWindow
                        ? self.progress / fadeWindow
                        : 1;
                    container.style.opacity = opacity.toString();
                }
            },
        });

        return () => {
            trigger.kill();
            window.removeEventListener("resize", resizeCanvas);
        };
    }, [isLoaded, frameCount, sceneIndex]);

    return (
        <>
            {/* SPACER */}
            <div ref={spacerRef} className="relative w-full h-[200vh] pointer-events-none" />

            {/* FIXED LAYER */}
            <div
                ref={containerRef}
                className="fixed inset-0 w-full h-full bg-black flex items-center justify-center overflow-hidden"
                style={{ zIndex: 10 + sceneIndex }}
            >
                {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white z-50">
                        Carregando...
                    </div>
                )}

                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20" />

                {/* Texts */}
                {texts.map((text, idx) => (
                    <OverlayText
                        key={idx}
                        text={text.content}
                        start={text.start}
                        end={text.end}
                        scrollProgress={scrollProgress}
                    />
                ))}

                {/* Scroll Indicator (Only for first scene) */}
                {sceneIndex === 0 && (
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 pointer-events-none z-30">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-sans mb-1">Role para explorar</span>

                        {/* Mobile Finger/Swipe Indicator */}
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <motion.div
                                animate={{ y: [10, -10], opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/70">
                                    <path d="M12 19V5M5 12l7-7 7 7" />
                                </svg>
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
