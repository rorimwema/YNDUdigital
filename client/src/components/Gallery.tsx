import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-intersection-observer";
import { GalleryImage } from "@/lib/types";

export default function Gallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true });
  
  // Gallery images
  const galleryImages: GalleryImage[] = [
    {
      src: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      alt: "Crop inspection at Yndu farm",
      id: 0,
    },
    {
      src: "https://pixabay.com/get/geedcb0d9849bd612d5a038b627dc82cfa446264bf7b63286ac454ca3c830fa08c85bb32498d934dab5477d273c40d98386a769be2029ac4ea9cecdc52b26e38f_1280.jpg",
      alt: "Technology in farming at Yndu",
      id: 1,
    },
    {
      src: "https://pixabay.com/get/ga2cf6afd3d66d40e1156a6df5914d5693c03a35c5ad9f554e3ad1c1fdc4c42440a4ed5e5792cc608b898c97cb605fedb5de44ffc72237ad6b7cc6d685ade6061_1280.jpg",
      alt: "Harvesting at Yndu farm",
      id: 2,
    },
    {
      src: "https://pixabay.com/get/gb1b5ff712ee6a8b41d32cbbe3015e10aaf0527fb56b2eca8039f8e6de8b9a27a0abf10dc7795599f2c9da24dcd16ff1d39eb91a7e8f940ecdb53a8c01af52d80_1280.jpg",
      alt: "Solar powered irrigation",
      id: 3,
    },
    {
      src: "https://images.unsplash.com/photo-1520052203542-d3095f1b6cf0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      alt: "Seedling preparation",
      id: 4,
    },
    {
      src: "https://images.unsplash.com/photo-1624397640148-949b1732bb0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      alt: "Modern greenhouse",
      id: 5,
    },
    {
      src: "https://images.unsplash.com/photo-1566842600175-97dca489844f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      alt: "Vegetable rows at Yndu",
      id: 6,
    },
    {
      src: "https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      alt: "Crop inspection",
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
