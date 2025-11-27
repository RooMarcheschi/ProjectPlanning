import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import ProjectInfo from "./projectInfo";
import LinkButton from "../buttons/linkButton";

const AllProjects = () => {
    const [permissions, setPermissions] = useState(false);
    const [projects, setProjects] = useState([]);
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            hasPermissions();
        }
    }, []);
    useEffect(() => {
    const closeCase = () => { 
        // IF se realizo una observacion no se ejecuta esto
        const caseId = localStorage.getItem("caseId");
        const token = localStorage.getItem("token");

        if (!caseId || !token) return;

        fetch("http://localhost:8001/observaciones/close_case", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                case_id: Number(caseId)
            }),
            keepalive: true
        }).catch(() => { });
    };

    window.addEventListener("beforeunload", closeCase);

    return () => {
        closeCase(); // se va de /allProjects
        window.removeEventListener("beforeunload", closeCase);
    };
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
                    {projects.length == 0 && (
                        <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col justify-center items-center w-full">
                            <p className="text-gray-500 flex justify-center items-center mt-10">
                                No hay proyectos activos en este momento.
                            </p>
                            <LinkButton href={"/"} text={"Volver"} classAttr={"mt-4"} />
                        </div>
                    )}
                    {projects.map((project) => (
                        <ProjectInfo project={project} key={project.id} />
                    ))}
                </div>
            )}
        </>
    )
}

export default AllProjects;