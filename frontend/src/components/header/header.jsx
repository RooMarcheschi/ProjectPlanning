import { useState } from "react";
import iconuser from '../../assets/iconuser.png';
import notification from '../../assets/iconnotifications.png';
import projectLogo from '../../assets/LogoProjectPlanning.png';
import ConfigMenu from "./configMenu";
import NotificationMenu from "./notificationMenu";
import { useEtapas } from "../../contexts/etapasContext";

const Header = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const [openNotifications, setOpenNotifications] = useState(false);
    const [showNotifications, setShowNotifications] = useState(true);
    const { hasEtapas, setHasEtapas } = useEtapas();
    const token = localStorage.getItem("token");

    return (
        <header className="flex items-center justify-between bg-blue-500 p-10 relative shadow-lg">
            <a href="/">
                <img
                    src={projectLogo}
                    className="w-20 h-20 hover:cursor-pointer hover:-translate-y-1 transition-transform duration-200"
                    alt="Project Logo"
                />
            </a>

            {token && (
                <div className="flex items-center space-x-4 relative">
                    <div className="relative">
                        <img
                            src={notification}
                            className="w-10 h-10 hover:cursor-pointer hover:-translate-y-1 transition-transform duration-200"
                            alt="Notification Icon"
                            onClick={() => { setOpenNotifications(!openNotifications); setOpenMenu(false); }}
                        />
                        {hasEtapas && (
                            <span className="absolute top-0 right-0 block w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                    </div>

                    <div className="relative">
                        <img
                            src={iconuser}
                            className="w-10 h-10 hover:cursor-pointer hover:-translate-y-1 transition-transform duration-200"
                            alt="User Icon"
                            onClick={() => { setOpenMenu(!openMenu); setOpenNotifications(false); }}
                        />

                        {openMenu && (
                            <div className="absolute right-0 mt-12 w-48 bg-white border border-gray-300 rounded shadow-lg z-10">
                                <ConfigMenu text="Mis proyectos" redirect={"/myProjects"} />
                                <ConfigMenu text="Mis contribuciones" />
                                <ConfigMenu text="Configuración" />
                                <ConfigMenu text="Cerrar sesión" onClickFunction={() => {
                                    localStorage.clear();
                                    window.location.href = "/login";
                                }} />
                            </div>
                        )}

                        {openNotifications && (
                            <div className="absolute right-12 mt-12 w-65 bg-white border border-gray-300 rounded shadow-lg z-10 max-h-64 overflow-y-visible overflow-x-hidden">
                                <span className="block px-2 py-2 text-gray-800 bg-neutral-200">Menú de notificaciones:</span>

                                {showNotifications && (
                                    <>
                                        {hasEtapas ? (
                                            <NotificationMenu longText="Hay etapas nuevas en las que podés colaborar." />
                                        ) : (
                                            <span className="block px-2 py-2 text-gray-800">No hay notificaciones nuevas</span>
                                        )}
                                        {hasEtapas && (
                                            <button
                                                className="block w-full text-center px-2 py-2 text-red-500 font-bold hover:bg-red-200 cursor-pointer"
                                                onClick={() => {
                                                    setOpenNotifications(false);
                                                    setHasEtapas(false);
                                                }}>
                                                Borrar Notificaciones
                                            </button>
                                        )}
                                    </>
                                )}

                                {!showNotifications && (
                                    <span className="block px-2 py-2 text-gray-800">No hay notificaciones nuevas</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
