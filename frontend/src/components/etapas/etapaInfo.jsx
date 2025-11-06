import { useState } from "react";

const EtapaInfo = ({ etapa }) => {
    const [deploy, setDeploy] = useState(false);
    const propertiesClosed = "h-20";
    const [properties, setProperties] = useState(propertiesClosed);
    const backgrounds = {
        "publicada": "bg-gray-200",
        "ejecutandose": "bg-blue-200",
        "cubierta": "bg-yellow-200",
        "terminada": "bg-green-200"
    }
    const backgroundColor = backgrounds[etapa.estado]

    const deployEtapa = () => {
        setDeploy(!deploy);
        if (deploy) {
            setProperties(propertiesClosed);
        }
        else {
            const propertiesOpen = etapa.estado == "cubierta" || etapa.estado == "terminada" ? "h-44" : "h-40";
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
                            <p> Cubierta por: nombre ONG</p>
                        )}
                        {etapa.estado == "terminada" && (
                            // aca van las fechas de ejecucion de la etapa
                            <p> Se llevó a cabo desde fecha_inicio hasta fecha_fin </p>
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