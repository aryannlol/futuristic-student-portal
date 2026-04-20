import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserData {
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  semester: string;
}

interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('nexus_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const updateUser = (userData: UserData | null) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('nexus_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('nexus_user');
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser: updateUser, 
      isAuthenticated: !!user 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
