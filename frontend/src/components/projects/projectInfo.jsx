import { useState } from "react";
import GreenButton from "../buttons/greenButton";
import BlueButton from "../buttons/blueButton";
import RedButton from "../buttons/redButton";

const ProjectInfo = ({ project }) => {
    const [deploy, setDeploy] = useState(false);
    const [buttons, setButtons] = useState(false);
    const propertiesClosed = "h-20";
    const propertiesOpen = "h-auto";
    const [properties, setProperties] = useState(propertiesClosed);

    const backgrounds = {
        "publicado": "bg-gray-300",
        "ejecutandose": "bg-orange-300",
        "terminado": "bg-blue-300"
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

    const sendObservation = (e) => {
        e.stopPropagation();
        // fetch
        setButtons(false);
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
                                <div className="flex flex-col">
                                    <textarea onClick={(e) => e.stopPropagation()} placeholder="Escribí tus observaciones"
                                        className="border-2 border-blue-400 h-24 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-600 transition hover:border-blue-400"
                                    ></textarea>
                                    <div className="flex flex-row px-4 py-2 items-center justify-between">
                                        <RedButton text={"Cancelar"} classAttr={"mr-20"} onClickFunction={(e) => { e.stopPropagation(); setButtons(false) }} />
                                        <GreenButton text={"Enviar observación"}  onClickFunction={(e) => sendObservation(e)}/>
                                    </div>
                                </div>
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