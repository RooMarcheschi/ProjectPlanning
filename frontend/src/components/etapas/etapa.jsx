import { useState } from "react";
import BlueButton from "../buttons/blueButton";
import GreenButton from "../buttons/greenButton";
import RedButton from "../buttons/redButton";
import { toast } from "react-toastify";

const Etapa = ({ etapa, onEtapaChange }) => {
    const [showButtonsRow, setShowButtonsRow] = useState(false);
    const token = localStorage.getItem("token");

    const generarCompromiso = async () => {
        const bodyPost = {
            etapa_id: etapa.id,
            proyecto_id: etapa.id_proyecto
        }
        try {
            const response = await fetch("http://localhost:8001/compromisos/asumir", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(bodyPost)
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Se ha generado correctamente el compromiso!", {
                    "position": "bottom-right",
                    "autoClose": "3000",
                })
                if (onEtapaChange) {
                    onEtapaChange();
                }
            } else {
                toast.error(`Error al generar el compromiso: ${data.detail}`, {
                    "position": "bottom-right",
                    "autoClose": "3000",
                })
            }
        } catch (error) {
            toast.error("Error al generar el compromiso", {
                "position": "bottom-right",
                "autoClose": "3000",
            })
        }
        setShowButtonsRow(false);
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-4 mb-3 border border-gray-300" id={etapa.id}>
            <h2 className="font-semibold text-lg text-blue-700">{etapa.titulo}</h2>
            <p className="text-sm text-gray-600">¡{etapa.username} necesita tu ayuda en su proyecto {etapa.project_name}! </p>
            <p className="text-gray-700 mt-2">{etapa.descripcion}</p>

            {!showButtonsRow ? (
                <div className="mt-3 flex justify-center">
                    <BlueButton text="Colaborar" onClickFunction={() => setShowButtonsRow(true)} />
                </div>
            ) : (
                <div className="flex flex-row px-4 py-2 items-center justify-between">
                    <RedButton text={"Cancelar"} onClickFunction={() => setShowButtonsRow(false)} />
                    <GreenButton text={"Generar compromiso"} onClickFunction={() => generarCompromiso()} />
                </div>
            )}
        </div>
    )
}

export default Etapa;