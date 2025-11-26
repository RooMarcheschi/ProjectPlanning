import ObservationBubble from "./observationsBubble";

const ObservationsPanel = ({ observations, onResolve }) => {
    return (
        <div className="w-80 ml-6 p-4 bg-gray-100 rounded-xl shadow-inner h-fit">
            <h2 className="text-lg font-bold mb-4 text-gray-700">Observaciones</h2>

            {observations.length === 0 && (
                <p className="text-gray-500 flex justify-center items-center mt-10">
                    No hay observaciones registradas.
                </p>
            )}

            {observations.map((obs, index) => (
                <div key={obs.id} className="mb-6">
                    <p className="text-sm text-gray-600 font-semibold mb-1">
                        Observante {index + 1}: {obs.nombre_observante}
                    </p>

                    <ObservationBubble
                        observacion={obs}
                        onResolve={() => onResolve(obs.id)}
                        id={obs.id}
                    />

                </div>
            ))}
        </div>
    );
};

export default ObservationsPanel;
