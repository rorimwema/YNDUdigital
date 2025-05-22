import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-intersection-observer";
import { useRef } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarPlus, Clock } from "lucide-react";
import { addDays, format } from "date-fns";

export default function FarmEvents() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, threshold: 0.2 });
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Sample farm events
  const events = [
    {
      id: 1,
      title: "Seed Planting Workshop",
      date: addDays(new Date(), 5),
      time: "09:00 AM - 12:00 PM",
      description: "Learn about sustainable seed planting techniques and take home your own seedlings.",
      category: "workshop"
    },
    {
      id: 2,
      title: "Farm Tour & Tasting",
      date: addDays(new Date(), 10),
      time: "10:00 AM - 02:00 PM",
      description: "Guided tour of our sustainable farming operations followed by a farm-to-table tasting experience.",
      category: "tour"
    },
    {
      id: 3,
      title: "Composting Masterclass",
      date: addDays(new Date(), 15),
      time: "02:00 PM - 04:00 PM",
      description: "Discover how to create nutrient-rich compost for your home garden using kitchen scraps and yard waste.",
      category: "workshop"
    },
    {
      id: 4,
      title: "Farmers Market",
      date: addDays(new Date(), 18),
      time: "08:00 AM - 01:00 PM",
      description: "Visit our monthly farmers market featuring our fresh produce and products from other local producers.",
      category: "market"
    }
  ];
  
  // Filter events that match the selected date
  const selectedDateEvents = events.filter(event => 
    date && event.date.toDateString() === date.toDateString()
  );
  
  // Find upcoming events (next 30 days)
  const upcomingEvents = events
    .filter(event => event.date > new Date() && event.date <= addDays(new Date(), 30))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const calendarVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2 } }
  };
  
  const eventVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="events" className="py-16 md:py-24 bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-12"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="text-primary font-medium mb-2">Join Us</div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-800 mb-4">
            Farm Events & Activities
          </h2>
          <p className="text-lg text-neutral-600">
            Stay up-to-date with our latest workshops, tours, and market events. 
            Learn about sustainable farming practices and experience our farm firsthand.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          <motion.div 
            className="lg:col-span-5"
            variants={calendarVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <Card className="border border-neutral-200 shadow-md rounded-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-primary py-4 px-6 text-white">
                  <h3 className="font-heading font-semibold text-xl flex items-center">
                    <CalendarPlus className="mr-2" size={20} />
                    Select a Date
                  </h3>
                </div>
                <div className="p-4">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="border rounded-md p-0"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="lg:col-span-7">
            <Tabs defaultValue="selected" className="w-full">
              <TabsList className="w-full grid grid-cols-2 mb-6">
                <TabsTrigger value="selected">Selected Date</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              </TabsList>
              
              <TabsContent value="selected" className="mt-0">
                <div className="border border-neutral-200 rounded-xl p-6">
                  {selectedDateEvents.length > 0 ? (
                    <div className="space-y-6">
                      <h3 className="font-heading font-semibold text-xl mb-4">
                        Events on {date ? format(date, 'MMMM dd, yyyy') : ''}
                      </h3>
                      {selectedDateEvents.map((event, index) => (
                        <motion.div 
                          key={event.id}
                          className="border-l-4 border-primary pl-4 py-2"
                          variants={eventVariants}
                          initial="hidden"
                          animate={isInView ? "visible" : "hidden"}
                          transition={{ delay: index * 0.1 }}
                        >
                          <h4 className="font-semibold text-lg">{event.title}</h4>
                          <div className="flex items-center text-neutral-500 mb-2">
                            <Clock size={16} className="mr-1" />
                            <span className="text-sm">{event.time}</span>
                          </div>
                          <p className="text-neutral-600">{event.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <h3 className="font-heading font-semibold text-xl mb-2">
                        No Events Scheduled
                      </h3>
                      <p className="text-neutral-500">
                        There are no events scheduled for {date ? format(date, 'MMMM dd, yyyy') : 'this date'}.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="upcoming" className="mt-0">
                <div className="border border-neutral-200 rounded-xl p-6">
                  <h3 className="font-heading font-semibold text-xl mb-4">
                    Upcoming Events (Next 30 Days)
                  </h3>
                  {upcomingEvents.length > 0 ? (
                    <div className="space-y-6">
                      {upcomingEvents.map((event, index) => (
                        <motion.div 
                          key={event.id}
                          className="border-l-4 border-primary pl-4 py-2"
                          variants={eventVariants}
                          initial="hidden"
                          animate={isInView ? "visible" : "hidden"}
                          transition={{ delay: index * 0.1 }}
                        >
                          <h4 className="font-semibold text-lg">{event.title}</h4>
                          <div className="flex items-center text-neutral-500 mb-2">
                            <span className="font-medium mr-2">
                              {format(event.date, 'MMMM dd, yyyy')}
                            </span>
                            <Clock size={16} className="mr-1" />
                            <span className="text-sm">{event.time}</span>
                          </div>
                          <p className="text-neutral-600">{event.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-neutral-500">No upcoming events in the next 30 days.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
}