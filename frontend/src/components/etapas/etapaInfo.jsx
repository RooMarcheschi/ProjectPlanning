import { useState } from "react";

const EtapaInfo = ({ etapa }) => {
    const [deploy, setDeploy] = useState(false);
    const propertiesClosed = "h-20";
    const [properties, setProperties] = useState(propertiesClosed);
    const backgrounds = {
        "publicada": "bg-gray-300",
        "cubierta": "bg-green-200",
        "ejecutandose": "bg-orange-200",
        "terminada": "bg-blue-200"
    };
    const backgroundColor = backgrounds[etapa.estado];

    const deployEtapa = () => {
        setDeploy(!deploy);
        if (deploy) {
            setProperties(propertiesClosed);
        }
        else {
            const propertiesOpen = "h-48";
            setProperties(propertiesOpen);
        }
    }

    return (
        <div className={`m-2 ${backgroundColor} w-full p-6 ${properties} cursor-pointer rounded-2xl transition-all duration-500 ease-in-out overflow-hidden`} onClick={() => deployEtapa()}>
            <div className="flex flex-row justify-between">
                <h1 className="text-2xl font-bold text-gray-800"> Etapa: {etapa.titulo} </h1>
                <button> {deploy ? "▲" : "▼"}</button>
            </div>

            <div className={`transition-opacity duration-500 ease-in-out ${deploy ? "opacity-100 mt-2" : "opacity-0 h-0"}`}>
                {deploy && (
                    <div>
                        <p>Descripción: {etapa.descripcion}</p>
                        <p>Estado: {etapa.estado[0].toUpperCase() + etapa.estado.slice(1)}</p>
                        {etapa.estado == "cubierta" && (
                            // aca va el nombre de la ONG que se comprometio con la etapa
                            <p> Cubierta por: {etapa.ong_comprometida_name}</p>
                        )}
                        {etapa.estado == "ejecutandose" && (
                            <>
                                <p> Cubierta por: {etapa.ong_comprometida_name}</p>
                                <p> Se está llevando a cabo desde el {new Date(etapa.fecha_inicio).toLocaleDateString('es-AR')} </p>
                            </>
                        )}
                        {etapa.estado == "terminada" && (
                            <p> Se llevó a cabo desde el {new Date(etapa.fecha_inicio).toLocaleDateString('es-AR')} hasta el {new Date(etapa.fecha_fin).toLocaleDateString('es-AR')} </p>
                        )}
                        <p className="text-gray-600 mb-4 text-sm mt-2">
                            Fecha de creación: {new Date(etapa.fecha_creacion).toLocaleDateString('es-AR')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EtapaInfo;