import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { BouquetHero } from "@/components/BouquetHero";
import { EditorialIntro } from "@/components/sections/EditorialIntro";
import { SignatureCollection } from "@/components/sections/SignatureCollection";
import { ShopByOccasion } from "@/components/sections/ShopByOccasion";
import { BouqcakesExperience } from "@/components/sections/BouqcakesExperience";
import { CustomGifting } from "@/components/sections/CustomGifting";
import { FinalCta } from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5EEE5] text-[#292321] flex flex-col selection:bg-[#8F1728] selection:text-[#F5EEE5]">
      {/* Luxury Navigation Header */}
      <Header />

      {/* Complete Editorial Homepage */}
      <main className="flex-1">
        <BouquetHero videoSrc="/videos/cake.mp4" />
        <EditorialIntro />
        <SignatureCollection />
        <ShopByOccasion />
        <BouqcakesExperience />
        <CustomGifting />
        <FinalCta />
      </main>

      {/* Minimal Editorial Footer */}
      <Footer />
    </div>
  );
}
