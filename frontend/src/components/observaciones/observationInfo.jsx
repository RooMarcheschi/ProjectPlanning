import { useState } from "react";

const ObservationInfo = ({ observacion }) => {
    const [deploy, setDeploy] = useState(false);
    const propertiesClosed = "h-20";
    const propertiesOpen = "h-auto";
    const [properties, setProperties] = useState();
    const fechaCreacion = new Date(observacion.fecha_creacion);
    const fechaResolucion = observacion.fecha_resolucion ? new Date(observacion.fecha_resolucion) : new Date();
    const hoy = new Date();
    const diffTime = fechaResolucion - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let backgroundColor;
    if (observacion.resuelto) {
        backgroundColor = "bg-green-200";
    } else if (diffDays > 0) {
        backgroundColor = "bg-gray-200";
    } else {
        backgroundColor = "bg-red-400"
    }

    const deployObservacion = () => {
        setDeploy(!deploy);
        if (deploy) {
            setProperties(propertiesClosed);
        }
        else {
            setProperties(propertiesOpen);
        }
    }

    return (
        <div className={`${backgroundColor} w-full mt-6 p-6 ${properties} cursor-pointer rounded-2xl transition-all duration-500 ease-in-out overflow-hidden`} onClick={() => deployObservacion()}>
            <div className="flex flex-row justify-between">
                <h1 className="text-2xl font-bold text-gray-800"> Observación: {observacion.descripcion} </h1>
                <button> {deploy ? "▲" : "▼"}</button>
            </div>

            <div className={`transition-opacity duration-500 ease-in-out ${deploy ? "opacity-100 mt-2" : "opacity-0 h-0"}`}>
                {deploy && (
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col">
                            <p>La observación fue realizada al proyecto {observacion.nombre_proyecto}.</p>
                            {observacion.resuelto ? (
                                <p className="text-green-600 mt-2"> La observación fue resuelta!</p>
                            ) : (diffDays > 0 ? (
                                <p className="text-red-600 mt-2">
                                    Quedan {diffDays} día{diffDays !== 1 ? "s" : ""} para resolver esta observación.
                                </p>
                            ) : (
                            <strong className="mt-2">
                                Esta observación ya no puede ser resuelta.
                            </strong>
                            ))}
                            <p className="text-gray-600 mb-2 text-sm mt-2">
                                Fecha de creación: {fechaCreacion.toLocaleDateString('es-AR')}
                            </p>
                            <p className="text-gray-600 mb-4 text-sm">
                                Fecha de resolución: {fechaResolucion.toLocaleDateString('es-AR')}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ObservationInfo;