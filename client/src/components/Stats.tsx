import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-intersection-observer";

interface StatCardProps {
  value: number;
  label: string;
  delay: number;
}

function StatCard({ value, label, delay }: StatCardProps) {
  const [count, setCount] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, threshold: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000; // 2 seconds
    const increment = 30; // Update every 30ms
    const steps = Math.ceil(duration / increment);
    const stepSize = value / steps;

    const timer = setInterval(() => {
      start += stepSize;
      if (start > value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, increment);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-xl shadow-md p-6 text-center"
    >
      <div className="text-4xl font-bold text-primary mb-2">{count}</div>
      <p className="text-neutral-600">{label}</p>
    </motion.div>
  );
}

export default function Stats() {
  const stats = [
    { value: 25, label: "Acres of Farmland", delay: 0.1 },
    { value: 12, label: "Crop Varieties", delay: 0.2 },
    { value: 35, label: "Local Team Members", delay: 0.3 },
    { value: 8, label: "Years of Experience", delay: 0.4 },
  ];

  return (
    <section className="py-16 md:py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              value={stat.value}
              label={stat.label}
              delay={stat.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
