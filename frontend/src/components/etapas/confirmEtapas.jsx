import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import GreenButton from '../buttons/greenButton';
import BlueButton from '../buttons/blueButton';
import RedButton from '../buttons/redButton';

function ConfirmEtapas() {
    const [etapa, setEtapa] = useState([]);
    const { id } = useParams();

    useEffect(() => { getEtapa() }, []);

    const getEtapa = async () => {
        const etapa = await fetch(`http://localhost:8000/etapas/${id}`).then(res => res.json());
        setEtapa(etapa);
    }

    const handleCancel = () => {
        window.location.href = "/";
    };

    return (
        <div className='flex flex-col h-full border border-gray-400 rounded-2xl shadow-lg bg-blue-100 p-6 overflow-y-auto overflow-x-hidden m-4'>
            <h1 className="text-xl font-bold text-blue-700 mb-3 text-center">
                Generar compromiso
            </h1>

            <p className="text-gray-600">
                {etapa.ong} te está pidiendo ayuda para la siguiente etapa de su proyecto:
            </p>
            <h2 className="font-semibold text-lg text-blue-700">{etapa.titulo}</h2>
            <p className="text-gray-700">{etapa.descripcion}</p>

            <GreenButton text="Colaborar" allowed={false} classAttr={"hover:cursor-pointer mt-4"} />
            {/* <BlueButton text="Volver" classAttr={"hover:cursor-pointer mt-4"} /> */}
            <RedButton text="Cancelar" classAttr={"hover:cursor-pointer mt-4"} onClickFunction={handleCancel} />
        </div>
    )
}

export default ConfirmEtapas;