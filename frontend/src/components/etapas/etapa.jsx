import { useState } from "react";
import BlueButton from "../buttons/blueButton";
import RedButton from "../buttons/redButton";
import GreenButton from "../buttons/greenButton";

function Etapa({ etapa }) {
    const [showButtonsRow, setShowButtonsRow] = useState(false);

    return (
        <div className="bg-white rounded-xl shadow-md p-4 mb-3 border border-gray-300">
            <h2 className="font-semibold text-lg text-blue-700">{etapa.titulo}</h2>
            <p className="text-sm text-gray-600">ONG: {etapa.ong}</p>
            <p className="text-gray-700 mt-2">{etapa.descripcion}</p>

            {!showButtonsRow ? (
                <div className="mt-3 flex justify-center">
                    <BlueButton text="Colaborar" onClickFunction={() => setShowButtonsRow(true)} />
                </div>
            ) : (
                <div className="flex flex-row px-4 py-2 items-center justify-between">
                    <RedButton text={"Cancelar"} onClickFunction={() => setShowButtonsRow(false)} />
                    <GreenButton text={"Generar compromiso"} />
                </div>
            )}
        </div>
    )
}

export default Etapa;