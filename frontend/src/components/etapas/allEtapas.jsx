import Etapa from "./etapa";

const AllEtapas = ({etapas, onEtapaChange }) => {

    return (
        <div className="flex flex-col h-full border border-gray-400 rounded-2xl shadow-lg bg-blue-100 p-4 overflow-y-auto overflow-x-hidden">
            <h1 className="text-xl font-bold text-blue-700 mb-3 text-center">
                Colaborar a otros proyectos
            </h1>

            {etapas.map(etapa => (
                <Etapa etapa={etapa} key={etapa.id} onEtapaChange={onEtapaChange} />
            ))}
        </div>
    )
}

export default AllEtapas;