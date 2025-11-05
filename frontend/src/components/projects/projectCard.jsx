import BlueButton from "../buttons/blueButton"

const ProjectCard = ({ project }) => {

    let backgroundColor;
    if (project.estado === "publicado") {
        backgroundColor = "bg-gray-200";
    } else if (project.estado === "ejecutandose") {
        backgroundColor = "bg-blue-200";
    } else {
        backgroundColor = "bg-green-200";
    }

    return (
        <div className={`flex flex-col justify-center items-center border w-72 h-80 mx-auto p-6 rounded-2xl shadow-2xl space-y-4 transition-all ${backgroundColor}
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
                <BlueButton text={"Info"}/>
            </a>

            <p className="text-sm text-gray-500">
                {`Fecha de creación: ${new Date(project.fecha_creacion).toLocaleDateString('es-AR')}`}
            </p>

        </div>
    );
};

export default ProjectCard;
