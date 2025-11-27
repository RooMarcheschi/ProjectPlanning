import { createContext, useContext, useState, useMemo, useEffect } from "react";

const EtapasContext = createContext();

export const EtapasProvider = ({ children }) => {
  const [hasEtapas, setHasEtapas] = useState(false);
  const [hasObservaciones, setHasObservaciones] = useState(false);
  const [etapas, setEtapasData] = useState([]);

  const token = localStorage.getItem("token");
  const id = Number(localStorage.getItem("id"));

  const fetchEtapas = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8001/etapas", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setEtapasData(data);
        setHasEtapas(data.length > 0);
      }
    } catch (error) {
      console.log("Error getting etapas", error);
    }
  };

  const fetchObservaciones = async () => {
    if (!token || !id) {
      return;
    }
    try {
      const res = await fetch(`http://localhost:8001/proyectos/tengo_observaciones?id_ong=${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.has_observations) {
        setHasObservaciones(true);
      }
    } catch (e) {
      console.log("Error obteniendo observaciones", e);
    }
  };

  useEffect(() => {
    fetchObservaciones();
    fetchEtapas();
  }, [token, id]);

  const value = useMemo(
    () => ({
      hasEtapas,
      setHasEtapas,
      hasObservaciones,
      setHasObservaciones,
      etapas,
      fetchEtapas
    }),
    [hasEtapas, hasObservaciones, etapas]
  );

  return <EtapasContext.Provider value={value}>{children}</EtapasContext.Provider>;
};

export const useEtapas = () => useContext(EtapasContext);