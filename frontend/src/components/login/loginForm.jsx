import BlueButton from "../buttons/blueButton";
import { toast } from "react-toastify";

function LoginForm() {

    const login = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const email = formData.get("loginEmail");
        const password = formData.get("loginPassword");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*\d).+$/;

        if (!email || typeof email !== 'string' || email.trim() === '' || !emailRegex.test(email)) {
            toast.error("El email de la ONG es inválido.", {
                position: "bottom-right",
                autoClose: 4000,
            });
            return;
        }

        if (!password || typeof password !== 'string' || password.trim() === '' || password.length < 6 || !passwordRegex.test(password)) {
            toast.error("La contraseña es inválida.", {
                position: "bottom-right",
                autoClose: 4000,
            });
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({
                        username: email,
                        password,
                    }),
                });
            
            if (response.ok) {
                const responseToken = await response.json()
                localStorage.setItem("token", responseToken.access_token);
                toast.success("Sesión iniciada correctamente!", {
                    position: "bottom-right",
                    autoClose: 2000,
                });
                setTimeout(() => {
                    window.location.href = "/";
                }, 2000);
            } else {
                toast.error("Usuario o contraseña incorrectos.", {
                    position: "bottom-right",
                    autoClose: 4000,
                });
            }
        }
        catch (error) {
            toast.error(`Usuario o contraseña incorrectos: ${error}`, {
                position: "bottom-right",
                autoClose: 4000,
            });
        }
    }

    return (
        <form className="flex flex-col justify-center items-center border-2 max-w-lg mx-auto mt-12 mb-12 p-8 bg-white rounded-2xl shadow-2xl space-y-6" onSubmit={login} method="POST">
            <h1 className="text-2xl font-bold text-blue-700 mb-2">Iniciar sesión </h1>
            <p className="text-gray-600 mb-4">
                Iniciá sesión con el email y la contraseña de tu ONG para acceder a ProjectPlanning.
            </p>
            <div className="w-full">
                <label htmlFor="loginEmail" className="block text-gray-700 font-semibold mb-1">
                    Email de ONG:
                </label>
                <input type="email" name="loginEmail" id="loginEmail"
                    className="border-2 border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-400 transition hover:border-blue-200"
                    required
                    placeholder="caritas@gmail.com"
                />

                <label htmlFor="loginPassword" className="block text-gray-700 font-semibold mb-1 mt-4">
                    Contraseña
                </label>
                <input type="password" name="loginPassword" id="loginPassword"
                    className="border-2 border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-400 transition hover:border-blue-200"
                    required
                    placeholder="********"
                    minLength={6}
                />

                <BlueButton
                    text={"Iniciar sesión"}
                    classAttr={"mt-6 w-full"}
                    type={"submit"}
                />

                <div className="flex justify-between mt-4">
                    <a
                        href="/changePassword"
                        className="text-blue-600 hover:underline transition-all duration-200 hover:text-lg"
                    >
                        ¿Olvidaste tu contraseña?
                    </a>
                    <a
                        href="/register"
                        className="text-blue-600 hover:underline transition-all duration-200 hover:text-lg"
                    >
                        ¿No tenés una cuenta? Registrate
                    </a>
                </div>
            </div>
        </form>
    )
}

export default LoginForm;