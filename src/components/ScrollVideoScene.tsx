"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionValue, motion } from "framer-motion";
import OverlayText from "./OverlayText";

gsap.registerPlugin(ScrollTrigger);

interface SceneText {
    content: string;
    start: number; // 0-1 relative to scene duration
    end: number;
}

interface ScrollVideoSceneProps {
    videoSrc: string;
    texts: SceneText[];
    sceneIndex: number;
    totalScenes: number;
}

export default function ScrollVideoScene({ videoSrc, texts, sceneIndex, totalScenes }: ScrollVideoSceneProps) {
    const spacerRef = useRef<HTMLDivElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const scrollProgress = useMotionValue(0);
    const [isVideoReady, setIsVideoReady] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        const spacer = spacerRef.current;
        const videoContainer = videoContainerRef.current;

        if (!video || !spacer || !videoContainer) return;

        // Load metadata
        const onLoadedMetadata = () => {
            setIsVideoReady(true);
        };
        video.addEventListener('loadedmetadata', onLoadedMetadata);
        if (video.readyState >= 1) setIsVideoReady(true);

        // Initial State
        // Cena 1 começa visível. Outras invisíveis.
        gsap.set(videoContainer, {
            opacity: sceneIndex === 0 ? 1 : 0,
            zIndex: sceneIndex
        });

        // SCROLL TRIGGER PRINCIPAL
        // O "spacer" define o tempo da cena na tela.
        const trigger = ScrollTrigger.create({
            trigger: spacer,
            start: "top bottom", // Começa quando o topo do spacer entra por baixo
            end: "bottom bottom", // Termina quando o fundo do spacer toca o fundo
            scrub: 1.5,
            onUpdate: (self) => {
                // 1. VIDEO SCRUBBING
                // O video roda durante todo o percurso (entrada + permanência)
                if (video.duration && Number.isFinite(video.duration)) {
                    // Ajuste: Queremos que o vídeo toque enquanto a cena é a "Principal".
                    // Mas com fixed layers, podemos tocar sempre.
                    video.currentTime = video.duration * self.progress;
                }

                scrollProgress.set(self.progress);

                // 2. FADE LOGIC (CINEMATIC CROSS-DISSOLVE)
                // Se não for a primeira cena, calcula o Fade In
                if (sceneIndex > 0) {
                    // Fade-in progressivo durante a "entrada" da cena
                    // Definimos uma janela de transição. Ex: primeiros 20% do scroll.
                    const fadeWindow = 0.2;
                    let opacity = 0;

                    if (self.progress < fadeWindow) {
                        // Entrada (0 -> 1)
                        opacity = self.progress / fadeWindow;
                    } else {
                        // Mantém visível após a entrada
                        opacity = 1;
                    }

                    // Suavização do fade (CSS transition handles micro-jitters, but GSAP set is better)
                    videoContainer.style.opacity = opacity.toString();
                }

                // Opcional: Fade Out no final? 
                // Não, a próxima cena vai cobrir (fade in) por cima desta.
                // Isso cria a "ligação" visual pedida. A cena antiga fica lá até ser coberta pela opacidade da nova.
            },
        });

        return () => {
            trigger.kill();
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
        };
    }, [videoSrc, sceneIndex]);

    return (
        <>
            {/* SPACER: Elemento invisível que dá altura ao scroll */}
            <div ref={spacerRef} className="relative w-full h-[200vh] pointer-events-none" />

            {/* LAYER FIXA: O conteúdo real que fica preso na tela */}
            <div
                ref={videoContainerRef}
                className="fixed inset-0 w-full h-full bg-black flex items-center justify-center overflow-hidden"
                style={{
                    zIndex: 10 + sceneIndex,
                    // Ocultar se não estiver "ativo" (otimização de GPU) pode ser feito, 
                    // mas para cross-fade suave deixamos o GSAP controlar opacity.
                }}
            >
                {!isVideoReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white z-50">
                        Loading...
                    </div>
                )}

                <video
                    ref={videoRef}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    src={videoSrc}
                    playsInline
                    muted
                    preload="auto"
                />

                {/* Overlay sutil para texto */}
                <div className="absolute inset-0 bg-black/20" />

                {/* Textos */}
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
                        <span className="text-[10px] uppercase tracking-[0.2em] font-sans mb-1 md:mb-0">Role para explorar</span>

                        {/* Desktop Arrow */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="hidden md:block animate-bounce">
                            <path d="M12 5v14M19 12l-7 7-7-7" />
                        </svg>

                        {/* Mobile Finger/Swipe Indicator */}
                        <div className="md:hidden relative w-10 h-10 flex items-center justify-center">
                            <motion.div
                                animate={{ y: [10, -10], opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-white/70 rotate-180">
                                    <path d="M9 13v-2.37a2.5 2.5 0 0 1 2.5-2.5h0a2.5 2.5 0 0 1 2.5 2.5V13a6.83 6.83 0 0 1-2.9 5.86l-2.02 1.34a.97.97 0 0 1-1.35-.26l-.42-.64a1 1 0 0 1 .15-1.2l1.9-2.1H9zm-2-2.37a4.5 4.5 0 0 1 4.5-4.5h0a4.5 4.5 0 0 1 4.5 4.5V13a4.5 4.5 0 0 1-4.5 4.5V10.63H11v2.37z" />
                                    <path fillRule="evenodd" d="M12.9 2.2a1 1 0 0 1 1.4-1.4l5.3 5.3a1 1 0 0 1 0 1.4l-5.3 5.3a1 1 0 0 1-1.4-1.4l3.6-3.6H6a1 1 0 0 1 0-2h10.5l-3.6-3.6z" clipRule="evenodd" className="hidden" />
                                    {/* Simple hand pointing up (custom path approximation for generic "touch") */}
                                    <path d="M16.5 12V6.5a2.5 2.5 0 0 0-5 0V12h-2L9 20h6l1.5-8h-2z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                    <path d="M11.5 6.5a.5.5 0 0 0-1 0V12a.5.5 0 0 0 1 0V6.5z" fill="currentColor" />
                                </svg>
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
