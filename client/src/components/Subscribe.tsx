import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-intersection-observer";
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const subscriptionSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
});

type SubscriptionForm = z.infer<typeof subscriptionSchema>;

export default function Subscribe() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscriptionForm>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: SubscriptionForm) => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/subscribe", data);
      toast({
        title: "Subscription successful!",
        description: "Thank you for subscribing to our newsletter.",
        variant: "default",
      });
      reset();
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "There was a problem with your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto bg-primary rounded-2xl shadow-xl overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="grid md:grid-cols-5">
            <div className="md:col-span-2 hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1607305387299-a3d9611cd469?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1200"
                alt="Fresh produce from Yndu farm"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="md:col-span-3 p-8 md:p-12">
              <h2 className="text-3xl font-heading font-bold text-white mb-6">
                Subscribe To Get Special Offers
              </h2>
              <p className="text-neutral-100 mb-8">
                Stay updated with our latest products, farming techniques, and exclusive offers.
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-200 mb-1"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary ${
                      errors.email ? "border-2 border-red-500" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-300">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-neutral-200 mb-1"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    {...register("phone")}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 mt-2 bg-secondary hover:bg-secondary-dark text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-70"
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
