"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// Imagens placeholder (URLs reais devem ser substituídas)
const photos = [
    "https://images.unsplash.com/photo-1600596542815-2495db98dada?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1600566753086-00f18cf6b3ea?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000",
];

export default function GalleryModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl overflow-y-auto"
                >
                    <div className="absolute top-4 right-4 z-50">
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-300 transition-colors p-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>

                    <div className="container mx-auto px-4 py-20">
                        <h2 className="text-4xl md:text-5xl font-serif italic text-white mb-12 text-center">
                            Detalhes do Imóvel
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {photos.map((src, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="aspect-[4/3] bg-gray-800 overflow-hidden cursor-pointer rounded-sm"
                                    onClick={() => setSelectedPhoto(src)}
                                >
                                    <img src={src} alt={`Detalhe ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-20 text-center">
                            <p className="text-gray-400 mb-6">Gostou do que viu?</p>
                            <button onClick={onClose} className="px-8 py-4 border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 tracking-widest uppercase text-sm">
                                Voltar para Reserva
                            </button>
                        </div>
                    </div>

                    {/* Zoom Modal (simples) */}
                    <AnimatePresence>
                        {selectedPhoto && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center p-4"
                                onClick={() => setSelectedPhoto(null)}
                            >
                                <img src={selectedPhoto} className="max-w-full max-h-[90vh] shadow-2xl" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                </motion.div>
            )}
        </AnimatePresence>
    );
}
