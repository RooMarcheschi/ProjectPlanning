function ConfigMenu({text, onClickFunction = null, redirect}) {
    return (
         <a href={redirect} className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:cursor-pointer" onClick={onClickFunction}>{text}</a>
    )
}

export default ConfigMenu;