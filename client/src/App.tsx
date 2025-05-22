import React, { useState, useEffect } from "react";
import { Route, Switch, Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { UserIcon, LogOut, ShoppingCart } from "lucide-react";

import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";

// User context to manage logged in state
export const UserContext = React.createContext<{
  user: any;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}>({
  user: null,
  isLoggedIn: false,
  login: async () => {},
  logout: async () => {},
  isAdmin: false
});

function App() {
  const [location, setLocation] = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  // Check if user is authenticated on app load
  const { data: authData } = useQuery({
    queryKey: ['/api/auth/check'],
    staleTime: 300000, // 5 minutes
  });

  // Fetch user data if authenticated
  useEffect(() => {
    const fetchUserData = async () => {
      if (authData && typeof authData === 'object' && 'authenticated' in authData && authData.authenticated === true && 'userId' in authData) {
        try {
          // In a real implementation, you'd fetch user details here
          // For now we'll assume the user is authenticated without fetching details
          setUser({ id: authData.userId, role: "customer" });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
      }
    };

    fetchUserData();
  }, [authData]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      return await apiRequest("POST", "/api/auth/login", credentials);
    },
    onSuccess: (data) => {
      if (data && typeof data === 'object' && 'user' in data) {
        const userData = data.user as { id: number; username: string; email: string; role: string };
        setUser(userData);
        setIsLoginModalOpen(false);
        toast({
          title: "Login successful",
          description: `Welcome back, ${userData.username || 'User'}!`,
        });
        queryClient.invalidateQueries({ queryKey: ['/api/auth/check'] });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    }
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/auth/logout", {});
    },
    onSuccess: () => {
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/check'] });
      
      // Redirect to home if on admin page
      if (location.startsWith("/admin")) {
        setLocation("/");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Logout failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Handle login form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginForm);
  };

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  // User context value
  const userContextValue = {
    user,
    isLoggedIn: !!user,
    login: async (username: string, password: string) => {
      loginMutation.mutate({ username, password });
    },
    logout: async () => {
      logoutMutation.mutate();
    },
    isAdmin
  };

  return (
    <UserContext.Provider value={userContextValue}>
      {/* User authentication buttons */}
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
        {user ? (
          <>
            <span className="text-sm text-white bg-primary px-3 py-1 rounded-full">
              {user.username || `User #${user.id}`}
            </span>
            {isAdmin && (
              <Link href="/admin">
                <Button variant="secondary" size="sm" className="flex items-center">
                  <UserIcon className="mr-1 h-4 w-4" />
                  Admin
                </Button>
              </Link>
            )}
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleLogout}
              className="flex items-center"
            >
              <LogOut className="mr-1 h-4 w-4" />
              Logout
            </Button>
          </>
        ) : (
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => setIsLoginModalOpen(true)}
          >
            Login
          </Button>
        )}
        <Link href="/shop">
          <Button variant="secondary" size="sm" className="flex items-center">
            <ShoppingCart className="mr-1 h-4 w-4" />
            Shop
          </Button>
        </Link>
      </div>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-heading font-bold mb-4">Login</h2>
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={loginForm.username}
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
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <Switch>
        <Route path="/" component={Home} />
        <Route path="/shop" component={Shop} />
        <Route path="/admin" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
    </UserContext.Provider>
  );
}

export default App;
