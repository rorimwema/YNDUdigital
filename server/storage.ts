import { 
  users, type User, type InsertUser,
  productCategories, type ProductCategory, type InsertProductCategory,
  products, type Product, type InsertProduct,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem,
  farmEvents, type FarmEvent, type InsertFarmEvent,
  subscriptions, type Subscription, type InsertSubscription
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, like, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product category methods
  getAllProductCategories(): Promise<ProductCategory[]>;
  getProductCategory(id: number): Promise<ProductCategory | undefined>;
  createProductCategory(category: InsertProductCategory): Promise<ProductCategory>;
  updateProductCategory(id: number, category: Partial<InsertProductCategory>): Promise<ProductCategory | undefined>;
  deleteProductCategory(id: number): Promise<boolean>;
  
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  searchProducts(query: string): Promise<Product[]>;
  
  // Order methods
  getAllOrders(): Promise<Order[]>;
  getOrdersByStatus(status: string): Promise<Order[]>;
  getOrdersByUser(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Order item methods
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  
  // Farm event methods
  getAllFarmEvents(): Promise<FarmEvent[]>;
  getFarmEventsByDate(startDate: Date, endDate: Date): Promise<FarmEvent[]>;
  getFarmEvent(id: number): Promise<FarmEvent | undefined>;
  createFarmEvent(event: InsertFarmEvent): Promise<FarmEvent>;
  updateFarmEvent(id: number, event: Partial<InsertFarmEvent>): Promise<FarmEvent | undefined>;
  deleteFarmEvent(id: number): Promise<boolean>;
  
  // Subscription methods
  getAllSubscriptions(): Promise<Subscription[]>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  unsubscribe(email: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...insertUser,
      role: "customer"
    }).returning();
    return user;
  }
  
  // Product category methods
  async getAllProductCategories(): Promise<ProductCategory[]> {
    return await db.select().from(productCategories);
  }
  
  async getProductCategory(id: number): Promise<ProductCategory | undefined> {
    const [category] = await db.select().from(productCategories).where(eq(productCategories.id, id));
    return category || undefined;
  }
  
  async createProductCategory(category: InsertProductCategory): Promise<ProductCategory> {
    const [newCategory] = await db.insert(productCategories).values(category).returning();
    return newCategory;
  }
  
  async updateProductCategory(id: number, category: Partial<InsertProductCategory>): Promise<ProductCategory | undefined> {
    const [updatedCategory] = await db
      .update(productCategories)
      .set(category)
      .where(eq(productCategories.id, id))
      .returning();
    return updatedCategory || undefined;
  }
  
  async deleteProductCategory(id: number): Promise<boolean> {
    await db
      .delete(productCategories)
      .where(eq(productCategories.id, id));
    return true;
  }
  
  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }
  
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.categoryId, categoryId));
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values({
      ...product, 
      updatedAt: new Date()
    }).returning();
    return newProduct;
  }
  
  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set({
        ...product,
        updatedAt: new Date()
      })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct || undefined;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    await db.delete(products).where(eq(products.id, id));
    return true;
  }
  
  async searchProducts(query: string): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(
        like(products.name, `%${query}%`)
      );
  }
  
  // Order methods
  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }
  
  async getOrdersByStatus(status: string): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.status, status))
      .orderBy(desc(orders.createdAt));
  }
  
  async getOrdersByUser(userId: number): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }
  
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values({
      ...order,
      updatedAt: new Date()
    }).returning();
    return newOrder;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ 
        status: status as any, // Need to cast as 'any' due to type issues with enum
        updatedAt: new Date()
      })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder || undefined;
  }
  
  // Order item methods
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }
  
  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const [newItem] = await db.insert(orderItems).values(item).returning();
    return newItem;
  }
  
  // Farm event methods
  async getAllFarmEvents(): Promise<FarmEvent[]> {
    return await db
      .select()
      .from(farmEvents)
      .orderBy(farmEvents.eventDate);
  }
  
  async getFarmEventsByDate(startDate: Date, endDate: Date): Promise<FarmEvent[]> {
    return await db
      .select()
      .from(farmEvents)
      .where(
        and(
          gte(farmEvents.eventDate, startDate),
          lte(farmEvents.eventDate, endDate)
        )
      )
      .orderBy(farmEvents.eventDate);
  }
  
  async getFarmEvent(id: number): Promise<FarmEvent | undefined> {
    const [event] = await db.select().from(farmEvents).where(eq(farmEvents.id, id));
    return event || undefined;
  }
  
  async createFarmEvent(event: InsertFarmEvent): Promise<FarmEvent> {
    const [newEvent] = await db.insert(farmEvents).values({
      ...event,
      updatedAt: new Date()
    }).returning();
    return newEvent;
  }
  
  async updateFarmEvent(id: number, event: Partial<InsertFarmEvent>): Promise<FarmEvent | undefined> {
    const [updatedEvent] = await db
      .update(farmEvents)
      .set({
        ...event,
        updatedAt: new Date()
      })
      .where(eq(farmEvents.id, id))
      .returning();
    return updatedEvent || undefined;
  }
  
  async deleteFarmEvent(id: number): Promise<boolean> {
    await db.delete(farmEvents).where(eq(farmEvents.id, id));
    return true;
  }
  
  // Subscription methods
  async getAllSubscriptions(): Promise<Subscription[]> {
    return await db.select().from(subscriptions).where(eq(subscriptions.active, true));
  }
  
  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const [newSubscription] = await db.insert(subscriptions).values(subscription).returning();
    return newSubscription;
  }
  
  async unsubscribe(email: string): Promise<boolean> {
    await db
      .update(subscriptions)
      .set({ active: false })
      .where(eq(subscriptions.email, email));
    return true;
  }
}

export const storage = new DatabaseStorage();
