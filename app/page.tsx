import Hero from "@/components/Hero";
import HotelCard from "@/components/HotelCard";
import AgendaViewLoader from "@/components/AgendaViewLoader";
import PhotoSpots from "@/components/PhotoSpots";
import BudgetSection from "@/components/BudgetSection";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { AgendaDayProvider } from "@/components/AgendaDayContext";

/* Layout rhythm: Hero (100dvh) + Hotel/Budget (min-h-dvh on lg) + long Agenda + Fotos + Footer. */
export default function Home() {
  return (
    <AgendaDayProvider>
      <main className="relative min-w-0 max-w-full overflow-x-clip">
        <Navigation />
        <Hero />

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-ink pointer-events-none" />
          <div className="relative z-10">
            <HotelCard />

            <div className="w-16 h-px mx-auto bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

            <AgendaViewLoader />

            <PhotoSpots />

            <BudgetSection />

            <Footer />
          </div>
        </div>
      </main>
    </AgendaDayProvider>
  );
}
