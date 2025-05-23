import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Package, ShoppingBag, Users, Calendar, FileEdit, Trash2, PlusCircle, Clock, MapPin, Tag } from "lucide-react";

// Event category options
const EVENT_CATEGORIES = [
  "farm-tour",
  "workshop",
  "market-day",
  "community-event",
  "special-sale",
  "other"
];

// Event category badge component
const EventCategoryBadge = ({ category }: { category: string }) => {
  const categoryStyles: Record<string, string> = {
    "farm-tour": "bg-green-100 text-green-800 border-green-200",
    "workshop": "bg-blue-100 text-blue-800 border-blue-200",
    "market-day": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "community-event": "bg-purple-100 text-purple-800 border-purple-200",
    "special-sale": "bg-red-100 text-red-800 border-red-200",
    "other": "bg-gray-100 text-gray-800 border-gray-200"
  };
  
  const displayName = category.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  return (
    <Badge className={`font-medium ${categoryStyles[category] || categoryStyles.other}`}>
      {displayName}
    </Badge>
  );
};

// Order status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200"
  };
  
  return (
    <Badge className={`font-medium ${statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState("orders");
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [eventFormOpen, setEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  
  const { toast } = useToast();
  
  // Form states
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    stock: "0",
    categoryId: ""
  });
  
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: ""
  });
  
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    location: "",
    imageUrl: "",
    category: "farm-tour"
  });
  
  // Set document title
  useEffect(() => {
    document.title = "Admin Dashboard - Yndu Fountain Farms";
  }, []);
  
  // Reset product form when opening
  useEffect(() => {
    if (productFormOpen) {
      if (editingProduct) {
        setProductForm({
          name: editingProduct.name,
          description: editingProduct.description || "",
          price: editingProduct.price.toString(),
          imageUrl: editingProduct.imageUrl || "",
          stock: editingProduct.stock.toString(),
          categoryId: editingProduct.categoryId ? editingProduct.categoryId.toString() : ""
        });
      } else {
        setProductForm({
          name: "",
          description: "",
          price: "",
          imageUrl: "",
          stock: "0",
          categoryId: ""
        });
      }
    }
  }, [productFormOpen, editingProduct]);
  
  // Reset category form when opening
  useEffect(() => {
    if (categoryFormOpen) {
      setCategoryForm({
        name: "",
        description: ""
      });
    }
  }, [categoryFormOpen]);
  
  // Reset event form when opening
  useEffect(() => {
    if (eventFormOpen) {
      if (editingEvent) {
        // Format date for input field (YYYY-MM-DD)
        const eventDate = new Date(editingEvent.eventDate);
        const formattedDate = eventDate.toISOString().split('T')[0];
        
        setEventForm({
          title: editingEvent.title,
          description: editingEvent.description || "",
          eventDate: formattedDate,
          startTime: editingEvent.startTime,
          endTime: editingEvent.endTime,
          location: editingEvent.location,
          imageUrl: editingEvent.imageUrl || "",
          category: editingEvent.category
        });
      } else {
        // Set default values for new event
        const today = new Date().toISOString().split('T')[0];
        setEventForm({
          title: "",
          description: "",
          eventDate: today,
          startTime: "09:00",
          endTime: "17:00",
          location: "Yndu Fountain Farms",
          imageUrl: "",
          category: "farm-tour"
        });
      }
    }
  }, [eventFormOpen, editingEvent]);
  
  // Fetch all orders
  const { data: orders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ['/api/admin/orders'],
    staleTime: 30000, // 30 seconds
  });
  
  // Fetch all products
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['/api/products'],
    staleTime: 60000, // 1 minute
  });
  
  // Fetch all categories
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['/api/categories'],
    staleTime: 300000, // 5 minutes
  });
  
  // Fetch all events
  const { data: events = [], isLoading: isLoadingEvents } = useQuery({
    queryKey: ['/api/events'],
    staleTime: 60000, // 1 minute
  });
  
  // Order status update mutation
  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number, status: string }) => {
      return await apiRequest("PUT", `/api/admin/orders/${orderId}`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Order status updated",
        description: "The order status has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      setOrderDetailsOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update order",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Product create/update mutation
  const productMutation = useMutation({
    mutationFn: async (productData: any) => {
      if (editingProduct) {
        return await apiRequest("PUT", `/api/products/${editingProduct.id}`, productData);
      } else {
        return await apiRequest("POST", "/api/products", productData);
      }
    },
    onSuccess: () => {
      toast({
        title: editingProduct ? "Product updated" : "Product created",
        description: editingProduct 
          ? "The product has been successfully updated." 
          : "The product has been successfully created.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setProductFormOpen(false);
      setEditingProduct(null);
    },
    onError: (error: any) => {
      toast({
        title: editingProduct ? "Failed to update product" : "Failed to create product",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Product delete mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      return await apiRequest("DELETE", `/api/products/${productId}`, {});
    },
    onSuccess: () => {
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete product",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Category create mutation
  const categoryMutation = useMutation({
    mutationFn: async (categoryData: any) => {
      return await apiRequest("POST", "/api/categories", categoryData);
    },
    onSuccess: () => {
      toast({
        title: "Category created",
        description: "The category has been successfully created.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      setCategoryFormOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create category",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Product form handlers
  const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategoryForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategorySelectChange = (value: string) => {
    setProductForm(prev => ({ ...prev, categoryId: value }));
  };
  
  // Handle product form submission
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert form values to appropriate types
    const productData = {
      name: productForm.name,
      description: productForm.description || null,
      price: parseFloat(productForm.price),
      imageUrl: productForm.imageUrl || null,
      stock: parseInt(productForm.stock),
      categoryId: productForm.categoryId ? parseInt(productForm.categoryId) : null
    };
    
    productMutation.mutate(productData);
  };
  
  // Handle category form submission
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const categoryData = {
      name: categoryForm.name,
      description: categoryForm.description || null
    };
    
    categoryMutation.mutate(categoryData);
  };
  
  // Handle clicking on an order
  const handleViewOrderDetails = async (order: any) => {
    setSelectedOrder(order);
    
    try {
      // Fetch order items
      const response = await apiRequest("GET", `/api/orders/${order.id}`, null);
      if (response && typeof response === 'object' && 'items' in response) {
        setOrderItems(response.items || []);
      } else {
        setOrderItems([]);
      }
      setOrderDetailsOpen(true);
    } catch (error) {
      toast({
        title: "Failed to fetch order details",
        description: "Could not load the order details. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle updating order status
  const handleUpdateOrderStatus = (status: string) => {
    if (!selectedOrder) return;
    
    updateOrderMutation.mutate({
      orderId: selectedOrder.id,
      status
    });
  };
  
  // Delete product confirmation
  const handleDeleteProduct = (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      deleteProductMutation.mutate(productId);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className="font-body bg-neutral-50 text-neutral-800 pb-16">
      {/* Admin Dashboard Header */}
      <div className="bg-primary py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold text-white">
            Admin Dashboard
          </h1>
          <p className="text-white/80 mt-2">
            Manage products, orders, and shop settings
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="orders" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="orders" className="flex items-center">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Categories
            </TabsTrigger>
          </TabsList>
          
          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-neutral-600">No orders yet</h3>
                    <p className="text-neutral-500 mt-1">Orders will appear here once customers place them</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-200">
                          <th className="px-4 py-3 text-left text-sm font-semibold">Order ID</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Total</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order: any) => (
                          <tr key={order.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                            <td className="px-4 py-3 text-sm">#{order.id}</td>
                            <td className="px-4 py-3 text-sm">{formatDate(order.createdAt)}</td>
                            <td className="px-4 py-3 text-sm">KSh {parseFloat(order.totalAmount).toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <StatusBadge status={order.status} />
                            </td>
                            <td className="px-4 py-3">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewOrderDetails(order)}
                              >
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Products Tab */}
          <TabsContent value="products">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-heading font-semibold">Products</h2>
              <Button 
                className="flex items-center" 
                onClick={() => {
                  setEditingProduct(null);
                  setProductFormOpen(true);
                }}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                {isLoadingProducts ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-neutral-600">No products yet</h3>
                    <p className="text-neutral-500 mt-1">Add your first product to get started</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-200">
                          <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Stock</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product: any) => {
                          const category = categories.find((cat: any) => cat.id === product.categoryId);
                          
                          return (
                            <tr key={product.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                              <td className="px-4 py-3 text-sm">#{product.id}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  {product.imageUrl && (
                                    <div className="w-10 h-10 rounded overflow-hidden mr-3">
                                      <img 
                                        src={product.imageUrl} 
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <div className="font-medium">{product.name}</div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm">KSh {parseFloat(product.price).toLocaleString()}</td>
                              <td className="px-4 py-3 text-sm">{product.stock}</td>
                              <td className="px-4 py-3 text-sm">{category ? category.name : '-'}</td>
                              <td className="px-4 py-3">
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="icon"
                                    onClick={() => {
                                      setEditingProduct(product);
                                      setProductFormOpen(true);
                                    }}
                                  >
                                    <FileEdit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="icon"
                                    onClick={() => handleDeleteProduct(product.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Categories Tab */}
          <TabsContent value="categories">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-heading font-semibold">Categories</h2>
              <Button 
                className="flex items-center"
                onClick={() => setCategoryFormOpen(true)}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add New Category
              </Button>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                {isLoadingCategories ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-neutral-600">No categories yet</h3>
                    <p className="text-neutral-500 mt-1">Add your first category to organize products</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category: any) => (
                      <Card key={category.id}>
                        <CardContent className="pt-6">
                          <h3 className="font-heading font-semibold text-lg mb-2">{category.name}</h3>
                          {category.description && (
                            <p className="text-neutral-600 text-sm mb-3">{category.description}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Order Details Dialog */}
      <Dialog open={orderDetailsOpen} onOpenChange={setOrderDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-sm text-neutral-500 mb-1">Order Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Order Date:</span>
                      <span>{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Status:</span>
                      <StatusBadge status={selectedOrder.status} />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Total Amount:</span>
                      <span className="font-semibold">KSh {parseFloat(selectedOrder.totalAmount).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-neutral-500 mb-1">Delivery Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Address:</span>
                      <span>{selectedOrder.deliveryAddress}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Contact:</span>
                      <span>{selectedOrder.contactPhone}</span>
                    </div>
                    {selectedOrder.notes && (
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">Notes:</span>
                        <span>{selectedOrder.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <h3 className="font-medium mb-3">Order Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="px-4 py-2 text-left text-sm font-semibold">Product ID</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Quantity</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Unit Price</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item: any) => (
                      <tr key={item.id} className="border-b border-neutral-200">
                        <td className="px-4 py-2 text-sm">#{item.productId}</td>
                        <td className="px-4 py-2 text-sm">{item.quantity}</td>
                        <td className="px-4 py-2 text-sm">KSh {parseFloat(item.unitPrice).toLocaleString()}</td>
                        <td className="px-4 py-2 text-sm font-medium">
                          KSh {(parseFloat(item.unitPrice) * item.quantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Update Status</h3>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleUpdateOrderStatus("confirmed")}
                    disabled={selectedOrder.status === "confirmed" || updateOrderMutation.isPending}
                  >
                    Confirm
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleUpdateOrderStatus("delivered")}
                    disabled={selectedOrder.status === "delivered" || updateOrderMutation.isPending}
                  >
                    Mark as Delivered
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleUpdateOrderStatus("cancelled")}
                    disabled={selectedOrder.status === "cancelled" || updateOrderMutation.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Product Form Dialog */}
      <Dialog open={productFormOpen} onOpenChange={setProductFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleProductSubmit}>
            <div className="space-y-4 my-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input 
                  id="name"
                  name="name"
                  value={productForm.name}
                  onChange={handleProductInputChange}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  name="description"
                  value={productForm.description}
                  onChange={handleProductInputChange}
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (KSh) *</Label>
                  <Input 
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={productForm.price}
                    onChange={handleProductInputChange}
                    required
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="stock">Stock *</Label>
                  <Input 
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={handleProductInputChange}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input 
                  id="imageUrl"
                  name="imageUrl"
                  value={productForm.imageUrl}
                  onChange={handleProductInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="categoryId">Category</Label>
                <Select 
                  value={productForm.categoryId} 
                  onValueChange={handleCategorySelectChange}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setProductFormOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={productMutation.isPending}
              >
                {productMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Product"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Category Form Dialog */}
      <Dialog open={categoryFormOpen} onOpenChange={setCategoryFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleCategorySubmit}>
            <div className="space-y-4 my-4">
              <div>
                <Label htmlFor="categoryName">Category Name *</Label>
                <Input 
                  id="categoryName"
                  name="name"
                  value={categoryForm.name}
                  onChange={handleCategoryInputChange}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="categoryDescription">Description</Label>
                <Textarea 
                  id="categoryDescription"
                  name="description"
                  value={categoryForm.description}
                  onChange={handleCategoryInputChange}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setCategoryFormOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={categoryMutation.isPending}
              >
                {categoryMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Category"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}