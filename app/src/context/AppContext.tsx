import { createContext, useState, ReactNode } from 'react';

interface AppContextProps {
  user: string | null;
  setUser: (user: string | null) => void;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};
