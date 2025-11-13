import AllEtapas from "../etapas/allEtapas";
import Rectangle from "../landingPage/rectangle";
import { useState, useEffect } from "react";
import { useEtapas } from "../../contexts/etapasContext";
import { toast } from "react-toastify";

const LandingPage = () => {
    const ongName = localStorage.getItem("name");
    const [permissions, setPermissions] = useState(false);
    const [etapas, setEtapas] = useState([]);
    const { setHasEtapas } = useEtapas();
    const token = localStorage.getItem("token");
    const [message, setMessage] = useState("Como ONG, vas a poder crear y colaborar a otros proyectos.");

    useEffect(() => {
        hasPermissions();
        getEtapas();
    }, []);

    const hasPermissions = async () => {
        try {
            const response = await fetch("http://localhost:8001/auth/validateUser", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success && data.permissions) {
                setPermissions(true);
                setMessage("Como gerente, vas a poder crear proyectos, colaborar, escribir observaciones y ver reportes.");
            }
        } catch (error) {
            toast.error(`Error getting permissions : ${error}`, {
                position: "bottom-right",
                autoClose: 4000,
            });
        }
    }

    const getEtapas = async () => {
        try {
            //const res = await fetch(`http://localhost:8001/etapas?name=${encodeURIComponent(ongName)}`);
            const res = await fetch("http://localhost:8001/etapas", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            setEtapas(data);
            setHasEtapas(data.length > 0);
        } catch (error) {
            toast.error("Error getting etapas", {
                position: "bottom-right",
                autoClose: 4000,
            })
        }
    };

    return (
        <div className="bg-gray-100 pt-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 ml-8">Hola, {ongName}</h1>
            <h2 className="text-xl font-bold text-blue-800 mb-6 ml-8"> {message} </h2>
            <div className="flex h-screen">
                <div className="w-1/3 p-6">
                    <AllEtapas etapas={etapas} onEtapaChange={getEtapas} />
                </div>

                <div
                    className={`w-2/3 grid ${permissions ? "grid-rows-2 grid-cols-2" : "grid-rows-2 grid-cols-1"
                        } gap-6 p-6`}
                >
                    <Rectangle title="Crear proyecto" redirect={"/cargarProyecto"} />
                    <Rectangle title="Mis proyectos" redirect={"/myProjects"} />
                    {permissions && (
                        <>
                            <Rectangle title="Crear observaciones" redirect="/allProjects" icon="pencil" />
                            <Rectangle title="Ver reportes" redirect="/" icon="report" />
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

export default LandingPage;