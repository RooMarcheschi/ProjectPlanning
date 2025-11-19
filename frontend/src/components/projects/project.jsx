import BlueButton from "../buttons/blueButton";
import CircularProgress from "./circularProgress";
import EtapaInfo from "../etapas/etapaInfo";
import LinkButton from "../buttons/linkButton"
import ObservationsPanel from "../observaciones/observationsPanel";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Project = () => {
    const { id: projectId } = useParams();
    const token = localStorage.getItem("token");
    const [project, setProject] = useState();
    const [etapas, setEtapas] = useState([]);
    const [observations, setObservations] = useState();
    let advance, buttonTransition, strokeColor, buttonText, buttonFunction;

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

    const getObservations = async () => {
        try {
            const response = await fetch(`http://localhost:8001/observaciones/project_observations?project_id=${projectId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                setObservations(data.observations);
                console.log(data.observations);
            } else {
                toast.error(`Error al conseguir las observaciones: ${data.detail.message}`, {
                    position: "bottom-right",
                    autoClose: 3000,
                });
                window.location.href = "/myProjects";
            }
        } catch (error) {
            toast.error(`Error al conseguir las observaciones: ${error}`, {
                position: "bottom-right",
                autoClose: 3000,
            });
            window.location.href = "/myProjects";
        }
    }

    const ejecutarProyecto = async () => {
        try {
            const response = await fetch(`http://localhost:8001/proyectos/ejecutar/${projectId}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            const data = await response.json();
            if (data.success) {
                toast.success("El proyecto se está ejecutando!", {
                    position: "bottom-right",
                    autoClose: 3000,
                })
                getProject();
                getEtapas();
            } else {
                toast.error(`Error al ejecutar el proyecto: ${data.detail.message}`, {
                    position: "bottom-right",
                    autoClose: 3000,
                })
            }
        } catch (error) {
            toast.error(`Error al ejecutar el proyecto: ${error}`, {
                position: "bottom-right",
                autoClose: 3000,
            })
        }
    }

    const finalizarProyecto = async () => {
        const bodyJSON = {
            project_id: projectId,
        };

        try {
            const response = await fetch(`http://localhost:8001/proyectos/terminar_proyecto`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(bodyJSON),
            });

            if (!response.ok) {
                toast.error("Error al finalizar el proyecto", {
                    position: "bottom-right",
                    autoClose: 3000,
                });
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `proyecto_${projectId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            toast.success("El proyecto ha sido finalizado con éxito!", {
                position: "bottom-right",
                autoClose: 3000,
            });
            getProject();
        } catch (error) {
            toast.error(`Error al finalizar el proyecto: ${error}`, {
                position: "bottom-right",
                autoClose: 3000,
            });
        }
    };

    const resolveObservation = async (observationId) => {
        try {
            const response = await fetch(`http://localhost:8001/observaciones/resolve_observation?observation_id=${observationId}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Observación resuelta!", {
                    position: "bottom-right",
                    autoClose: 3000,
                })
                getObservations();
            } else {
                toast.error(`Error al resolver la observación: ${data.detail.message}`, {
                    position: "bottom-right",
                    autoClose: 3000,
                })
            }
        } catch (error) {
            toast.error(`Error al resolver la observación: ${error}`, {
                position: "bottom-right",
                autoClose: 3000,
            })
        }
    }

    useEffect(() => {
        getProject();
        getEtapas();
        getObservations();
    }, [])

    useEffect(() => {
        if (project?.estado) {
            getEtapas();
        }
    }, [project?.estado]);

    if (project?.estado == "publicado") {
        buttonTransition = etapas.length > 0 && etapas.every(e => e.estado === "cubierta");
        advance = etapas.filter(e => e.estado === "cubierta").length;
        strokeColor = "#38e875";
        buttonText = "Ejecutar proyecto";
        buttonFunction = ejecutarProyecto;
    } else {
        buttonTransition = etapas.length > 0 && etapas.every(e => e.estado === "terminada");
        advance = etapas.filter(e => e.estado === "terminada").length;
        strokeColor = "#1d7df5";
        buttonText = "Finalizar proyecto";
        buttonFunction = finalizarProyecto;
    }
    const percentage = (advance / project?.cant_etapas) * 100;

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
                    {project && <CircularProgress percentage={percentage} strokeColor={strokeColor} />}
                    {project && buttonTransition && project.estado !== "terminado" && (
                        <BlueButton text={buttonText} classAttr={"mr-8"} onClickFunction={buttonFunction} />
                    )}
                </div>
            </div>
            <LinkButton href={"/myProjects"} text={"Volver"} classAttr={"mt-2 ml-2 w-20"} />
            <div className="flex flex-row gap-6 mt-4">

                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-800 m-2"> Información de las etapas:</h1>

                    {etapas.map(etapa => (
                        <EtapaInfo etapa={etapa} key={etapa.id} />
                    ))}
                </div>

                {observations && (
                    <ObservationsPanel observations={observations}
                        onResolve={resolveObservation} />
                )}
            </div>
        </div>
    )
}

export default Project;