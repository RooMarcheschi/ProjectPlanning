function RedButton({ text, onClickFunction = null, classAttr = null }) {
    return (
        <button className={`bg-red-600 text-white px-4 py-2 rounded hover:cursor-pointer hover:bg-red-700 hover:scale-102 transition font-semibold${classAttr ? ' ' + classAttr : ''}`} 
            onClick={onClickFunction}>
            {text}
        </button>
    )
}

export default RedButton;