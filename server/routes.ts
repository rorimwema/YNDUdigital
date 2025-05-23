import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertSubscriptionSchema,
  insertProductSchema,
  insertProductCategorySchema,
  insertOrderSchema,
  insertOrderItemSchema
} from "@shared/schema";

// Session middleware to check if the user is logged in
const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Admin middleware to check if the user is an admin
const adminMiddleware = async (req: any, res: Response, next: NextFunction) => {
  if (!req.session?.userId || !req.session?.isAdmin) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  // Double-check admin role in database for security
  const user = await storage.getUser(req.session.userId);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  
  next();
};

// Registration schema with password confirmation
const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  phone: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

// Login schema
const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

// Order schema for creating a new order
const createOrderSchema = z.object({
  totalAmount: z.number().positive(),
  deliveryAddress: z.string().min(5),
  contactPhone: z.string().min(10),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.number().positive(),
    quantity: z.number().positive(),
    unitPrice: z.number().positive()
  }))
});

export async function registerRoutes(app: Express): Promise<Server> {
  // ===== Authentication Routes =====
  
  // Register a new user
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validation = registerSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid registration data", 
          errors: validation.error.errors 
        });
      }

      const { username, email, password, phone } = validation.data;
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ 
          message: "Username already taken" 
        });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ 
          message: "Email already registered" 
        });
      }
      
      // Create the user
      const user = await storage.createUser({ 
        username, 
        email, 
        password,  // In a real app, you'd hash this password
        phone
      });
      
      // Set user session
      (req as any).session.userId = user.id;
      
      return res.status(201).json({ 
        message: "Registration successful", 
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Login route
  app.post("/api/auth/login", async (req, res) => {
    try {
      const validation = loginSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid login data", 
          errors: validation.error.errors 
        });
      }

      const { username, password } = validation.data;
      
      // Find the user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ 
          message: "Invalid username or password" 
        });
      }
      
      // Check password (in a real app, you'd verify the hashed password)
      if (user.password !== password) {
        return res.status(401).json({ 
          message: "Invalid username or password" 
        });
      }
      
      // Set user session
      (req as any).session.userId = user.id;
      
      return res.status(200).json({ 
        message: "Login successful", 
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Admin login route
  app.post("/api/auth/admin-login", async (req, res) => {
    try {
      const validation = loginSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid login data", 
          errors: validation.error.errors 
        });
      }

      const { username, password } = validation.data;
      
      // Find the user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ 
          message: "Invalid username or password" 
        });
      }
      
      // Check if user is an admin
      if (user.role !== "admin") {
        return res.status(403).json({ 
          message: "Access denied. Admin privileges required." 
        });
      }
      
      // Check password (in a real app, you'd verify the hashed password)
      if (user.password !== password) {
        return res.status(401).json({ 
          message: "Invalid username or password" 
        });
      }
      
      // Set user session
      (req as any).session.userId = user.id;
      (req as any).session.isAdmin = true;
      
      return res.status(200).json({ 
        success: true,
        message: "Admin login successful", 
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Admin login error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Logout route
  app.post("/api/auth/logout", (req: any, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });
  
  // Check authentication status
  app.get("/api/auth/check", (req: any, res) => {
    if (req.session?.userId) {
      return res.status(200).json({ authenticated: true, userId: req.session.userId });
    } else {
      return res.status(200).json({ authenticated: false });
    }
  });
  
  // ===== Product Routes =====
  
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      return res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get a single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      return res.status(200).json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Search products
  app.get("/api/products/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query required" });
      }
      
      const products = await storage.searchProducts(query);
      return res.status(200).json(products);
    } catch (error) {
      console.error("Error searching products:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Admin: Create a new product
  app.post("/api/products", adminMiddleware, async (req, res) => {
    try {
      const validation = insertProductSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid product data", 
          errors: validation.error.errors 
        });
      }

      const productData = validation.data;
      const product = await storage.createProduct(productData);
      
      return res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Admin: Update a product
  app.put("/api/products/:id", adminMiddleware, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const validation = insertProductSchema.partial().safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid product data", 
          errors: validation.error.errors 
        });
      }

      const productData = validation.data;
      const product = await storage.updateProduct(productId, productData);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      return res.status(200).json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Admin: Delete a product
  app.delete("/api/products/:id", adminMiddleware, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      await storage.deleteProduct(productId);
      
      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // ===== Category Routes =====
  
  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllProductCategories();
      return res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Admin: Create a new category
  app.post("/api/categories", adminMiddleware, async (req, res) => {
    try {
      const validation = insertProductCategorySchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid category data", 
          errors: validation.error.errors 
        });
      }

      const categoryData = validation.data;
      const category = await storage.createProductCategory(categoryData);
      
      return res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // ===== Order Routes =====
  
  // Create a new order
  app.post("/api/orders", authMiddleware, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const validation = createOrderSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid order data", 
          errors: validation.error.errors 
        });
      }

      const { totalAmount, deliveryAddress, contactPhone, notes, items } = validation.data;
      
      // Create the order
      const order = await storage.createOrder({
        userId,
        totalAmount,
        deliveryAddress,
        contactPhone,
        notes
      });
      
      // Create order items
      for (const item of items) {
        await storage.createOrderItem({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        });
      }
      
      return res.status(201).json({ 
        message: "Order placed successfully", 
        order 
      });
    } catch (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get user's orders
  app.get("/api/orders", authMiddleware, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const orders = await storage.getOrdersByUser(userId);
      return res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get order details
  app.get("/api/orders/:id", authMiddleware, async (req: any, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const userId = req.session.userId;
      
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Only admin or the order owner can see the order
      const user = await storage.getUser(userId);
      if (order.userId !== userId && user?.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const orderItems = await storage.getOrderItems(orderId);
      
      return res.status(200).json({ 
        order,
        items: orderItems
      });
    } catch (error) {
      console.error("Error fetching order:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Admin: Get all orders
  app.get("/api/admin/orders", adminMiddleware, async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      return res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Admin: Update order status
  app.put("/api/admin/orders/:id", adminMiddleware, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["pending", "confirmed", "delivered", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const order = await storage.updateOrderStatus(orderId, status);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      return res.status(200).json({ 
        message: "Order status updated successfully", 
        order 
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // ===== Farm Events Routes =====
  
  // Get all events
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getAllFarmEvents();
      return res.status(200).json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Admin: Create a new event
  app.post("/api/events", adminMiddleware, async (req, res) => {
    try {
      const validation = insertFarmEventSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid event data", 
          errors: validation.error.errors 
        });
      }

      const eventData = validation.data;
      const event = await storage.createFarmEvent(eventData);
      
      return res.status(201).json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // ===== Subscription Routes =====
  
  // Subscribe to newsletter
  app.post("/api/subscribe", async (req, res) => {
    try {
      const validation = insertSubscriptionSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid subscription data", 
          errors: validation.error.errors 
        });
      }

      const subscriptionData = validation.data;
      
      // In a real application, this would store the data in a database
      // and send a confirmation email
      const subscription = await storage.createSubscription(subscriptionData);
      
      return res.status(200).json({ 
        message: "Subscription successful", 
        email: subscription.email 
      });
    } catch (error) {
      console.error("Subscription error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Unsubscribe from newsletter
  app.post("/api/unsubscribe", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      await storage.unsubscribe(email);
      
      return res.status(200).json({ 
        message: "Unsubscribed successfully" 
      });
    } catch (error) {
      console.error("Unsubscribe error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
