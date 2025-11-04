import { useState } from "react";

const EtapaInfo = ({ etapa }) => {
    const [deploy, setDeploy] = useState(false);
    const propertiesClosed = "h-20";
    const propertiesOpen = "h-40";
    const [properties, setProperties] = useState(propertiesClosed);

    const deployEtapa = () => {
        setDeploy(!deploy);
        if (deploy) {
            setProperties(propertiesClosed);
        }
        else {
            setProperties(propertiesOpen);
        }
    }

    let backgroundColor;
    if (etapa.estado === "publicada") {
        backgroundColor = "bg-gray-200";
    } else if (etapa.estado === "ejecutandose") {
        backgroundColor = "bg-blue-200";
    } else if (etapa.estado === "cubierta") {
        backgroundColor = "bg-green-200";
    } else {
        backgroundColor = "bg-yellow-200";
    }

    return (
        <div className={`m-2 ${backgroundColor} w-full p-6 ${properties} cursor-pointer rounded-2xl`} onClick={() => deployEtapa()}>
            <div className="flex flex-row justify-between">
                <h1 className="text-2xl font-bold text-gray-800"> {etapa.titulo} </h1>
                {!deploy && (
                    <button> &#9660;</button>
                )}
                {deploy && (
                    <button> &#9650;</button>
                )}
            </div>
            {deploy && (
                <>
                    <p className="text-sm"> {etapa.descripcion}</p>
                </>
            )}
        </div>
    );
}

export default EtapaInfo;