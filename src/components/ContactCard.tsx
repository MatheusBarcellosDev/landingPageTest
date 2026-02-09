"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function ContactCard({ onOpenGallery, isVisible }: { onOpenGallery: () => void; isVisible: boolean }) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20, x: "-50%" }}
                    animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
                    exit={{ opacity: 0, scale: 0.9, y: 20, x: "-50%" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="fixed top-1/2 left-1/2 z-[60] w-[90%] max-w-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-12 shadow-2xl rounded-sm"
                >
                    <div className="space-y-8 text-white text-center">
                        <div>
                            <h3 className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-gray-400 mb-4 font-sans">Interessado?</h3>
                            <p className="text-3xl md:text-5xl font-serif italic leading-tight">Agende sua visita exclusiva.</p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <button className="px-8 py-4 bg-white text-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors min-w-[200px]">
                                Falar no WhatsApp
                            </button>

                            <button
                                onClick={onOpenGallery}
                                className="px-8 py-4 bg-transparent border border-white/30 text-white text-sm uppercase tracking-widest hover:bg-white/10 transition-colors min-w-[200px]"
                            >
                                Ver Galeria
                            </button>
                        </div>
                        <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs text-gray-400">
                            <span>Disponível para Temporada</span>
                            <span>★ 5.0 (12 Avaliações)</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
