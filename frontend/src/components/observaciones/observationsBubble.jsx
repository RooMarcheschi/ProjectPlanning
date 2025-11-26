import { useState } from "react";
import BlueButton from "../buttons/blueButton";
import GreenButton from "../buttons/greenButton";
import RedButton from "../buttons/redButton";

const ObservationBubble = ({ observacion, onResolve, estado }) => {
    const [show, setShow] = useState(false);
    const fechaCreacion = new Date(observacion.fecha_creacion);
    const fechaResolucion = observacion.fecha_resolucion ? new Date(observacion.fecha_resolucion) : new Date();
    const hoy = new Date();
    const diffTime = fechaResolucion - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return (
        <div className="flex flex-row items-start gap-2 mb-4 w-full"> 
            <div className="text-3xl flex-shrink-0">👤</div> 
            
            <div className="relative bg-white border border-gray-300 rounded-xl p-3 shadow flex-1 min-w-0">
                <p className="text-gray-900 text-sm break-words">{observacion.descripcion}</p>

                <span className="absolute -left-2 top-3 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-300"></span>

                <p className="text-gray-600 text-xs mt-2">
                    Fecha de creación: {fechaCreacion.toLocaleDateString("es-AR")}
                </p>
                
                {(diffDays > 0 && estado !== "terminado") ? (
                    <>
                        <p className="text-red-600 text-xs mt-2">
                            Te quedan {diffDays} día{diffDays !== 1 ? "s" : ""} para resolver esta observación.
                        </p>
                        {!show && (
                            <BlueButton
                                classAttr="mt-3 text-sm text-white px-3 py-1 rounded w-full"
                                text="Resolver"
                                onClickFunction={() => setShow(true)}
                            />
                        )}
                        {show && (
                            <div className="flex flex-wrap gap-2 mt-3 justify-end"> 
                                <RedButton text={"Cancelar"} onClickFunction={() => setShow(false)} classAttr="text-xs flex-grow" />
                                <GreenButton text={"Resolver"} onClickFunction={() => onResolve()} classAttr="text-xs flex-grow" />
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-red-600 text-xs mt-2">
                        Ya no podés resolver esta observación.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ObservationBubble;