import BlueButton from "../buttons/blueButton";

function Etapa({ etapa }) {
    return (
        <div className="bg-white rounded-xl shadow-md p-4 mb-3 border border-gray-300">
            <h2 className="font-semibold text-lg text-blue-700">{etapa.titulo}</h2>
            <p className="text-sm text-gray-600">ONG: {etapa.ong}</p>
            <p className="text-gray-700 mt-2">{etapa.descripcion}</p>
            <a href={`/etapa/${etapa.id}`} key={etapa.id} className="mt-3 flex justify-center">
                <BlueButton text="Colaborar" />
            </a>
        </div>
    )
}

export default Etapa;