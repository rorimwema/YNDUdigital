import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-intersection-observer";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

export default function SustainableVision() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true });

  const contentVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        duration: 0.6 
      } 
    }
  };

  return (
    <section
      ref={sectionRef}
      className="h-[60vh] relative flex items-center bg-cover bg-center parallax-bg py-16"
      style={{
        backgroundImage:
          "url('https://yndufountain.co.ke/wp-content/uploads/2023/04/WhatsApp-Image-2023-04-10-at-11.44.25-AM-2.jpeg')",
      }}
    >
      <div className="absolute inset-0 bg-primary bg-opacity-70"></div>
      <div className="container mx-auto px-4 z-10 text-center">
        <motion.div
          className="max-w-3xl mx-auto"
          variants={contentVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white text-shadow mb-6">
            The Home For Our Farm.<br />Sustainable Small farms with big ideas.
          </h2>
          <a
            href="#"
            className="inline-flex items-center px-8 py-4 bg-white hover:bg-neutral-100 text-primary font-medium rounded-full transition-colors shadow-lg hover:shadow-xl"
          >
            Learn More
            <ArrowRight className="ml-2" size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
