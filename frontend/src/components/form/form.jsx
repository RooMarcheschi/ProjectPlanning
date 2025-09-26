import { useState } from "react"
import Stage from "./stageForm"

function Form() {
    const [amountStages, setAmountStages] = useState(1);
    const [confirmedStages, setConfirmedStages] = useState(false);
    const [currentStage, setCurrentStage] = useState(0);
    const [transitioning, setTransitioning] = useState(false);

    // estados para el efecto de color
    const [clickedNext, setClickedNext] = useState(false);
    const [clickedPrev, setClickedPrev] = useState(false);

    const goToPrevStage = () => {
        if (currentStage > 0 && !transitioning) {
            setTransitioning(true);
            setCurrentStage(currentStage - 1);
            setTimeout(() => setTransitioning(false), 10);
        }
    };

    const goToNextStage = () => {
        if (currentStage < amountStages - 1 && !transitioning) {
            setTransitioning(true);
            setCurrentStage(currentStage + 1);
            setTimeout(() => setTransitioning(false), 10);
        }
    };

    const handleNextClick = () => {
        setClickedNext(true);
        goToNextStage();
        setTimeout(() => setClickedNext(false), 600); // 600 ms de azul
    };

    const handlePrevClick = () => {
        setClickedPrev(true);
        goToPrevStage();
        setTimeout(() => setClickedPrev(false), 600);
    };

    return (
        <div className="flex flex-col justify-center items-center border-2 max-w-lg mx-auto mt-12 mb-12 p-8 bg-white rounded-2xl shadow-2xl space-y-6">
            <h1 className="text-2xl font-bold text-blue-700 mb-2">Registrar Proyecto</h1>
            <div className="w-full">
                <label className="block text-gray-700 font-semibold mb-1" htmlFor="ongName">
                    Nombre de la ONG:
                </label>
                <input
                    type="text"
                    className="border-2 border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-400 transition"
                    placeholder="Juntos por un sueño"
                    name="ongName"
                />
            </div>

            <div className="w-full">
                <label className="block text-gray-700 font-semibold mb-1" htmlFor="projectName">
                    Nombre del proyecto:
                </label>
                <input
                    type="text"
                    className="border-2 border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-400 transition"
                    placeholder="Asfaltado de calles en Tucumán"
                    name="projectName"
                />
            </div>

            <div className="flex flex-row items-center w-full space-x-4">
                <h2 className="font-semibold text-gray-700">Cantidad de etapas:</h2>
                <input
                    type="number"
                    className="border-2 border-gray-300 rounded px-2 py-1 w-20 text-center focus:outline-none focus:border-blue-400 transition"
                    min={1}
                    placeholder="1"
                    value={amountStages}
                    onChange={e => {
                        setAmountStages(Number(e.target.value));
                        setCurrentStage(0);
                    }}
                    disabled={confirmedStages}
                    name="stagesAmount"
                />
                <button
                    className={`bg-green-600 rounded px-4 py-2 text-white font-semibold shadow transition
                        ${!confirmedStages
                            ? "hover:bg-green-700 hover:scale-105"
                            : "opacity-60 cursor-not-allowed"
                        }`}
                    onClick={() => setConfirmedStages(true)}
                    disabled={confirmedStages}
                >
                    Confirmar
                </button>
            </div>

            {confirmedStages &&
                <div className="flex flex-col mt-6 items-center w-full">
                    <span className="text-center font-semibold text-gray-700">Etapa {currentStage + 1} de {amountStages}</span>

                    <div className="flex flex-row justify-center items-center w-full max-w-lg">
                        <button
                            onClick={handlePrevClick}
                            disabled={currentStage === 0 || transitioning}
                            className={`px-2 py-1 text-3xl rounded mx-2 disabled:opacity-50
                                transition-colors duration-700 ease-out
                                ${clickedPrev ? "bg-blue-300" : "bg-transparent"}
                                ${currentStage === 0 || transitioning
                                    ? "cursor-not-allowed"
                                    : "hover:cursor-pointer"}`}
                        >
                            &lt;
                        </button>

                        <div className="overflow-hidden w-full flex-1 relative h-64">
                            <div
                                className="flex transition-transform duration-300 ease-in-out"
                                style={{ transform: `translateX(-${currentStage * 100}%)` }}
                            >
                                {Array.from({ length: amountStages }).map((_, index) => (
                                    <div key={index} className="w-full flex-shrink-0 px-2">
                                        <Stage stageNumber={index + 1} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleNextClick}
                            disabled={currentStage === amountStages - 1 || transitioning}
                            className={`px-2 py-1 text-3xl rounded mx-2 disabled:opacity-50
                                transition-colors duration-700 ease-out
                                ${clickedNext ? "bg-blue-300" : "bg-transparent"}
                                ${currentStage === amountStages - 1 || transitioning
                                    ? "cursor-not-allowed"
                                    : "hover:cursor-pointer"}`}
                        >
                            &gt;
                        </button>
                    </div>

                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:cursor-pointer">
                        Enviar proyecto
                    </button>
                </div>
            }
        </div>
    )
}

export default Form
