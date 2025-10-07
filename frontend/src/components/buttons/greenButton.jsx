function GreenButton({ text, allowed = null, onClickFunction = null }) {
    return (
        <button className={`bg-green-600 rounded px-4 py-2 text-white font-semibold shadow transition
            ${!allowed
                ? "hover:bg-green-700 hover:scale-105"
                : "opacity-60 cursor-not-allowed"
            }`}
            onClick={onClickFunction}
            disabled={allowed}
        >
            {text}
        </button>
    )

}

export default GreenButton;