import Project from "./project";

const MyProjects = () => {
    return (
        <div className="flex justify-center items-center py-44">
            <div className="flex flex-row gap-8">
                <Project name="Jóvenes Emprendedores" progress={80} stages="4 de 5" />
                <Project name="Mujeres Empoderadas" progress={100} completed />
                <Project name="Proyecto 3" progress={60} completed />
            </div>
        </div>
    );
};

export default MyProjects;
