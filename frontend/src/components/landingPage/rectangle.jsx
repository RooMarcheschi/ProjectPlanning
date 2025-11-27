import CompromisosIcon from "../../assets/compromisosIcon";
import CrearProyectoIcon from "../../assets/crearProyectoIcon";
import ObservationsIcon from "../../assets/observationsIcon";
import PencilIcon from "../../assets/pencilIcon";
import ProyectosIcon from "../../assets/proyectosIcon";
import ReportIcon from "../../assets/reportIcon";

const Rectangle = ({ title, redirect, icon }) => {
    const renderIcon = () => {
        if (title === "Crear proyecto") {
            return <CrearProyectoIcon />
        }

        if (icon === "pencil") {
            return <PencilIcon />
        }

        if (icon === "report") {
            return <ReportIcon />
        }

        if (icon === "commitments") {
            return <CompromisosIcon />
        }

        if (icon == "observations") {
            return <ObservationsIcon />
        }

        return <ProyectosIcon />
    };

    return (
        <a
            href={redirect}
            className="flex flex-col justify-center items-center bg-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow cursor-pointer"
        >
            {renderIcon()}
            <h3 className="text-lg font-semibold mt-2">{title}</h3>
        </a>
    );
};

export default Rectangle;
