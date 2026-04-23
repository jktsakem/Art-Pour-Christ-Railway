import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import GallerySection from "@/components/sections/GallerySection";
import AnnouncementsSection from "@/components/sections/AnnouncementsSection";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/layout/Footer";
import RecentAnnouncementPopup from "@/components/sections/RecentAnnouncementPopup";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <RecentAnnouncementPopup />
      <Header />
      <main>
        <HeroSection />
        <AnnouncementsSection />
        <GallerySection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
