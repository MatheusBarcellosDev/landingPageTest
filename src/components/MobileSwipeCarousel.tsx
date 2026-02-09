"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SceneText {
    content: string;
    start: number;
    end: number;
}

interface MobileSwipeSceneProps {
    scenes: {
        videoSrc: string;
        texts: SceneText[];
    }[];
    onComplete?: () => void;
}

export default function MobileSwipeCarousel({ scenes, onComplete }: MobileSwipeSceneProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [showText, setShowText] = useState(true);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    // Detect which scene is in view using IntersectionObserver
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = parseInt(entry.target.getAttribute("data-index") || "0");
                        setActiveIndex(index);

                        // Play this video, pause others
                        videoRefs.current.forEach((video, i) => {
                            if (video) {
                                if (i === index) {
                                    video.currentTime = 0;
                                    video.play().catch(console.log);
                                } else {
                                    video.pause();
                                }
                            }
                        });

                        // Show text briefly then fade
                        setShowText(true);
                        setTimeout(() => setShowText(false), 3000);

                        // Check if last scene
                        if (index === scenes.length - 1 && onComplete) {
                            setTimeout(onComplete, 2000);
                        }
                    }
                });
            },
            { threshold: 0.6 }
        );

        const sceneElements = container.querySelectorAll(".snap-scene");
        sceneElements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [scenes.length, onComplete]);

    return (
        <div
            ref={containerRef}
            className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory"
            style={{ scrollSnapType: "y mandatory" }}
        >
            {scenes.map((scene, idx) => (
                <div
                    key={idx}
                    data-index={idx}
                    className="snap-scene h-screen w-screen snap-start snap-always relative flex items-center justify-center bg-black overflow-hidden"
                >
                    {/* Video Background */}
                    <video
                        ref={(el) => { videoRefs.current[idx] = el; }}
                        className="absolute inset-0 w-full h-full object-cover"
                        src={scene.videoSrc}
                        playsInline
                        muted
                        loop
                        preload="auto"
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

                    {/* Text Overlay */}
                    <AnimatePresence>
                        {activeIndex === idx && showText && scene.texts[0] && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="absolute inset-0 flex items-center justify-center z-20 px-8"
                            >
                                <h2 className="text-2xl md:text-4xl font-serif text-white text-center leading-relaxed tracking-wide">
                                    {scene.texts[0].content}
                                </h2>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Progress Dots */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                        {scenes.map((_, i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeIndex
                                        ? "bg-white w-6"
                                        : i < activeIndex
                                            ? "bg-white/60"
                                            : "bg-white/30"
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Swipe Indicator (first scene only) */}
                    {idx === 0 && activeIndex === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 z-30"
                        >
                            <span className="text-[10px] uppercase tracking-[0.2em]">Deslize para cima</span>
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M12 19V5M5 12l7-7 7 7" />
                                </svg>
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            ))}

            {/* Final CTA Section */}
            <div
                data-index={scenes.length}
                className="snap-scene h-screen w-screen snap-start snap-always relative flex items-center justify-center bg-black"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-center px-8"
                >
                    <h2 className="text-3xl font-serif text-white mb-4">Pronto para Conhecer?</h2>
                    <p className="text-white/60 text-sm mb-8">Entre em contato e agende sua visita</p>
                    <button className="px-8 py-3 bg-white text-black font-sans text-sm uppercase tracking-widest hover:bg-white/90 transition-colors">
                        Agendar Visita
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
