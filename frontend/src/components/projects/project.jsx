import CircularProgress from "./circularProgress";
import EtapaInfo from "../etapas/etapaInfo";
import LinkButton from "../buttons/linkButton"
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const Project = () => {
    const { id: projectId } = useParams();
    const [project, setProject] = useState();
    const [etapas, setEtapas] = useState([
        {
            "id": 1,
            "estado": "publicada",
            "name": "etapa1",
            "descripcion": "desc1"
        },
        {
            "id": 2,
            "estado": "ejecutandose",
            "name": "etapa2",
            "descripcion": "desc2"
        },
        {
            "id": 3,
            "estado": "cubierta",
            "name": "etapa3",
            "descripcion": "desc3"
        },
        {
            "id": 4,
            "estado": "terminada",
            "name": "etapa3",
            "descripcion": "desc4"
        },
    ]);

    useEffect(() => {
        getProject();
        getEtapas();
    }, [])

    const getProject = async () => {
        try {
            const response = await fetch(`http://localhost:8000/proyectos/${projectId}`, {
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
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8000/etapas/projecto/${projectId}`, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem("token")}` 
                }
            });
            const data = await response.json();
            console.log(data);
            // Se tienen que conseguir desde el backend del cloud
            if (data.success) { }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="m-4 flex flex-col">
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold text-gray-800 m-2"> Proyecto {project?.titulo}</h1>
                    <h2 className="text-2xl text-gray-700 m-2"> Descripción del proyecto: {project?.descripcion}</h2>
                    <p className="m-2"> Estado del proyecto: {project?.estado[0].toUpperCase() + project?.estado.slice(1)} </p>
                    <p className="text-gray-500 text-sm mt-2 ml-2">Cantidad de etapas: {project?.cant_etapas}</p>
                </div>
                <CircularProgress percentage={60} />
            </div>
            <LinkButton href={"/myProjects"} text={"Volver"} classAttr={"mt-2 ml-2 w-20"}/>
            <h1 className="text-2xl font-bold text-gray-800 m-2"> Información de las etapas:</h1>
            {etapas.map((etapa) => (
                <EtapaInfo etapa={etapa} key={etapa.id}/>
            ))}
        </div>
    )
}

export default Project;