"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AudioController() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        // Tenta autoplay ao carregar (muitas vezes falha sem interação, mas vale tentar)
        const attemptPlay = async () => {
            if (audioRef.current) {
                try {
                    audioRef.current.volume = 0.5; // Começa com volume médio
                    await audioRef.current.play();
                    setIsPlaying(true);
                    setIsMuted(false); // Se conseguiu tocar, desmuta
                } catch (err) {
                    console.log("Autoplay blocked, waiting for user interaction", err);
                    setIsMuted(true); // Se falhou, garante que tá mudo visualmente
                }
            }
        };



        attemptPlay();

        const handleInteraction = () => {
            if (audioRef.current) {
                // Tenta tocar se estiver pausado OU mudo
                if (audioRef.current.paused || isMuted) {
                    audioRef.current.play()
                        .then(() => {
                            setIsPlaying(true);
                            setIsMuted(false);
                            // Sucesso! Remove listeners
                            window.removeEventListener('click', handleInteraction);
                            window.removeEventListener('touchstart', handleInteraction);
                            window.removeEventListener('keydown', handleInteraction);
                        })
                        .catch(e => {
                            // Falhou (browser bloqueou). Deixa listeners ativos para próxima tentativa.
                            console.log("Audio unlock failed, waiting for next interaction");
                        });
                }
            }
        };

        window.addEventListener('click', handleInteraction);
        window.addEventListener('touchstart', handleInteraction);
        window.addEventListener('keydown', handleInteraction);

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, []);

    const toggleMute = () => {
        if (audioRef.current) {
            if (isMuted) {
                audioRef.current.muted = false;
                audioRef.current.play();
                setIsMuted(false);
                setIsPlaying(true);
            } else {
                audioRef.current.muted = true;
                setIsMuted(true);
            }
        }
    };

    return (
        <div className="fixed top-24 right-8 z-[60]">
            <audio ref={audioRef} src="/audio/ambient.mp3" loop />

            <button
                onClick={toggleMute}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors uppercase text-[10px] tracking-widest group"
            >
                {isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                        <path d="M9 9v6a3 3 0 0 0 5.12 2.12M15 9.34V4h5v5h-5"></path>
                    </svg>
                ) : (
                    <div className="flex items-end gap-[2px] h-4 pb-1">
                        <motion.div
                            animate={{ height: [4, 12, 6, 14, 4] }}
                            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                            className="w-[2px] bg-white"
                        />
                        <motion.div
                            animate={{ height: [10, 5, 14, 8, 10] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            className="w-[2px] bg-white"
                        />
                        <motion.div
                            animate={{ height: [6, 14, 8, 4, 6] }}
                            transition={{ repeat: Infinity, duration: 1.0, ease: "linear" }}
                            className="w-[2px] bg-white"
                        />
                    </div>
                )}
            </button>
        </div>
    );
}
