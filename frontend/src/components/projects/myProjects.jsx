import Project from "./project";
import { useEffect, useState } from "react";

const MyProjects = () => {

    const id = localStorage.getItem("id");
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        getProjects();
        console.log(projects);
    }, [])

    const getProjects = async () => {
        const response = await fetch(`http://localhost:8000/proyectos/myProjects/${id}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }
        );
        const data = await response.json();
        if (data.success) {
            setProjects(data.projects);
        }
        else {
            toast.error("Error al obtener los proyectos", {
                position: "bottom-right",
                autoClose: 3000,
            });
        }
    };

    return (
        <div className="flex justify-center items-center py-44">
            <div className="flex flex-row gap-8">
                {projects.map((project) => (
                    <Project
                        key={project.id}
                        name={project.name}
                        progress={project.progress}
                        stages={`${project.completedStages} de ${project.totalStages}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default MyProjects;
