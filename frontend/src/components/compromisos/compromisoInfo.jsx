import { useState } from "react";
import BlueButton from "../buttons/blueButton";
import GreenButton from "../buttons/greenButton";
import RedButton from "../buttons/redButton";
import { toast } from "react-toastify";

const CompromisoInfo = ({ compromiso, refreshFunction }) => {
    const [deploy, setDeploy] = useState(false);
    const propertiesClosed = "h-20";
    const [properties, setProperties] = useState(propertiesClosed);
    const backgrounds = {
        "comprometido": "bg-gray-300",
        "ejecutandose": "bg-orange-200",
        "terminado": "bg-blue-200"
    };
    const backgroundColor = backgrounds[compromiso.estado];
    const [show, setShow] = useState(false);
    const token = localStorage.getItem("token");

    const deployCompromiso = () => {
        setDeploy(!deploy);
        if (deploy) {
            setProperties(propertiesClosed);
        }
        else {
            const propertiesOpen = compromiso.estado == "ejecutandose" ? "h-52" : "h-40";
            setProperties(propertiesOpen);
        }
    }

    const terminarCompromiso = async (e) => {
        e.stopPropagation();
        const bodyJSON = {
            "compromiso_id": compromiso.id,
            "proyecto_id": compromiso.id_proyecto,
        };
        try {
            const response = await fetch("http://localhost:8001/compromisos/terminar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(bodyJSON)
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Compromiso terminado correctamente!", {
                    position: "bottom-right",
                    autoClose: 3000,
                });
                refreshFunction();
            } else {
                toast.error(`Error al terminar el compromiso ${data.detail}`, {
                    position: "bottom-right",
                    autoClose: 3000,
                })
            }
        } catch (error) {
            toast.error(`Error al terminar el compromiso ${error}`, {
                position: "bottom-right",
                autoClose: 3000,
            })
        }
        setShow(false);
    }

    return (
        <div className={`m-2 ${backgroundColor} w-full p-6 ${properties} cursor-pointer rounded-2xl transition-all duration-500 ease-in-out overflow-hidden`}
            onClick={() => deployCompromiso()}>
            <div className="flex flex-row justify-between">
                <h1 className="text-2xl font-bold text-gray-800"> Te comprometiste con {compromiso.titulo_proyecto} </h1>
                <button> {deploy ? "▲" : "▼"}</button>
            </div>

            <div className={`transition-opacity duration-500 ease-in-out ${deploy ? "opacity-100 mt-2" : "opacity-0 h-0"}`}>
                {deploy && (
                    <>
                        <div>
                            {compromiso.estado == "comprometido" && (
                                <p> Vas a ayudar en la etapa {compromiso.titulo_etapa}</p>
                            )}
                            {compromiso.estado == "ejecutandose" && (
                                <p> Estás ayudando en la etapa {compromiso.titulo_etapa}</p>
                            )}
                            {compromiso.estado == "terminado" && (
                                <p> ¡Ayudaste en la etapa {compromiso.titulo_etapa}! </p>
                            )}
                            <p>Estado: {compromiso.estado[0].toUpperCase() + compromiso.estado.slice(1)}</p>
                            <p className="text-gray-600 mb-4 text-sm mt-2">
                                Fecha de creación: {new Date(compromiso.fecha_creacion).toLocaleDateString('es-AR')}
                            </p>
                        </div>
                        {compromiso.estado == "ejecutandose" && (
                            <div className="flex items-center justify-end">
                                {show && (
                                    <div className="flex flex-col">
                                        <div className="flex flex-row items-center justify-between">
                                            <RedButton text={"Cancelar"} classAttr={"mr-20"} onClickFunction={(e) => { e.stopPropagation(); setShow(false) }} />
                                            <GreenButton text={"Terminar compromiso"} onClickFunction={(e) => terminarCompromiso(e)} />
                                        </div>
                                    </div>
                                )}
                                {!show && (
                                    <BlueButton text={"Terminar"} onClickFunction={(e) => {
                                        e.stopPropagation();
                                        setShow(true);
                                    }} />
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default CompromisoInfo;