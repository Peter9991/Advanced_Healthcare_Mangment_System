import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth.service';
import type { User, LoginRequest } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          // Token invalid, clear storage
          authService.logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    // Clear any patient tokens before staff login to avoid conflicts
    localStorage.removeItem('patient_token');
    
    const loginResponse = await authService.login(credentials);
    // Token is now stored in localStorage by authService.login()
    // Verify token is stored before proceeding
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not stored after login');
    }
    
    // Fetch full user details with the new token
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error: any) {
      // If getCurrentUser fails, try to use the user from login response
      const storedUser = authService.getStoredUser();
      if (storedUser) {
        // Use stored user as fallback (might not have role_name, but we'll fetch it later)
        setUser(storedUser);
        // Try to fetch full user details in background (non-blocking)
        authService.getCurrentUser()
          .then(fullUser => setUser(fullUser))
          .catch(() => {
            // If it still fails, keep the stored user
          });
      } else {
        // If we have login response data, use it
        if (loginResponse?.user) {
          setUser(loginResponse.user as User);
        } else {
          throw error;
        }
      }
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

