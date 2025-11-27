; import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LinkButton from "../buttons/linkButton";
import ObservationInfo from "./observationInfo";

const AllObservations = () => {
    const user_id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const [myObservations, setMyObservations] = useState([]);

    useEffect(() => {
        hasPermissions();
    }, []);

    const hasPermissions = async () => {
        if (!token) {
            toast.error("Error al obtener las observaciones", {
                position: "bottom-right",
                autoClose: 3000,
            })
        }

        try {
            const response = await fetch("http://localhost:8001/auth/validateUser", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success && data.permissions) {
                getObservations();
            }
        } catch (error) {
            toast.error(`Error getting permissions : ${error}`, {
                position: "bottom-right",
                autoClose: 4000,
            });
        }
    }

    const getObservations = async () => {
        if (!user_id || !token) {
            toast.error("Error al obtener las observaciones", {
                position: "bottom-right",
                autoClose: 3000,
            })
        }

        try {
            const response = await fetch(`http://localhost:8001/observaciones/user_observations?user_id=${user_id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                setMyObservations(data.observations);
            } else {
                toast.error(`Error al obtener las observaciones ${data.detail.message}`, {
                    position: "bottom-right",
                    autoClose: 3000,
                })
            }
        } catch (error) {
            toast.error(`Error al obtener las observaciones ${error}`, {
                position: "bottom-right",
                autoClose: 3000,
            })
        }
    }

    return (
        <div className="m-4 flex flex-col">
            <h1 className="text-3xl font-bold text-gray-800 m-2"> Mis observaciones </h1>
            <LinkButton href={"/"} text={"Volver"} classAttr={"mt-2 ml-2 w-20"} />
            {myObservations && (
                <>
                    {myObservations.length == 0 && (
                        <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col justify-center items-center w-full">
                            <p className="text-gray-500 flex justify-center items-center mt-10">
                                No creaste ninguna observación.
                            </p>
                            <LinkButton href={"/allProjects"} text={"Crear observaciones"} classAttr={"mt-4"} />
                        </div>
                    )}
                    {myObservations.map((o) => (
                        <ObservationInfo observacion={o} key={o.id} />
                    ))}
                </>
            )}
        </div>
    )

}

export default AllObservations;