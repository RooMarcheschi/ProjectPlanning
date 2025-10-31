import BlueButton from "../buttons/blueButton"

const Project = ({ name, stages = 10, completed = false }) => {
    return (
        <div
            className={`flex flex-col justify-center items-center border-2 w-60 h-72 mx-auto p-6 rounded-2xl shadow-2xl space-y-4 transition-all 
            ${completed ? "bg-green-900" : "bg-blue-900"} text-white`}
        >
            <div className="relative">
                <div className="w-24 h-24 rounded-full border-8 border-blue-300 flex items-center justify-center bg-white">
                    <span className="text-2xl font-bold text-black"> %</span>
                </div>
            </div>

            <p className="text-sm">
                {completed ? "Proyecto completado" : `${stages} etapas cubiertas`}
            </p>

            <h2 className="text-center  font-semibold">{name}</h2>
            
            <BlueButton text={"Info"} />
        </div>
    );
};

export default Project;
