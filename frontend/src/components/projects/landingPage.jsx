import AllEtapas from "../etapas/allEtapas";
import Rectangle from "./rectangle";


function LandingPage() {
    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-1/3 p-6">
                <AllEtapas />
            </div>

            <div className="w-2/3 grid grid-rows-2 gap-6 p-6">
                <Rectangle title="Crear proyecto" />
                <Rectangle title="Mis proyectos" />
            </div>
        </div>
    )
}

export default LandingPage;