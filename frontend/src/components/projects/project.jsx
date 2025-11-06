import BlueButton from "../buttons/blueButton";
import CircularProgress from "./circularProgress";
import EtapaInfo from "../etapas/etapaInfo";
import LinkButton from "../buttons/linkButton"
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Project = () => {
    const { id: projectId } = useParams();
    const token = localStorage.getItem("token");
    const [project, setProject] = useState();
    const [etapas, setEtapas] = useState([]);

    useEffect(() => {
        getProject();
        getEtapas();
    }, [])

    const getProject = async () => {
        try {
            const response = await fetch(`http://localhost:8001/proyectos/${projectId}`, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await response.json()

            if (data.success) {
                setProject(data.project);
            }
            else {
                toast.error("Error al conseguir la información del proyecto", {
                    position: "bottom-right",
                    autoClose: 2000,
                });
                setTimeout(() => { window.location.href = "/myProjects" }, 2000)
            }
        } catch (error) {
            toast.error("Error al conseguir la información del proyecto", {
                position: "bottom-right",
                autoClose: 2000
            });
            setTimeout(() => { window.location.href = "/myProjects" }, 2000)
        }
    }

    const getEtapas = async () => {
        try {
            const response = await fetch(`http://localhost:8001/etapas/projecto/${projectId}`, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                console.log(data.etapas);
                setEtapas(data.etapas);
            }
            else {
                toast.error("Error al conseguir las etapas", {
                    "position": "bottom-right",
                    "autoClose": 3000
                });
            }
        } catch (error) {
            toast.error("Error al conseguir las etapas", {
                "position": "bottom-right",
                "autoClose": 3000
            });
        }
    }

    const terminadas = etapas.filter(e => e.estado === "terminada").length;
    const execute = etapas.length > 0 && etapas.every(e => e.estado === "cubierta");
    const percentage = (terminadas / project?.cant_etapas) * 100;

    return (
        <div className="m-4 flex flex-col">
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold text-gray-800 m-2"> Proyecto {project?.titulo}</h1>
                    <h2 className="text-2xl text-gray-700 m-2"> Descripción del proyecto: {project?.descripcion}</h2>
                    <p className="m-2"> Estado del proyecto: {project?.estado[0].toUpperCase() + project?.estado.slice(1)} </p>
                    <p className="text-gray-500 text-sm mt-2 ml-2">Cantidad de etapas: {project?.cant_etapas}</p>
                </div>
                <div className="flex flex-col justify-between">
                    {project && <CircularProgress percentage={percentage} />}
                    {project && execute && (
                        <BlueButton text={"Ejecutar proyecto"} classAttr={"mr-8"}/>
                    )}
                </div>
            </div>
            <LinkButton href={"/myProjects"} text={"Volver"} classAttr={"mt-2 ml-2 w-20"} />
            <h1 className="text-2xl font-bold text-gray-800 m-2"> Información de las etapas:</h1>
            {etapas.map((etapa) => (
                <EtapaInfo etapa={etapa} key={etapa.id} />
            ))}
        </div>
    )
}

export default Project;