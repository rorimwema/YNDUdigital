import { supabase } from './supabase';
import { User, Session } from '@supabase/supabase-js';

export type AuthUser = {
  id: string;
  email: string;
  username?: string;
  role: string;
};

class AuthService {
  private user: AuthUser | null = null;
  private session: Session | null = null;
  private isMockUser: boolean = false;

  constructor() {
    // Set up auth state change listener
    supabase.auth.onAuthStateChange((event, session) => {
      this.session = session;
      if (session) {
        this.user = this.formatUser(session.user);
      } else {
        this.user = null;
      }
    });
  }

  /**
   * Format the user data from Supabase Auth
   */
  private formatUser(user: User | null): AuthUser | null {
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email || '',
      username: user.user_metadata.username || user.email?.split('@')[0] || '',
      role: user.user_metadata.role || 'customer'
    };
  }

  /**
   * Get the current session
   */
  async getSession(): Promise<Session | null> {
    const { data } = await supabase.auth.getSession();
    this.session = data.session;
    return this.session;
  }

  /**
   * Get the current user
   */
  async getUser(): Promise<AuthUser | null> {
    // If we have a mock user, return it directly
    if (this.isMockUser && this.user) {
      return this.user;
    }
    
    const { data } = await supabase.auth.getUser();
    this.user = this.formatUser(data.user);
    return this.user;
  }
  
  /**
   * Set a mock user for testing purposes
   */
  setMockUser(user: AuthUser): void {
    this.user = user;
    this.isMockUser = true;
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: Error | null }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error };
    }

    this.session = data.session;
    this.user = this.formatUser(data.user);
    
    return { user: this.user, error: null };
  }

  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string, userData: { 
    username: string;
    firstName?: string;
    lastName?: string;
  }): Promise<{ user: AuthUser | null; error: Error | null }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: userData.username,
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: 'customer' // Default role for new users
        }
      }
    });

    if (error) {
      return { user: null, error };
    }

    this.session = data.session;
    this.user = this.formatUser(data.user);
    
    return { user: this.user, error: null };
  }

  /**
   * Admin sign in
   */
  async adminSignIn(email: string, password: string): Promise<{ user: AuthUser | null; error: Error | null }> {
    const result = await this.signIn(email, password);
    
    if (result.error) {
      return result;
    }
    
    // Check if user has admin role
    if (result.user?.role !== 'admin') {
      await this.signOut(); // Sign out if not admin
      return { 
        user: null, 
        error: new Error('Access denied. Admin privileges required.') 
      };
    }
    
    return result;
  }

  /**
   * Sign out
   */
  async signOut(): Promise<{ error: Error | null }> {
    // If we have a mock user, just clear it
    if (this.isMockUser) {
      this.user = null;
      this.isMockUser = false;
      return { error: null };
    }
    
    const { error } = await supabase.auth.signOut();
    this.user = null;
    this.session = null;
    return { error };
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isMockUser || !!this.session;
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return (this.isMockUser || this.isAuthenticated()) && this.user?.role === 'admin';
  }
}

export const authService = new AuthService();
