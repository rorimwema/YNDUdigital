import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-intersection-observer";
import { useRef } from "react";
import { Sun, Droplets, Sprout, Leaf, ShieldAlert } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="feature-card bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center"
    >
      <div className="w-16 h-16 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-heading font-semibold text-neutral-800 mb-2">{title}</h3>
      <p className="text-neutral-600">{description}</p>
    </motion.div>
  );
}

export default function FarmFeatures() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, threshold: 0.1 });

  const features = [
    {
      icon: <Sun className="text-primary h-8 w-8" />,
      title: "Solar Powered Systems",
      description: "Sustainable energy solutions for our farming operations",
      delay: 0.1,
    },
    {
      icon: <Droplets className="text-primary h-8 w-8" />,
      title: "Irrigation & Fertigation",
      description: "Efficient water management systems for optimal crop growth",
      delay: 0.2,
    },
    {
      icon: <Sprout className="text-primary h-8 w-8" />,
      title: "Plant Nutrition",
      description: "Scientifically balanced nutrients for healthy crop production",
      delay: 0.3,
    },
    {
      icon: <Leaf className="text-primary h-8 w-8" />,
      title: "Propagation Systems",
      description: "Advanced techniques for seed and plant propagation",
      delay: 0.4,
    },
    {
      icon: <ShieldAlert className="text-primary h-8 w-8" />,
      title: "Pest & Disease Management",
      description: "Integrated approaches to protect crops naturally",
      delay: 0.5,
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-neutral-50" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {isInView &&
            features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={feature.delay}
              />
            ))}
        </div>
      </div>
    </section>
  );
}
