import BlueButton from "../buttons/blueButton";
import { toast } from "react-toastify";

function RegisterForm() {

    const register = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const name = formData.get("registerName");
        const email = formData.get("registerEmail");
        const password = formData.get("registerPassword");
        const confirmPassword = formData.get("registerConfirmPassword");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*\d).+$/;

        if (!name || typeof name !== "string" || name.trim() == "") {
            toast.error("Nombre de ONG inválido.", {
                position: "bottom-right",
                autoClose: 4000,
            });
            return;
        }

        if (!email || typeof email !== "string" || email.trim() == "" || !emailRegex.test(email)) {
            toast.error("Email de ONG inválido.", {
                position: "bottom-right",
                autoClose: 4000,
            });
            return;
        }       

        if (!password || typeof password !== "string" || password.trim() == "" || !passwordRegex.test(password)) {
            toast.error("Contraseña inválida.", {
                position: "bottom-right",
                autoClose: 4000,
            });
            return;
        }

        if (!confirmPassword || typeof confirmPassword !== "string" || confirmPassword.trim() == "" || !passwordRegex.test(confirmPassword) || confirmPassword !== password) {
            toast.error("Confirmación de contraseña inválida.", {
                position: "bottom-right",
                autoClose: 4000,
            });
            return;
        }

        const bodyJSON = {
            name: name,
            email: email,
            password: password,
        };

        try {
            const response = await fetch("http://localhost:8000/users/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(bodyJSON)
                }
            );

            const data = await response.json();

            if (data.success) {
                toast.success("Usuario registrado exitosamente!",
                    {
                        position: "bottom-right",
                        autoClose: 4000,
                    }
                )
            } else {
                toast.error(`Error al registrar el usuario: ${data.message}`, {
                    position: "bottom-right",
                    autoClose: 4000,
                })
            }
        } catch (error) {
            toast.error(`Error al registrar el usuario: ${error}`, {
                position: "bottom-right",
                autoClose: 4000,
            })
        }

        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setTimeout(() => window.location.reload(), 800);
        }, 4000);
    }

    return (
        <>
            <form className="flex flex-col justify-center items-center border-2 max-w-lg mx-auto mt-12 mb-12 p-8 bg-white rounded-2xl shadow-2xl space-y-6" method="POST" onSubmit={register}>
                <h1 className="text-2xl font-bold text-blue-700 mb-2">Registrarse </h1>
                <p className="text-gray-600 mb-4">
                    Registrá a tu ONG en ProjectPlanning para crear y apoyar proyectos que generen un impacto positivo en la comunidad.
                </p>
                <div className="w-full">
                    <label htmlFor="registerName" className="block text-gray-700 font-semibold mb-1">
                        Nombre de ONG:
                    </label>
                    <input type="text" name="registerName" id="registerName"
                        className="border-2 border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-400 transition hover:border-blue-200"
                        required
                        placeholder="Agua para Todos"
                    />
                    <label htmlFor="registerEmail" className="block text-gray-700 font-semibold mb-1 mt-4">
                        Email de ONG:
                    </label>
                    <input type="email" name="registerEmail" id="registerEmail"
                        className="border-2 border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-400 transition hover:border-blue-200"
                        required
                        placeholder="caritas@gmail.com"
                    />
                    <label htmlFor="registerPassword" className="block text-gray-700 font-semibold mb-1 mt-4">
                        Contraseña:
                    </label>
                    <input type="password" name="registerPassword" id="registerPassword"
                        className="border-2 border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-400 transition hover:border-blue-200"
                        required
                        placeholder="********"
                        minLength={6}
                    />
                    <p className="text-gray-600 mb-4 text-sm mt-2">La contraseña debe contener 6 caracteres y al menos un número.</p>
                    <label htmlFor="registerConfirmPassword" className="block text-gray-700 font-semibold mb-1 mt-4">
                        Confirmar contraseña:
                    </label>
                    <input type="password" name="registerConfirmPassword" id="registerConfirmPassword"
                        className="border-2 border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-400 transition hover:border-blue-200"
                        required
                        placeholder="********"
                        minLength={6}
                    />
                    <BlueButton
                        text={"Registrarse"}
                        classAttr={"mt-6 w-full"}
                        type={"submit"}
                    />

                    <div className="flex justify-end mt-4">
                        <a href="/login" className="text-blue-600 hover:underline transition-all duration-200 hover:text-lg">¿Ya tenés una cuenta? Iniciá sesión</a>
                    </div>
                </div>
            </form>
        </>
    )
}

export default RegisterForm;