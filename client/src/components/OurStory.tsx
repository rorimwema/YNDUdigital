import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-intersection-observer";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

export default function OurStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true });

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.6, delay: 0.3 } 
    }
  };

  return (
    <section id="about" className="py-16 md:py-24 bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto text-center mb-12">
          <div className="text-primary font-medium mb-2">Our Story</div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-800">
            Supply The Best Products
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-center">
          <motion.div 
            className="md:w-1/2"
            variants={textVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <p className="text-lg text-neutral-600 mb-6">
              Based in Kenya, Yndu Fountain farms employ a rich array of sustainable crop production 
              practices ensuring Good Agricultural Practices are followed in the production supply chain. 
              We employ cultural practices, biological, chemical and other crop management techniques 
              that ensure sustainable crop production.
            </p>
            <p className="text-lg text-neutral-600 mb-8">
              Integrated Pest and Disease Management practices. Fresh and Healthy Conventional Crop Production.
            </p>
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-full transition-colors shadow-md hover:shadow-lg"
            >
              Read More
              <ArrowRight className="ml-2" size={18} />
            </a>
          </motion.div>

          <motion.div 
            className="md:w-1/2"
            variants={imageVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <img
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&h=600"
              alt="Sustainable farming at Yndu Fountain"
              className="w-full h-auto rounded-xl shadow-2xl"
              loading="lazy"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
