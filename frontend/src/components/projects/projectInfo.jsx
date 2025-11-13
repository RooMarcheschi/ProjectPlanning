import { useState } from "react";
import GreenButton from "../buttons/greenButton";
import BlueButton from "../buttons/blueButton";
import RedButton from "../buttons/redButton";
import { toast } from "react-toastify";

const ProjectInfo = ({ project }) => {
    const [deploy, setDeploy] = useState(false);
    const [buttons, setButtons] = useState(false);
    const [text, setText] = useState("");
    const propertiesClosed = "h-20";
    const propertiesOpen = "h-auto";
    const [properties, setProperties] = useState(propertiesClosed);
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    const backgrounds = {
        "publicado": "bg-gray-300",
        "ejecutandose": "bg-orange-300",
    };
    const backgroundColor = backgrounds[project.estado];

    const deployEtapa = () => {
        setDeploy(!deploy);
        if (deploy) {
            setProperties(propertiesClosed);
        }
        else {
            setProperties(propertiesOpen);
        }
    }

    const sendObservation = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!text || typeof text != "string" || text.trim() == "") {
            toast.error("Descripción inválida", {
                position: "bottom-right",
                autoClose: 3000,
            });
            return;
        }

        const bodyJSON = {
            "proyecto_id": project.id,
            "observante_id": id,
            "descripcion": text,
        }
        try {
            const response = await fetch("http://localhost:8001/observaciones/realizar_observacion", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(bodyJSON),
            })

            const data = await response.json();
            if (data.success) {
                toast.success("Observación enviada correctamnte!", {
                    position: "bottom-right",
                    autoClose: 3000,
                });
            }
            else {
                toast.error(`Error al enviar la observación: ${data.detail.message}`, {
                    position: "bottom-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            toast.error("Error al enviar la observación", {
                position: "bottom-right",
                autoClose: 3000,
            });
        }
        setButtons(false);
        setText("");
    }

    return (
        <div className={`${backgroundColor} w-full mt-6 p-6 ${properties} cursor-pointer rounded-2xl transition-all duration-500 ease-in-out overflow-hidden`} onClick={() => deployEtapa()}>
            <div className="flex flex-row justify-between">
                <h1 className="text-2xl font-bold text-gray-800"> Proyecto: {project.titulo} </h1>
                <button> {deploy ? "▲" : "▼"}</button>
            </div>

            <div className={`transition-opacity duration-500 ease-in-out ${deploy ? "opacity-100 mt-2" : "opacity-0 h-0"}`}>
                {deploy && (
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col">
                            <p>Descripción: {project.descripcion}</p>
                            <p>Publicado por: {project.nombre_usuario}</p>
                            <p>Estado: {project.estado[0].toUpperCase() + project.estado.slice(1)}</p>
                            <p className="text-gray-600 mb-4 text-sm mt-2">
                                Fecha de creación: {new Date(project.fecha_creacion).toLocaleDateString('es-AR')}
                            </p>
                        </div>

                        <div className="flex items-center justify-end">
                            {buttons && (
                                <form className="flex flex-col">
                                    <textarea onClick={(e) => e.stopPropagation()} placeholder="Escribí tus observaciones" id="descriptionObservation" onChange={(e) => setText(e.target.value)} value={text} required
                                        className="border-2 border-blue-400 h-24 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-600 transition hover:border-blue-500"
                                    ></textarea>
                                    <div className="flex flex-row px-4 py-2 items-center justify-between">
                                        <RedButton text={"Cancelar"} classAttr={"mr-20"} onClickFunction={(e) => { e.stopPropagation(); setButtons(false) }} />
                                        <GreenButton text={"Enviar observación"} onClickFunction={(e) => sendObservation(e)} />
                                    </div>
                                </form>
                            )}
                            {!buttons && (
                                <BlueButton text={"Escribir observación"} onClickFunction={(e) => {
                                    e.stopPropagation();
                                    setButtons(true);
                                }} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProjectInfo;