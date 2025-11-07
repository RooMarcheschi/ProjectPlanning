const Rectangle = ({ title, redirect, icon }) => {
    const renderIcon = () => {
        if (title === "Crear proyecto") {
            return <span className="text-6xl text-black">+</span>;
        }

        if (icon === "pencil") {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-blue-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M3 21v-3.75L14.81 5.44a1.5 1.5 0 0 1 2.12 0l2.63 2.63a1.5 1.5 0 0 1 0 2.12L7.75 21H3z" />
                </svg>
            );
        }

        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7h18M3 12h18m-7 5h7"
                />
            </svg>
        );
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
}

export default Rectangle;

