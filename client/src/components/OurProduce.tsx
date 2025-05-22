import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-intersection-observer";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

export default function OurProduce() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true });

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, delay: 0.2 } 
    }
  };

  return (
    <section id="produce" className="py-16 md:py-24 bg-neutral-50" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <motion.div 
            className="md:w-1/2"
            variants={contentVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-800 mb-6">Our Produce</h2>
            <p className="text-lg text-neutral-600 mb-8">
              Originating in Kenya, Yndu Fountain has a growing number of farms within the production region. 
              The company stands out for its crop production activities and home-grown research, which include 
              local crops, as well as exotic and new varieties.
            </p>
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 bg-secondary hover:bg-secondary-dark text-white font-medium rounded-full transition-colors shadow-md hover:shadow-lg"
            >
              View All Produce
              <ArrowRight className="ml-2" size={18} />
            </a>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2 grid grid-cols-2 md:grid-cols-3 gap-4"
            variants={imageVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {/* Fresh produce image */}
            <div className="rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
              <img 
                src="https://yndufountain.co.ke/wp-content/uploads/2023/04/WhatsApp-Image-2023-04-10-at-11.44.19-AM-2.jpeg" 
                alt="Fresh produce from Yndu farm" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            {/* Organic vegetables image */}
            <div className="rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
              <img 
                src="https://yndufountain.co.ke/wp-content/uploads/2023/04/WhatsApp-Image-2023-04-10-at-11.44.25-AM-2.jpeg" 
                alt="Organic vegetables from Yndu farm" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            {/* Green produce image */}
            <div className="rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105 col-span-2 md:col-span-1">
              <img 
                src="https://yndufountain.co.ke/wp-content/uploads/2023/04/WhatsApp-Image-2023-04-10-at-11.44.20-AM-2.jpeg" 
                alt="Green produce from Yndu farm" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
