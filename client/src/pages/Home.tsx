import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import OurProduce from "@/components/OurProduce";
import OurStory from "@/components/OurStory";
import FarmFeatures from "@/components/FarmFeatures";
import Gallery from "@/components/Gallery";
import SustainableVision from "@/components/SustainableVision";
import HorticulturalInfo from "@/components/HorticulturalInfo";
import Stats from "@/components/Stats";
import FarmEvents from "@/components/FarmEvents";
import Subscribe from "@/components/Subscribe";
import Footer from "@/components/Footer";
import Lightbox from "@/components/Lightbox";

export default function Home() {
  // Set document title
  useEffect(() => {
    document.title = "Yndu Fountain Farms - Small Farms. Big Ideas.";
    // Add meta description for SEO
    const metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = 'Yndu Fountain Farms is a sustainable crop and seed growing company in Kenya that performs crop production in an environmentally conscious manner.';
    document.head.appendChild(metaDescription);
    
    return () => {
      document.head.removeChild(metaDescription);
    };
  }, []);

  return (
    <div className="font-body bg-neutral-50 text-neutral-800 overflow-x-hidden">
      <Header />
      
      <main className="pt-16">
        <Hero />
        <OurProduce />
        <OurStory />
        <FarmFeatures />
        <Gallery />
        <SustainableVision />
        <HorticulturalInfo />
        <Stats />
        <FarmEvents />
        <Subscribe />
      </main>
      
      <Footer />
      <Lightbox />
    </div>
  );
}
