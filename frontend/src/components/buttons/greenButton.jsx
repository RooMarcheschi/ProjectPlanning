function GreenButton({ text, allowed = null, onClickFunction = null, classAttr = null }) {
    return (
        <button className={`bg-green-600 rounded px-4 py-2 text-white font-semibold shadow transition
            ${!allowed
                ? "hover:bg-green-700 hover:scale-102 hover:cursor-pointer"
                : "opacity-60 cursor-not-allowed"
            }
            ${classAttr ? ' ' + classAttr : ''}
            `
        }
            onClick={onClickFunction}
            disabled={allowed}>
            {text}
        </button>
    )

}

export default GreenButton;