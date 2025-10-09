function BlueButton({ text, type = null, classAttr = null, onClickFunction = null }) {
    return (
        <button className={`bg-blue-600 text-white px-4 py-2 rounded hover:cursor-pointer hover:scale-102 transition font-semibold${classAttr ? ' ' + classAttr : ''}`} 
            type={type}
            onClick={onClickFunction}
        >
            {text}
        </button>
    )

}

export default BlueButton;