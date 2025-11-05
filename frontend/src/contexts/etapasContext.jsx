import { createContext, useContext, useState, useMemo } from "react";

const EtapasContext = createContext();

export const EtapasProvider = ({ children }) => {
  const [hasEtapas, setHasEtapas] = useState(false);

  const value = useMemo(() => ({ hasEtapas, setHasEtapas }), [hasEtapas]);

  return (
    <EtapasContext.Provider value={value}>
      {children}
    </EtapasContext.Provider>
  );
};

export const useEtapas = () => useContext(EtapasContext);
