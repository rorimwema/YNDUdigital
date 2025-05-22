import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, ShoppingCart, Tag, X, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SignupForm from "@/components/SignupForm";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  stock: number;
  categoryId: number | null;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function Shop() {
  // Set document title
  useEffect(() => {
    document.title = "Shop - Yndu Fountain Farms";
    const metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = 'Shop fresh and sustainable produce directly from Yndu Fountain Farms. We offer a variety of organic vegetables, fruits, and herbs grown using sustainable practices.';
    document.head.appendChild(metaDescription);
    
    return () => {
      document.head.removeChild(metaDescription);
    };
  }, []);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    deliveryAddress: "",
    contactPhone: "",
    notes: ""
  });
  
  const { toast } = useToast();
  
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
  
  // Filtered products based on search and category
  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === null || product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Calculate cart totals
  const calculateTotal = () => {
    return cart.reduce((acc, item) => {
      return acc + (parseFloat(item.product.price) * item.quantity);
    }, 0);
  };
  
  // Add to cart function
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      // Check if product already in cart
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Update quantity if already in cart
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Add new item to cart
        return [...prevCart, { product, quantity: 1 }];
      }
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart.`,
    });
  };
  
  // Remove from cart function
  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };
  
  // Update cart item quantity
  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart => prevCart.map(item => 
      item.product.id === productId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };
  
  // Clear cart
  const clearCart = () => {
    setCart([]);
  };
  
  // Handle checkout form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Order mutation
  const orderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return await apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: () => {
      toast({
        title: "Order placed successfully!",
        description: "Your order has been received and will be processed soon.",
      });
      setCheckoutModalOpen(false);
      clearCart();
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to place order",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Handle checkout form submission
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }
    
    // Create order data
    const orderData = {
      totalAmount: calculateTotal(),
      deliveryAddress: formData.deliveryAddress,
      contactPhone: formData.contactPhone,
      notes: formData.notes,
      items: cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: parseFloat(item.product.price)
      }))
    };
    
    orderMutation.mutate(orderData);
  };
  
  return (
    <div className="font-body bg-neutral-50 text-neutral-800">
      {/* Header */}
      <Header />
      
      {/* Shop Header */}
      <div className="bg-primary py-16 md:py-24 pt-28">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
            Farm Shop
          </h1>
          <p className="text-lg text-white max-w-2xl mx-auto mb-4">
            Shop our fresh, sustainable produce directly from our farm. 
            All items are grown using environmentally friendly practices.
            Payment on delivery.
          </p>
          
          {/* Create Account Button */}
          <Button 
            onClick={() => setIsSignupModalOpen(true)}
            variant="secondary"
            className="mt-2 flex items-center mx-auto"
          >
            <User size={18} className="mr-2" />
            Create Account
          </Button>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar with filters and cart */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <Search className="w-4 h-4 mr-2" />
                    Search Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </CardContent>
              </Card>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <Tag className="w-4 h-4 mr-2" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div 
                      className={`cursor-pointer hover:text-primary transition-colors py-1 px-2 rounded ${selectedCategory === null ? 'bg-primary/10 text-primary font-medium' : ''}`}
                      onClick={() => setSelectedCategory(null)}
                    >
                      All Products
                    </div>
                    {isLoadingCategories ? (
                      <div className="flex justify-center p-4">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      </div>
                    ) : (
                      categories.map((category: any) => (
                        <div 
                          key={category.id}
                          className={`cursor-pointer hover:text-primary transition-colors py-1 px-2 rounded ${selectedCategory === category.id ? 'bg-primary/10 text-primary font-medium' : ''}`}
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          {category.name}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Your Cart
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {cart.length === 0 ? (
                    <p className="text-sm text-neutral-500 text-center py-4">
                      Your cart is empty
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex justify-between items-center pb-2 border-b border-neutral-200">
                          <div>
                            <p className="font-medium text-sm">{item.product.name}</p>
                            <div className="flex items-center mt-1">
                              <button 
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="bg-neutral-100 hover:bg-neutral-200 w-5 h-5 flex items-center justify-center rounded"
                                disabled={item.quantity <= 1}
                              >
                                -
                              </button>
                              <span className="mx-2 text-sm">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="bg-neutral-100 hover:bg-neutral-200 w-5 h-5 flex items-center justify-center rounded"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-sm">
                              KSh {(parseFloat(item.product.price) * item.quantity).toLocaleString()}
                            </p>
                            <button 
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-red-500 hover:text-red-700 text-sm mt-1"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <div className="pt-3">
                        <div className="flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>KSh {calculateTotal().toLocaleString()}</span>
                        </div>
                        
                        <Button 
                          className="w-full mt-4" 
                          onClick={() => setCheckoutModalOpen(true)}
                          disabled={cart.length === 0}
                        >
                          Checkout
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Product grid */}
          <div className="lg:col-span-9">
            {isLoadingProducts ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-neutral-500">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product: Product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="h-48 overflow-hidden">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                          <span className="text-neutral-400">No image</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="font-heading font-semibold text-lg mb-2">{product.name}</h3>
                      <p className="text-neutral-600 text-sm h-12 overflow-hidden">
                        {product.description || "No description available"}
                      </p>
                      <p className="font-bold text-lg mt-3 text-primary">
                        KSh {parseFloat(product.price).toLocaleString()}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        className="w-full" 
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                      >
                        {product.stock <= 0 ? "Out of stock" : "Add to Cart"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Checkout Modal */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-lg w-full">
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <CardTitle>Checkout</CardTitle>
                <button onClick={() => setCheckoutModalOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>
            <form onSubmit={handleCheckout}>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Order Summary</h3>
                  <div className="space-y-2 mb-4">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span>{item.quantity} x {item.product.name}</span>
                        <span>KSh {(parseFloat(item.product.price) * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>KSh {calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                    <Input 
                      id="deliveryAddress"
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleInputChange}
                      placeholder="Enter your full delivery address"
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contactPhone">Contact Phone *</Label>
                    <Input 
                      id="contactPhone"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Order Notes</Label>
                    <Input 
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any special instructions for your order"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex-col">
                <p className="text-sm text-neutral-500 mb-4">
                  <strong>Note:</strong> Payment will be made upon delivery. We accept cash and mobile money payments.
                </p>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={orderMutation.isPending}
                >
                  {orderMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
      
      {/* Signup Modal */}
      {isSignupModalOpen && (
        <SignupForm onClose={() => setIsSignupModalOpen(false)} />
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  );
}