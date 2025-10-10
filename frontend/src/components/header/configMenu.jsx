function ConfigMenu({text, onClickFunction = null}) {
    return (
         <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={onClickFunction}>{text}</a>
    )
}

export default ConfigMenu;