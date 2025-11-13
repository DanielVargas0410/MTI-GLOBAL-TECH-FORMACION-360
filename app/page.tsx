import { HomeHeader } from "@/components/home/HomeHeader";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CoursesSection } from "@/components/home/CoursesSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { Footer } from "@/components/home/Footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HomeHeader />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <CoursesSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
