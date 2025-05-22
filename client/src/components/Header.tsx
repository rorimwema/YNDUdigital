import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link } from "wouter";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 bg-white bg-opacity-95 z-50 transition-all duration-300 ${isScrolled ? "py-3 shadow-lg" : "py-4"}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="text-primary font-heading font-bold text-lg sm:text-2xl">YNDU FOUNTAIN</div>
            <span className="hidden sm:inline-block text-sm font-medium text-neutral-500">|</span>
            <div className="hidden sm:inline-block text-sm font-medium text-neutral-500">Small Farms. Big Ideas.</div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-5 lg:space-x-8">
            <a href="#home" className="font-medium text-neutral-700 hover:text-primary transition-colors text-base">Home</a>
            <a href="#about" className="font-medium text-neutral-700 hover:text-primary transition-colors text-base">About</a>
            <a href="#produce" className="font-medium text-neutral-700 hover:text-primary transition-colors text-base">Our Produce</a>
            <a href="#features" className="font-medium text-neutral-700 hover:text-primary transition-colors text-base">Features</a>
            <a href="#gallery" className="font-medium text-neutral-700 hover:text-primary transition-colors text-base">Gallery</a>
            <a href="#contact" className="font-medium text-neutral-700 hover:text-primary transition-colors text-base">Contact</a>
          </nav>

          {/* Mobile Navigation Toggle */}
          <button 
            aria-label="Toggle Mobile Menu" 
            onClick={toggleMobileMenu} 
            className="md:hidden text-neutral-700 focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white shadow-lg absolute w-full"
          >
            <div className="container mx-auto px-4 py-2">
              <nav className="flex flex-col space-y-3 py-3">
                <a href="#home" onClick={closeMobileMenu} className="font-medium text-neutral-700 hover:text-primary transition-colors py-2 border-b border-neutral-100">Home</a>
                <a href="#about" onClick={closeMobileMenu} className="font-medium text-neutral-700 hover:text-primary transition-colors py-2 border-b border-neutral-100">About</a>
                <a href="#produce" onClick={closeMobileMenu} className="font-medium text-neutral-700 hover:text-primary transition-colors py-2 border-b border-neutral-100">Our Produce</a>
                <a href="#features" onClick={closeMobileMenu} className="font-medium text-neutral-700 hover:text-primary transition-colors py-2 border-b border-neutral-100">Features</a>
                <a href="#gallery" onClick={closeMobileMenu} className="font-medium text-neutral-700 hover:text-primary transition-colors py-2 border-b border-neutral-100">Gallery</a>
                <a href="#contact" onClick={closeMobileMenu} className="font-medium text-neutral-700 hover:text-primary transition-colors py-2">Contact</a>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
