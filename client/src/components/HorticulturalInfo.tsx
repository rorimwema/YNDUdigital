import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-intersection-observer";
import { useRef } from "react";

export default function HorticulturalInfo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true });

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="py-16 md:py-20 bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-4xl mx-auto"
          variants={textVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <p className="text-xl text-neutral-700 text-center leading-relaxed font-accent italic">
            Horticultural crops include{" "}
            <span className="font-bold">
              fruits, vegetables, herbs, medicinal, aromatic, and ornamental plants
            </span>
            . These crops are important dietary nutritional components and sources of medicines
            and aroma along with significant esthetic values for human beings.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
