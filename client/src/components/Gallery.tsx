import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-intersection-observer";
import { GalleryImage } from "@/lib/types";

export default function Gallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true });
  
  // Gallery images - using actual images from yndufountain.co.ke
  const galleryImages: GalleryImage[] = [
    {
      src: "https://yndufountain.co.ke/wp-content/uploads/2023/04/WhatsApp-Image-2023-04-10-at-11.03.01-AM-1.jpeg",
      alt: "Farm operations at Yndu Fountain",
      id: 0,
    },
    {
      src: "https://yndufountain.co.ke/wp-content/uploads/2023/04/WhatsApp-Image-2023-04-10-at-11.44.20-AM-1-1.jpeg",
      alt: "Crop production at Yndu Fountain",
      id: 1,
    },
    {
      src: "https://yndufountain.co.ke/wp-content/uploads/2023/04/WhatsApp-Image-2023-04-10-at-11.44.24-AM-1-1.jpeg",
      alt: "Sustainable farming at Yndu Fountain",
      id: 2,
    },
    {
      src: "https://yndufountain.co.ke/wp-content/uploads/2023/04/WhatsApp-Image-2023-04-10-at-11.02.13-AM-1.jpeg",
      alt: "Field operations at Yndu Fountain",
      id: 3,
    },
    {
      src: "https://yndufountain.co.ke/wp-content/uploads/2023/04/WhatsApp-Image-2023-04-10-at-11.44.25-AM-1-1-1.jpeg",
      alt: "Crop variety at Yndu Fountain",
      id: 4,
    },
    {
      src: "https://yndufountain.co.ke/wp-content/uploads/2023/04/WhatsApp-Image-2023-04-10-at-11.44.20-AM-2.jpeg",
      alt: "Fresh produce at Yndu Fountain",
      id: 5,
    },
    {
      src: "https://yndufountain.co.ke/wp-content/uploads/2023/04/WhatsApp-Image-2023-04-10-at-11.44.25-AM-1-3.jpeg",
      alt: "Farming techniques at Yndu Fountain",
      id: 6,
    },
    {
      src: "https://yndufountain.co.ke/wp-content/uploads/2023/04/WhatsApp-Image-2023-04-10-at-11.44.19-AM-2.jpeg",
      alt: "Agricultural innovation at Yndu Fountain",
      id: 7,
    },
  ];

  // Event dispatch to open the lightbox
  const openLightbox = (index: number) => {
    const event = new CustomEvent("openLightbox", {
      detail: { images: galleryImages, selectedIndex: index },
    });
    window.dispatchEvent(event);
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const galleryVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
  };

  return (
    <section id="gallery" className="py-16 md:py-24 bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-md mx-auto text-center mb-12"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="text-primary font-medium mb-2">Our Farm</div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-800 mb-6">
            A Look Into Our Operations
          </h2>
          <p className="text-lg text-neutral-600">
            Experience the beauty and innovation of sustainable farming at Yndu Fountain.
          </p>
        </motion.div>

        <motion.div 
          className="image-gallery grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          variants={galleryVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              className="gallery-item rounded-xl overflow-hidden shadow-md h-52 cursor-pointer"
              onClick={() => openLightbox(index)}
              variants={itemVariants}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
