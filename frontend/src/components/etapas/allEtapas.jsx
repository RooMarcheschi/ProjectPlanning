import { useEffect } from "react";
import { useState } from "react";
import Etapa from "./etapa";
import { toast } from "react-toastify";


function AllEtapas() {
    const ongName = localStorage.getItem("name");
    const [etapas, setEtapas] = useState([]);

    useEffect(() => {
        getEtapas();
    }, []);

    const getEtapas = async () => {
        try {
            const etapas = await fetch(`http://localhost:8000/etapas?name=${encodeURIComponent(ongName)}`).then(res => res.json());
            setEtapas(etapas);
        } catch (error) {
            toast.error(`Error getting etapas: ${error}`, {
                position: "bottom-right",
                autoClose: 4000,
            })
        }
    }

    return (
        <div className="flex flex-col h-full border border-gray-400 rounded-2xl shadow-lg bg-blue-100 p-4 overflow-y-auto overflow-x-hidden">
            <h1 className="text-xl font-bold text-blue-700 mb-3 text-center">
                Colaborar a otros proyectos
            </h1>

            {etapas.map(etapa => (
                <Etapa etapa={etapa} key={etapa.id} />
            ))}
        </div>
    )
}

export default AllEtapas;