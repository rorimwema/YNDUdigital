import { motion } from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative h-screen flex items-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://yndufountain.co.ke/wp-content/uploads/2023/04/20221112_130917-scaled-1-2048x969.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="container mx-auto px-4 z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <div className="text-white mb-2 font-medium">This is Yndu Farm</div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white text-shadow mb-6">
            Small Farms.<br />Big Ideas.
          </h1>
          <p className="text-lg md:text-xl text-neutral-100 mb-8 max-w-2xl">
            We are a crop and seed growing company that performs production activities in a sustainable manner.
            We ensure efficient utilization of resources and soil regeneration.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <a
              href="#about"
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-full transition-colors shadow-lg hover:shadow-xl"
            >
              Learn More
            </a>
            <div className="flex items-center text-white">
              <MapPin className="mr-2" size={18} />
              <span className="font-medium">Kibwezi, Kenya</span>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-5 left-0 right-0 flex justify-center">
        <a href="#produce" className="text-white">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown size={24} />
          </motion.div>
        </a>
      </div>
    </section>
  );
}
