function NotificationMenu({ text, longText }) {

    return (
        <div className="block px-2 py-2 text-gray-800 hover:bg-gray-100 justify-items-start border-b border-gray-200 w-full">{text}
            <p>
                {longText}
            </p>
        </div>
    )
}

export default NotificationMenu;