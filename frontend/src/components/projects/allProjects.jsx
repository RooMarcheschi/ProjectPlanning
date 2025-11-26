import { useEffect, useState, useRef, use } from "react";
import { toast } from "react-toastify";
import ProjectInfo from "./projectInfo";
import LinkButton from "../buttons/linkButton";

const AllProjects = () => {
    const [permissions, setPermissions] = useState(false);
    const [projects, setProjects] = useState([]);
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");

    useEffect(() => {
        hasPermissions();
    }, []);

    const hasPermissions = async () => {
        try {
            const response = await fetch("http://localhost:8001/auth/validateUser", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success && data.permissions) {
                setPermissions(true);
                getProjects();
                createCase();
            } else {
                window.location.href = "/";
            }
        } catch (error) {
            window.location.href = "/";
        }
    }

    const getProjects = async () => {
        try {
            const response = await fetch(`http://localhost:8001/proyectos/allProjects?user_id=${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.success) {
                setProjects(data.projects);
            }
            else {
                toast.error(`Error al conseguir los proyectos ${data.detail.message}`, {
                    position: "bottom-right",
                    autoClose: 3000,
                });
                setTimeout(() => window.location.href = "/", 3000);
            }
        } catch (error) {
            toast.error("Error al conseguir los proyectos", {
                position: "bottom-right",
                autoClose: 3000,
            });
            setTimeout(() => window.location.href = "/", 3000);
        }
    }

    const createCase = async () => {
        try {
            const response = await fetch(`http://localhost:8001/observaciones/generar_case`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem("caseId", data.case_id);
            } else {
                toast.error(`Error connecting with Bonita: ${data.detail}`, {
                    position: "bottom-right",
                    autoClose: 3000,
                })
                // window.location.href = "/myProjects";
            }
        } catch (error) {
            toast.error(`Error connecting with Bonita: ${error}`, {
                position: "bottom-right",
                autoClose: 3000,
            })
            // window.location.href = "/myProjects";
        }
    }

    return (
        <>
            {permissions && (
                <div className="m-4 flex flex-col">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col">
                            <h1 className="text-3xl font-bold text-gray-800 m-2"> Escribir observaciones </h1>
                        </div>
                    </div>
                    <LinkButton href={"/"} text={"Volver"} classAttr={"mt-2 ml-2 w-20"} />
                    <h1 className="text-2xl font-bold text-gray-800 m-2"> Proyectos:</h1>
                    {projects.map((project) => (
                        <ProjectInfo project={project} key={project.id} />
                    ))}
                </div>
            )}
        </>
    )
}

export default AllProjects;