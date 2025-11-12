import AllEtapas from "../etapas/allEtapas";
import Rectangle from "../landingPage/rectangle";
import { useState, useEffect } from "react";
import { useEtapas } from "../../contexts/etapasContext";

const LandingPage = () => {
    const ongName = localStorage.getItem("name");
    const [etapas, setEtapas] = useState([]);
    const { setHasEtapas } = useEtapas();
    const permissionsString = localStorage.getItem("permissions");
    const permissions = permissionsString == "true";

    useEffect(() => {
        getEtapas();
    }, []);

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
            console.error("Error getting etapas:", error);
        }
    };

    return (
        <div className="bg-gray-100 pt-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 ml-8">Hola, {ongName}</h1>
            <div className="flex h-screen">
                <div className="w-1/3 p-6">
                    <AllEtapas etapas={etapas} onEtapaChange={getEtapas} />
                </div>

                <div className={`w-2/3 grid grid-rows-${permissions == true ? "3" : "2"} gap-6 p-6`}>
                    <Rectangle title="Crear proyecto" redirect={"/cargarProyecto"} />
                    <Rectangle title="Mis proyectos" redirect={"/myProjects"} />
                    {permissions == true && (
                        <Rectangle title="Crear observaciones" redirect="/allProjects" icon="pencil" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;