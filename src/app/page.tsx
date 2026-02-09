"use client";

import ScrollVideoScene from "@/components/ScrollVideoScene";
import MobileSwipeCarousel from "@/components/MobileSwipeCarousel";

const scenes = [
  {
    videoSrc: "/videos/scene1.mp4",
    texts: [
      { content: "O Respiro que Você Merece.", start: 0.05, end: 0.25 },
      { content: "Conexão Pura com o Essencial.", start: 0.40, end: 0.55 },
      { content: "Seu Refúgio Particular.", start: 0.65, end: 0.80 },
    ],
  },
  {
    videoSrc: "/videos/scene2.mp4",
    texts: [
      { content: "Arquitetura que Acolhe.", start: 0.15, end: 0.30 },
      { content: "A Harmonia da Luz Natural.", start: 0.40, end: 0.55 },
      { content: "Bem-estar em Cada Passo.", start: 0.65, end: 0.80 },
    ],
  },
  {
    videoSrc: "/videos/scene3.mp4",
    texts: [
      { content: "Conforto em Sua Máxima Expressão.", start: 0.15, end: 0.30 },
      { content: "Viva Momentos de Paz.", start: 0.40, end: 0.55 },
      { content: "Um Espaço para Celebrar a Vida.", start: 0.65, end: 0.80 },
    ],
  },
  {
    videoSrc: "/videos/scene4.mp4",
    texts: [
      { content: "Cozinha Gourmet Completa.", start: 0.15, end: 0.30 },
      { content: "Equipada com o Melhor para Você.", start: 0.40, end: 0.55 },
      { content: "Liberte Seu Chef Interior.", start: 0.65, end: 0.80 },
    ],
  },
  {
    videoSrc: "/videos/scene5.mp4",
    texts: [
      { content: "Seu Santuário de Paz.", start: 0.15, end: 0.30 },
      { content: "O Silêncio que Renova.", start: 0.40, end: 0.55 },
      { content: "Aconchego em Cada Amanhecer.", start: 0.65, end: 0.80 },
    ],
  },
  {
    videoSrc: "/videos/scene6.mp4",
    texts: [
      { content: "Seu Spa Particular.", start: 0.15, end: 0.30 },
      { content: "Relaxe. Respire. Renove.", start: 0.40, end: 0.55 },
      { content: "O Banho Perfeito.", start: 0.65, end: 0.80 },
    ],
  },
];

import { useState, useRef, useEffect } from "react";
import ContactCard from "@/components/ContactCard";
import GalleryModal from "@/components/GalleryModal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Home() {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isContactVisible, setIsContactVisible] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean | null>(null); // null = loading
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Mobile detection
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Desktop ScrollTrigger for contact card
  useEffect(() => {
    if (isMobile || !footerRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: footerRef.current,
      start: "top bottom-=100",
      onEnter: () => setIsContactVisible(true),
      onLeaveBack: () => setIsContactVisible(false),
    });

    return () => trigger.kill();
  }, [isMobile]);

  // Loading state - avoid flash
  if (isMobile === null) {
    return <div className="h-screen w-screen bg-black" />;
  }

  // MOBILE: Swipe Carousel Experience
  if (isMobile) {
    return (
      <main className="bg-black">
        <MobileSwipeCarousel
          scenes={scenes}
          onComplete={() => setIsContactVisible(true)}
        />
        <ContactCard isVisible={isContactVisible} onOpenGallery={() => setIsGalleryOpen(true)} />
        <GalleryModal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} />
      </main>
    );
  }

  // DESKTOP: Scroll-driven Video Experience
  return (
    <main className="relative bg-black min-h-screen">
      {scenes.map((scene, idx) => (
        <div key={idx} className={idx > 0 ? "-mt-[30vh]" : ""}>
          <ScrollVideoScene
            videoSrc={scene.videoSrc}
            texts={scene.texts}
            sceneIndex={idx}
            totalScenes={scenes.length}
          />
        </div>
      ))}

      {/* Footer trigger for contact card */}
      <div ref={footerRef} className="h-[50vh] bg-black flex items-end justify-center pb-20 pointer-events-none">
        <p className="text-white/20 text-xs tracking-[0.5em] font-sans uppercase">EXPERIÊNCIA IMERSIVA</p>
      </div>

      <ContactCard isVisible={isContactVisible} onOpenGallery={() => setIsGalleryOpen(true)} />
      <GalleryModal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} />
    </main>
  );
}


