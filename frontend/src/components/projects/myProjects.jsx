import BlueButton from "../buttons/blueButton";
import LinkButton from "../buttons/linkButton";
import ProjectCard from "./projectCard";
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";

const MyProjects = () => {
    const id = localStorage.getItem("id");
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        getProjects();
    }, [])

    const getProjects = async () => {
        const response = await fetch(`http://localhost:8000/proyectos/myProjects/${id}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}` 
                }
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

    const filteredProjects = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return projects.filter((p) => {
            const title = (p.titulo || p.name || "").toString().toLowerCase();
            const desc = (p.descripcion || p.desc || "").toString().toLowerCase();
            const state = (p.estado || "").toString().toLowerCase();

            if (statusFilter !== "all" && state !== statusFilter) {
                return false;
            }
            if (!term) {
                return true;
            }
            return title.includes(term) || desc.includes(term) || state.includes(term);
        });
    }, [projects, searchTerm, statusFilter]);

    return (
        <div className="flex flex-col justify-center items-center py-44 w-full">
            <div className="w-full max-w-5xl px-6">
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar proyectos..."
                            className="w-full sm:w-2/3 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <div className="flex items-center gap-2">
                            <BlueButton
                                onClickFunction={() => setStatusFilter("all")}
                                active={statusFilter === "all"}
                                classAttr={`px-3 py-1 rounded border border-gray-300 text-gray-700`}
                                text={"Todos"}
                            />
                            <BlueButton
                                onClickFunction={() => setStatusFilter("publicado")}
                                active={statusFilter === "publicado"}
                                classAttr={`px-3 py-1 rounded border border-gray-300 text-gray-700`}
                                text={"Publicado"}
                            />
                            <BlueButton
                                onClickFunction={() => setStatusFilter("ejecutandose")}
                                active={statusFilter === "ejecutandose"}
                                classAttr={`px-3 py-1 rounded border border-gray-300 text-gray-700`}
                                text={"Ejecutándose"}
                            />
                            <BlueButton
                                onClickFunction={() => setStatusFilter("terminado")}
                                active={statusFilter === "terminado"}
                                classAttr={`px-3 py-1 rounded border border-gray-300 text-gray-700`}
                                text={"Terminado"}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.length === 0 ? (
                        <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col justify-center items-center w-full">
                            <p className="text-gray-500 flex justify-center items-center mt-10">
                                No has creado ningún proyecto.
                            </p>
                            <a
                                href="/cargarProyecto"
                                className="text-blue-600 hover:underline transition-all duration-200 hover:text-lg mt-4">
                                Crear un proyecto
                            </a>
                        </div>
                    ) : filteredProjects.length > 0 ? (
                        filteredProjects.map((project) => (
                            <div key={project.id} className="w-full">
                                <ProjectCard
                                    project={project}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col justify-center items-center w-full">
                            <p className="text-gray-500 flex justify-center items-center mt-10">
                                No se encontraron proyectos.
                            </p>
                                <a
                                    href="/cargarProyecto"
                                    className="text-blue-600 hover:underline transition-all duration-200 hover:text-lg mt-4">
                                    Crear un proyecto
                                </a>
                        </div>
                    )}
                </div>
            </div>

            <LinkButton href="/" text="Volver al inicio" classAttr="mt-6" />
        </div>
    );
};

export default MyProjects;
