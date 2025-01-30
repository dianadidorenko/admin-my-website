import { createContext, useState, ReactNode, useEffect } from "react";

interface StoreContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
}

export const StoreContext = createContext<StoreContextProps | null>(null);

const StoreContextProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  const contextValue = {
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
