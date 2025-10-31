import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Project = () => {
    const { id: projectId } = useParams();
    const [project, setProject] = useState();
    const [etapas, setEtapas] = useState([]);

    useEffect(() => {
        getProject();
    }, [])

    const getProject = async () => {
        try {
            const response = await fetch(`http://localhost:8000/proyectos/${projectId}`);
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
            const response = await fetch(`http://localhost:8000/etapas/project/${projectId}`);
            const data = await response.json();

            if (data.success)
        } catch (error) {
            
        }
    }

    return (
        <div className="">
            <h1 className="text-3xl font-bold text-gray-800 m-4"> Proyecto {project?.titulo}</h1>
        </div>
    )
}

export default Project;