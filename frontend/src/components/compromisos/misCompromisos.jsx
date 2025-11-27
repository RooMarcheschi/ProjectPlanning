import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LinkButton from "../buttons/linkButton";
import CompromisoInfo from "./compromisoInfo";

const MisCompromisos = () => {
    const [misCompromisos, setMisCompromisos] = useState();
    const token = localStorage.getItem("token");

    useEffect(() => {
        getCompromisos();
    }, [])

    const getCompromisos = async () => {
        const toastId = toast.loading("Obteniendo compromisos...", {
            position: "bottom-right",
            autoClose: 1000,
            isLoading: true,
        })
        try {
            const response = await fetch("http://localhost:8001/compromisos/my_compromisos", {
                "method": "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            const data = await response.json();
            if (data.success) {
                setMisCompromisos(data.compromisos);
                console.log(data.compromisos);
                toast.dismiss(toastId)
            } else {
                toast.update(toastId,
                    {
                        render: `Error al obtener los compromisos ${data.detail}`,
                        type: "error",
                        isLoading: false,
                        position: "bottom-right",
                        autoClose: 3000,
                    })
            }
        } catch (error) {
            toast.update(toastId,
                {
                    render: `Error al obtener los compromisos ${error}`,
                    type: "error",
                    isLoading: false,
                    position: "bottom-right",
                    autoClose: 3000,
                })
        }
    }

    return (
        <div className="m-4 flex flex-col">
            <h1 className="text-3xl font-bold text-gray-800 m-2"> Mis compromisos </h1>
            <LinkButton href={"/"} text={"Volver"} classAttr={"mt-2 ml-2 w-20"} />
            {misCompromisos && (
                <>
                    {misCompromisos.length == 0 && (
                        <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col justify-center items-center w-full">
                            <p className="text-gray-500 flex justify-center items-center mt-10">
                                No te comprometiste con ningún proyecto.
                            </p>
                            <LinkButton href={"/"} text={"Buscar etapas"} classAttr={"mt-4"} />
                        </div>
                    )}
                    {misCompromisos.map((c) => (
                        <CompromisoInfo compromiso={c} key={c.id} refreshFunction={getCompromisos} />
                    ))}
                </>
            )}
        </div>
    )
}

export default MisCompromisos;