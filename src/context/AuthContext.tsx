import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthState, User } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const defaultAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const AuthContext = createContext<AuthContextType>({
  ...defaultAuthState,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('weatherUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('weatherUser');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // For demo purposes, we'll simulate authentication
    // In a real app, this would call an authentication API
    try {
      // Simple validation
      if (!email || !password) {
        return false;
      }

      // Look for the user in localStorage
      const usersJson = localStorage.getItem('weatherUsers');
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];
      
      const user = users.find(u => u.email === email);
      
      // Check if user exists and password is correct
      // NOTE: In a real app, NEVER store passwords in localStorage or check them client-side
      const storedPasswords = localStorage.getItem('weatherPasswords');
      const passwords: Record<string, string> = storedPasswords ? JSON.parse(storedPasswords) : {};
      
      if (!user || passwords[user.id] !== password) {
        return false;
      }

      // Set auth state
      setAuthState({
        user,
        isAuthenticated: true,
      });

      // Store user in localStorage for persistence
      localStorage.setItem('weatherUser', JSON.stringify(user));
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // For demo purposes, we'll simulate user registration
    try {
      // Simple validation
      if (!name || !email || !password) {
        return false;
      }

      // Get existing users or initialize empty array
      const usersJson = localStorage.getItem('weatherUsers');
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];
      
      // Check if email already exists
      if (users.some(u => u.email === email)) {
        return false;
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
      };

      // Add user to users array
      users.push(newUser);
      localStorage.setItem('weatherUsers', JSON.stringify(users));
      
      // Store password separately
      // NOTE: In a real app, NEVER store passwords in localStorage or in plain text
      const storedPasswords = localStorage.getItem('weatherPasswords');
      const passwords: Record<string, string> = storedPasswords ? JSON.parse(storedPasswords) : {};
      passwords[newUser.id] = password;
      localStorage.setItem('weatherPasswords', JSON.stringify(passwords));

      // Set auth state
      setAuthState({
        user: newUser,
        isAuthenticated: true,
      });

      // Store user in localStorage for persistence
      localStorage.setItem('weatherUser', JSON.stringify(newUser));
      
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
    });
    localStorage.removeItem('weatherUser');
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};