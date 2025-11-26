const NotificationMenu = ({ longText, hrefURL }) => {

    return (
        <a href={hrefURL}
            className="block px-2 py-2 text-gray-800 hover:bg-gray-100 justify-items-start border-b border-gray-200 w-full">
            <p>
                {longText}
            </p>
        </a>
    )
}

export default NotificationMenu;