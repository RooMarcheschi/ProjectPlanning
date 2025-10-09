function Rectangle({ title, redirect }) {
    return (
        <a href={redirect} className="flex flex-col justify-center items-center bg-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow cursor-pointer">
            {title === "Crear proyecto" ? (
                <span className="text-6xl text-black">+</span>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18m-7 5h7" />
                </svg>
            )}
            <h3 className="text-lg font-semibold mt-2">{title}</h3>
        </a>
    );
}

export default Rectangle;
