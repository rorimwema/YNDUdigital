import React, { useState, useEffect } from "react";
import { Route, Switch, Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { UserIcon, LogOut, ShoppingCart } from "lucide-react";
import { authService, type AuthUser } from "@/utils/auth";

import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminLogin from "@/pages/AdminLogin";
import NotFound from "@/pages/not-found";

// User context to manage logged in state
export const UserContext = React.createContext<{
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<{ error: Error | null }>;
  isAdmin: boolean;
}>({
  user: null,
  isLoggedIn: false,
  login: async () => ({ error: null }),
  logout: async () => ({ error: null }),
  isAdmin: false
});

function App() {
  const [location, setLocation] = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is authenticated on app load
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        // Get the current session
        await authService.getSession();
        
        // Get the current user
        const currentUser = await authService.getUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Handle login form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { user: authUser, error } = await authService.signIn(loginForm.email, loginForm.password);
      
      if (error) {
        throw error;
      }
      
      setUser(authUser);
      setIsLoginModalOpen(false);
      toast({
        title: "Login successful",
        description: `Welcome back, ${authUser?.username || 'User'}!`,
      });
      
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await authService.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      // Redirect to home if on admin page
      if (location.startsWith("/admin")) {
        setLocation("/");
      }
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  // User context value
  const userContextValue = {
    user,
    isLoggedIn: !!user,
    login: async (email: string, password: string) => {
      const result = await authService.signIn(email, password);
      if (result.error) {
        toast({
          title: "Login failed",
          description: result.error.message || "Invalid email or password",
          variant: "destructive",
        });
      } else if (result.user) {
        setUser(result.user);
        toast({
          title: "Login successful",
          description: `Welcome back, ${result.user.username || 'User'}!`,
        });
      }
      return result;
    },
    logout: async () => {
      const result = await authService.signOut();
      if (result.error) {
        toast({
          title: "Logout failed",
          description: result.error.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      } else {
        setUser(null);
        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
        });
        
        // Redirect to home if on admin page
        if (location.startsWith("/admin")) {
          setLocation("/");
        }
      }
      return result;
    },
    isAdmin
  };

  return (
    <UserContext.Provider value={userContextValue}>
      {/* Removed user authentication buttons from here - they will be added to the Header component */}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-heading font-bold mb-4">Login</h2>
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={loginForm.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-neutral-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={loginForm.password}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-neutral-300 rounded-md"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setIsLoginModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/shop" component={Shop} />
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin">
            {isAdmin ? <AdminDashboard /> : <AdminLogin />}
          </Route>
          <Route component={NotFound} />
        </Switch>
      )}
    </UserContext.Provider>
  );
}

export default App;
