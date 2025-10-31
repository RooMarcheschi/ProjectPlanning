const BlueButton = ({ text, type = null, classAttr = null, onClickFunction = null, active = false }) => {
    const extra = classAttr || "";
    const activeClasses = active ? "bg-blue-600 text-white" : "";

    return (
        <button
            className={`px-4 py-2 rounded hover:cursor-pointer hover:scale-102 transition font-semibold ${activeClasses} ${extra}`.trim()}
            type={type}
            onClick={onClickFunction}
        >
            {text}
        </button>
    )

}

export default BlueButton;