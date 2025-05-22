import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for newsletter subscription
  app.post("/api/subscribe", async (req, res) => {
    try {
      // Validate request body
      const validation = subscribeSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid subscription data", 
          errors: validation.error.errors 
        });
      }

      const subscriberData = validation.data;
      
      // In a real application, this would store the data in a database
      // For now we'll just return a success response
      console.log("New subscription:", subscriberData);
      
      return res.status(200).json({ 
        message: "Subscription successful", 
        email: subscriberData.email 
      });
    } catch (error) {
      console.error("Subscription error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
