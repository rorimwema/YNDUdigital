import { useState, useEffect, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, UserIcon, LogOut, ShoppingCart, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/App";
import { authService } from "@/utils/auth";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [signupError, setSignupError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [location, navigate] = useLocation();
  
  // Get user context
  const { user, isLoggedIn, login, logout, isAdmin } = useContext(UserContext);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  // Handle login form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle signup form input changes
  const handleSignupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm(prev => ({ ...prev, [name]: value }));
    setSignupError(""); // Clear error when user types
  };
  
  // Handle signup form submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    
    try {
      // Use the authService to sign up
      const { user, error } = await authService.signUp(
        signupForm.email, 
        signupForm.password, 
        {
          username: `${signupForm.firstName.toLowerCase()}_${signupForm.lastName.toLowerCase()}`,
          firstName: signupForm.firstName,
          lastName: signupForm.lastName
        }
      );
      
      if (error) throw error;
      
      // Success - close modal and show message
      setIsSignupModalOpen(false);
      alert('Registration successful! Please check your email to confirm your account.');
      
      // Clear form
      setSignupForm({ firstName: "", lastName: "", email: "", password: "" });
      
    } catch (error: any) {
      console.error('Signup error:', error.message);
      setSignupError(error.message || 'An error occurred during signup');
    }
  };

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    
    try {
      // Use the login method from UserContext which uses authService
      const { error } = await login(loginForm.email, loginForm.password);
      
      if (error) throw error;
      
      setIsLoginModalOpen(false);
      // Clear form
      setLoginForm({ email: "", password: "" });
    } catch (error: any) {
      console.error('Login error:', error.message);
      setLoginError(error.message || 'Invalid email or password');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Use the logout method from UserContext which uses authService
      const { error } = await logout();
      if (error) throw error;
    } catch (error: any) {
      console.error('Logout error:', error.message);
      alert('Logout failed: ' + error.message);
    }
  };
  
  // Check if we're on the shop page
  const isShopPage = location === '/shop';

  return (
    <header className={`fixed top-0 left-0 right-0 bg-white bg-opacity-95 z-50 transition-all duration-300 ${isScrolled ? "py-3 shadow-lg" : "py-4"}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {isShopPage && (
              <Link href="/" className="mr-2">
                <Button variant="ghost" size="sm" className="flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              </Link>
            )}
            <div className="text-primary font-heading font-bold text-lg sm:text-2xl">YNDU FOUNTAIN</div>
            <span className="hidden sm:inline-block text-sm font-medium text-neutral-500">|</span>
            <div className="hidden sm:inline-block text-sm font-medium text-neutral-500">Small Farms. Big Ideas.</div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-5 lg:space-x-8">
            <Link href="/" className="font-medium text-neutral-700 hover:text-primary transition-colors text-base">Home</Link>
            <Link href="/shop" className="font-medium text-neutral-700 hover:text-primary transition-colors text-base">Shop</Link>
            {isShopPage ? (
              <>
                <Link href="/#about" className="font-medium text-neutral-700 hover:text-primary transition-colors text-base">About</Link>
                <Link href="/#produce" className="font-medium text-neutral-700 hover:text-primary transition-colors text-base">Our Produce</Link>
                <Link href="/#features" className="font-medium text-neutral-700 hover:text-primary transition-colors text-base">Features</Link>
                <Link href="/#gallery" className="font-medium text-neutral-700 hover:text-primary transition-colors text-base">Gallery</Link>
                <Link href="/#contact" className="font-medium text-neutral-700 hover:text-primary transition-colors text-base">Contact</Link>
              </>
            ) : (
              <>
                <a href="#about" className="font-medium text-neutral-700 hover:text-primary transition-colors text-base">About</a>
                <a href="#produce" className="font-medium text-neutral-700 hover:text-primary transition-colors text-base">Our Produce</a>
                <a href="#features" className="font-medium text-neutral-700 hover:text-primary transition-colors text-base">Features</a>
                <a href="#gallery" className="font-medium text-neutral-700 hover:text-primary transition-colors text-base">Gallery</a>
                <a href="#contact" className="font-medium text-neutral-700 hover:text-primary transition-colors text-base">Contact</a>
              </>
            )}
            {isAdmin && (
              <Link href="/admin" className="font-medium text-primary hover:text-primary/80 transition-colors text-base">Admin</Link>
            )}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-3">
            {/* Shop Icon */}
            <Link href="/shop">
              <div className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <ShoppingCart className="h-5 w-5 text-neutral-700" />
              </div>
            </Link>
            
            {/* User Icon - opens login modal if not logged in */}
            <div 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer relative"
              onClick={() => isLoggedIn ? null : setIsLoginModalOpen(true)}
            >
              {isLoggedIn ? (
                <div className="relative group">
                  <UserIcon className="h-5 w-5 text-primary" />
                  
                  {/* User dropdown menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <p className="font-medium">{user?.username || `User #${user?.id}`}</p>
                    </div>
                    
                    {isAdmin && (
                      <Link href="/admin">
                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                          <UserIcon className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </div>
                      </Link>
                    )}
                    
                    <div 
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </div>
                  </div>
                </div>
              ) : (
                <UserIcon className="h-5 w-5 text-neutral-700" />
              )}
            </div>
          </div>

          {/* Mobile Navigation Toggle */}
          <button 
            aria-label="Toggle Mobile Menu" 
            onClick={toggleMobileMenu} 
            className="md:hidden text-neutral-700 focus:outline-none ml-2"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white shadow-lg absolute w-full z-50"
          >
            <div className="container mx-auto px-4 py-2">
              <nav className="flex flex-col space-y-3 py-3">
                <Link href="/" onClick={closeMobileMenu} className="font-medium text-neutral-700 hover:text-primary transition-colors py-2 border-b border-neutral-100">Home</Link>
                <Link href="/shop" onClick={closeMobileMenu} className="font-medium text-neutral-700 hover:text-primary transition-colors py-2 border-b border-neutral-100">Shop</Link>
                
                {isShopPage ? (
                  <>
                    <Link href="/#about" onClick={closeMobileMenu} className="font-medium text-neutral-700 hover:text-primary transition-colors py-2 border-b border-neutral-100">About</Link>
                    <Link href="/#produce" onClick={closeMobileMenu} className="font-medium text-neutral-700 hover:text-primary transition-colors py-2 border-b border-neutral-100">Our Produce</Link>
                    <Link href="/#features" onClick={closeMobileMenu} className="font-medium text-neutral-700 hover:text-primary transition-colors py-2 border-b border-neutral-100">Features</Link>
                    <Link href="/#gallery" onClick={closeMobileMenu} className="font-medium text-neutral-700 hover:text-primary transition-colors py-2 border-b border-neutral-100">Gallery</Link>
                    <Link href="/#contact" onClick={closeMobileMenu} className="font-medium text-neutral-700 hover:text-primary transition-colors py-2 border-b border-neutral-100">Contact</Link>
                  </>
                ) : (
                  <>
                    <a href="#about" onClick={closeMobileMenu} className="font-medium text-neutral-700 hover:text-primary transition-colors py-2 border-b border-neutral-100">About</a>
                    <a href="#produce" onClick={closeMobileMenu} className="font-medium text-neutral-700 hover:text-primary transition-colors py-2 border-b border-neutral-100">Our Produce</a>
                    <a href="#features" onClick={closeMobileMenu} className="font-medium text-neutral-700 hover:text-primary transition-colors py-2 border-b border-neutral-100">Features</a>
                    <a href="#gallery" onClick={closeMobileMenu} className="font-medium text-neutral-700 hover:text-primary transition-colors py-2 border-b border-neutral-100">Gallery</a>
                    <a href="#contact" onClick={closeMobileMenu} className="font-medium text-neutral-700 hover:text-primary transition-colors py-2 border-b border-neutral-100">Contact</a>
                  </>
                )}
                
                {isAdmin && (
                  <Link href="/admin" onClick={closeMobileMenu} className="font-medium text-primary hover:text-primary/80 transition-colors py-2 border-b border-neutral-100">
                    <div className="flex items-center">
                      <UserIcon className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </div>
                  </Link>
                )}
                
                {isLoggedIn && (
                  <div 
                    className="flex items-center font-medium text-red-500 hover:text-red-700 transition-colors py-2 border-b border-neutral-100 cursor-pointer"
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </div>
                )}
                
                {!isLoggedIn && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setIsSignupModalOpen(true);
                      closeMobileMenu();
                    }}
                    className="mt-2"
                  >
                    Sign Up
                  </Button>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-heading font-bold mb-4">Login</h2>
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                {loginError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{loginError}</span>
                  </div>
                )}
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
                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                    onClick={() => {
                      setIsLoginModalOpen(false);
                      setIsSignupModalOpen(true);
                    }}
                  >
                    Don't have an account? Sign up
                  </button>
                  <div className="flex space-x-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setIsLoginModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoggingIn}>
                      {isLoggingIn ? "Logging in..." : "Login"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {isSignupModalOpen && (
        <div className="fixed inset-0 z-[100]">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsSignupModalOpen(false)}
          ></div>
          <div className="relative z-10 bg-white rounded-lg p-6 w-full max-w-md mx-auto mt-20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-heading font-bold">Create an Account</h2>
              <button onClick={() => setIsSignupModalOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                {signupError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{signupError}</span>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={signupForm.firstName}
                      onChange={handleSignupInputChange}
                      className="w-full p-2 border border-neutral-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={signupForm.lastName}
                      onChange={handleSignupInputChange}
                      className="w-full p-2 border border-neutral-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={signupForm.email}
                    onChange={handleSignupInputChange}
                    className="w-full p-2 border border-neutral-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={signupForm.password}
                    onChange={handleSignupInputChange}
                    className="w-full p-2 border border-neutral-300 rounded-md"
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                    onClick={() => {
                      setIsSignupModalOpen(false);
                      setIsLoginModalOpen(true);
                    }}
                  >
                    Already have an account? Log in
                  </button>
                  <Button type="submit">
                    Sign Up
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
