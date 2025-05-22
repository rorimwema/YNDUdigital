import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GalleryImage } from "@/lib/types";

export default function Lightbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleOpenLightbox = (e: CustomEvent) => {
      const { images, selectedIndex } = e.detail;
      setImages(images);
      setCurrentIndex(selectedIndex);
      setIsOpen(true);
      document.body.style.overflow = "hidden";
    };

    window.addEventListener("openLightbox" as any, handleOpenLightbox as any);

    return () => {
      window.removeEventListener("openLightbox" as any, handleOpenLightbox as any);
    };
  }, []);

  const closeLightbox = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
        case "Escape":
          closeLightbox();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, images]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-neutral-300 transition-colors"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <X size={32} />
          </button>

          <button
            className="absolute left-4 text-white hover:text-neutral-300 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            aria-label="Previous image"
          >
            <ChevronLeft size={48} />
          </button>

          <button
            className="absolute right-4 text-white hover:text-neutral-300 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Next image"
          >
            <ChevronRight size={48} />
          </button>

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={images[currentIndex]?.src}
                alt={images[currentIndex]?.alt}
                className="max-w-[90vw] max-h-[90vh] object-contain"
              />
            </AnimatePresence>
            <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
              {images[currentIndex]?.alt} ({currentIndex + 1} of {images.length})
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
