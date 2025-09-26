function Stage({ stageNumber }) {
    return (
        <div className="flex flex-col max-w-md pr-6 pb-6 pt-3 rounded">
            <label htmlFor={`stageName${stageNumber}`} className="text-lg font-semibold text-gray-700">
                Nombre de la etapa {stageNumber}
            </label>
            <input type="text" className="border-2 border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-400 transition"
                placeholder={`Etapa ${stageNumber}`}
                id={`stageName${stageNumber}`} />
            <label htmlFor={`stageDesc${stageNumber}`} className="text-lg font-semibold text-gray-700">
                Descripción de la etapa {stageNumber}
            </label>
            <textarea
                name={`text${stageNumber}`}
                className="border-2 border-gray-300 rounded px-3 py-2 h-30 w-full focus:outline-none focus:border-blue-400 transition"
                placeholder={`Descripción de la etapa ${stageNumber}`}
            ></textarea>
        </div>
    )
}

export default Stage