"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionValue } from "framer-motion";
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
            scrub: true,
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
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 animate-pulse pointer-events-none z-30">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-sans">Role para explorar</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
                            <path d="M12 5v14M19 12l-7 7-7-7" />
                        </svg>
                    </div>
                )}
            </div>
        </>
    );
}
