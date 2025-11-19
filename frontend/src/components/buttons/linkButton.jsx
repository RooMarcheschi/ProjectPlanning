const linkButton = ({href, text, classAttr = null }) => {

    return (
        <a href={href} className={`text-blue-600 hover:underline transition-all duration-200 hover:text-lg ${classAttr}`}>
            {text}
        </a>
    )
}

export default linkButton;