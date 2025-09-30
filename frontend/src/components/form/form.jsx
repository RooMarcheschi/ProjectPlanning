import { useState } from "react"
import Stage from "./stageForm"
import { toast } from "react-toastify"

function Form() {
    const [amountStages, setAmountStages] = useState(1);
    const [confirmedStages, setConfirmedStages] = useState(false);
    const [currentStage, setCurrentStage] = useState(0);
    const [transitioning, setTransitioning] = useState(false);
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
        setTimeout(() => setClickedNext(false), 600);
    };

    const handlePrevClick = () => {
        setClickedPrev(true);
        goToPrevStage();
        setTimeout(() => setClickedPrev(false), 600);
    };

    const submitProject = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const ongName = formData.get('ongName');
        const projectName = formData.get('projectName');
        const projectDesc = formData.get('projectDesc');
        const stagesAmount = Number(formData.get('stagesAmount'));
        

        if (!ongName || typeof ongName !== 'string' || ongName.trim() === '') {
            toast.error('El nombre de la ONG es inválido.', {
                position: "bottom-right",
                autoClose: 4000,
            });
            return;
        }

        if (!projectName || typeof projectName !== 'string' || projectName.trim() === '') {
            toast.error('El nombre del proyecto es inválido.', {
                position: "bottom-right",
                autoClose: 4000,
            });
            return;
        }

        if (!stagesAmount || typeof stagesAmount !== 'number') {
            toast.error('Error con la cantidad de etapas.', {
                position: "bottom-right",
                autoClose: 4000,
            });
            return;
        }

        if (!projectDesc || typeof projectDesc !== 'string' || projectDesc.trim() === '') {
            toast.error('La descripción del proyecto es inválida.', {
                position: "bottom-right",
                autoClose: 4000,
            });
            return;
        }

        for (let i = 0; i < amountStages; i++) {
            const stageName = formData.get(`stageName${i + 1}`);
            const stageDesc = formData.get(`stageDesc${i + 1}`);

            if (!stageName || !stageDesc || typeof stageName !== 'string' || typeof stageDesc !== 'string' || stageName.trim() === '' || stageDesc.trim() === '') {
                toast.error(`Error con la etapa número ${i}`, {
                    position: "bottom-right",
                    autoClose: 4000,
                });
                return;
            }
        }

        const stages = Array.from({ length: stagesAmount }, (_, i) => ({
            name: formData.get(`stageName${i + 1}`),
            description: formData.get(`stageDesc${i + 1}`),
        }));

        const bodyJSON = {
            ongName: ongName,
            projectName: projectName,
            projectDesc: projectDesc,
            stagesAmount: stagesAmount,
            stages: stages
        }

        try {
            const response = await fetch("http://localhost:8000/proyectos/crearProyecto",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(bodyJSON)
                }
            );

            const data = await response.json();

            if (data.success) {
                toast.success("Proyecto enviado correctamente! ", {
                    position: "bottom-right",
                    autoClose: 4000,
                });
            } else {
                toast.error(`Error al enviar el proyecto: ${data.message}`, {
                    position: "bottom-right",
                    autoClose: 4000
                })
            }
        } catch (err) {
            toast.error(`Error al enviar el proyecto: ${err}`, {
                position: "bottom-right",
                autoClose: 4000
            })
        }

        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setTimeout(() => window.location.reload(), 800);
        }, 4000);
    }

    return (
        <form className="flex flex-col justify-center items-center border-2 max-w-lg mx-auto mt-12 mb-12 p-8 bg-white rounded-2xl shadow-2xl space-y-6" method="POST" onSubmit={submitProject}>
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
                    required
                    id="ongName"
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
                    required
                    id="projectName"
                />
            </div>

            <div className="w-full">
                <label className="block text-gray-700 font-semibold mb-1" htmlFor="projectDesc">
                    Descripción del proyecto:
                </label>
                <textarea name="projectDesc" id="projectDesc" className="border-2 border-gray-300 rounded px-3 py-2 h-30 w-full focus:outline-none focus:border-blue-400 transition"
                    placeholder="Este proyecto ayudará a mas de 500 familias a..."
                >
                </textarea>
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
                    readOnly={confirmedStages}
                    name="stagesAmount"
                    required
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

                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:cursor-pointer hover:scale-105 transition font-semibold" type="submit">
                        Enviar proyecto
                    </button>
                </div>
            }
        </form>
    )
}

export default Form
