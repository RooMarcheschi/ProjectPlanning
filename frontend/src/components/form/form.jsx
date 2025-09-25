import { useState } from "react"

function Form() {
    const [amountEtapas, setAmountEtapas] = useState(1);

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="mt-6 mb-6">
                <h1> Nombre de la ONG: </h1>
                <input type="text" className="border-2 max-w-min" />
            </div>
            <div className="mt-6 mb-6">
                <h1> Nombre del proyecto: </h1>
                <input type="text" className="border-2 max-w-min" />
            </div>

            <h2 className="mr-6"> Cantidad de etapas: </h2>
            <div className="flex flex-row mt-6">
                <input type="number" className="border-2 ml-6 mr-6" min={1} placeholder="1" onChange={amountEtapas}/>
                <button className="bg-green-600 ml-6 border-2 hover:cursor-pointer "> Confirmar </button>
            </div>
        </div>
    )
}

export default Form