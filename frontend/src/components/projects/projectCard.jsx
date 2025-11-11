import BlueButton from "../buttons/blueButton"

const ProjectCard = ({ project }) => {
    const backgrounds = {
        "publicado": "bg-gray-300",
        "ejecutandose": "bg-orange-200",
        "terminado": "bg-blue-200"
    }
    const backgroundColor = backgrounds[project.estado];

    return (
        <div className={`flex flex-col justify-center items-center w-72 h-80 mx-auto p-6 rounded-2xl shadow-2xl space-y-4 transition-all ${backgroundColor}
            hover:scale-105 transition`}>
            <h2 className="text-center font-semibold text-2xl">{project.titulo}</h2>
            <p className="text-base text-gray-600 text-center">
                {project.descripcion}
            </p>
            <p className="text-base">
                {`${project.cant_etapas} etapa/s`}
            </p>

            <p className="text-base">
                Estado: {project.estado[0].toUpperCase() + project.estado.slice(1)}
            </p>

            <a href={`project/${project.id}`}>
                <BlueButton text={"Info"} />
            </a>

            <p className="text-sm text-gray-500">
                {`Fecha de creación: ${new Date(project.fecha_creacion).toLocaleDateString('es-AR')}`}
            </p>

        </div>
    );
};

export default ProjectCard;
