import AmbientCanvas  from "@/components/shared/AmbientCanvas";
import CustomCursor   from "@/components/shared/CustomCursor";
import GlobalTexture  from "@/components/shared/GlobalTexture";
import GSAPConfig     from "@/components/shared/GSAPConfig";
import Navbar         from "@/components/layout/Navbar";
import Footer         from "@/components/layout/Footer";
import HeroSection    from "@/sections/HeroSection";

/*
 * Sections à implémenter (Phase suivante) :
 *   CraftSection     — "Our Craft" — les soins comme orfèvrerie
 *   GallerySection   — "Transformations" — before/after scrubbed
 *   TrustSection     — "Our Signature" — stats + avis
 *   ContactSection   — "Begin Your Journey"
 */

export default function Home() {
  return (
    <>
      {/* Global atmospheric layers — fixed, derrière tout */}
      <AmbientCanvas />
      <GlobalTexture />
      <CustomCursor />

      {/* Navbar hors du <main> → root stacking context → iOS safe */}
      <Navbar />

      <main style={{ position: "relative", zIndex: 1 }}>
        {/* GSAPConfig en premier enfant — config avant les ScrollTriggers */}
        <GSAPConfig />

        <HeroSection />

        {/* TODO: <CraftSection />        */}
        {/* TODO: <GallerySection />      */}
        {/* TODO: <TrustSection />        */}
        {/* TODO: <ContactSection />      */}

        <Footer />
      </main>
    </>
  );
}
