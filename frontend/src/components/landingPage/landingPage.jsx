import AllEtapas from "../etapas/allEtapas";
import Rectangle from "../landingPage/rectangle";
import { useState, useEffect } from "react";
import { useEtapas } from "../../contexts/etapasContext"; 
import { toast } from "react-toastify";

const LandingPage = () => {
    const ongName = localStorage.getItem("name");
    const [permissions, setPermissions] = useState(false);
    const { etapas, fetchEtapas } = useEtapas();
    const token = localStorage.getItem("token");
    const [message, setMessage] = useState("Como ONG, vas a poder crear y comprometerte a otros proyectos.");

    useEffect(() => {
        hasPermissions();
        fetchEtapas();
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
                setMessage("Como miembro del consejo directivo, vas a poder crear proyectos, comprometerte, escribir observaciones y ver reportes.");
            }
        } catch (error) {
            toast.error(`Error getting permissions : ${error}`, {
                position: "bottom-right",
                autoClose: 4000,
            });
        }
    }


    return (
        <div className="bg-gray-100 pt-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 ml-8">Hola, {ongName}👋</h1>
            <h2 className="text-xl font-bold text-blue-800 mb-6 ml-8"> {message} </h2>
            <div className="flex h-screen">
                <div className="w-1/3 p-6">
                    <AllEtapas etapas={etapas} onEtapaChange={fetchEtapas} />
                </div>

                <div className={`w-2/3 grid ${permissions ? "grid-rows-3 grid-cols-2" : "grid-rows-3 grid-cols-1"} gap-6 p-6`}>
                    <Rectangle title="Crear proyecto" redirect={"/cargarProyecto"} />
                    {permissions && (
                        <Rectangle title="Crear observaciones" redirect="/allProjects" icon="pencil" />
                    )}
                    <Rectangle title="Mis proyectos" redirect={"/myProjects"} />
                    {permissions && (
                        <Rectangle title="Mis observaciones" redirect="/misObservaciones" icon="observations" />
                    )}
                    <Rectangle title="Mis compromisos" redirect={"/misCompromisos"} icon={"commitments"} />
                    {permissions && (
                        <Rectangle title="Ver reportes" redirect="/consultas" icon="report" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;