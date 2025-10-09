import { toast } from "react-toastify";
import BlueButton from "../buttons/blueButton";

function ChangePasswordForm() {

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get("changeEmail");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || typeof email !== "string" || email.trim() == "" || !emailRegex.test(email)) {
            toast.error("Email de ONG inválido.", {
                position: "bottom-right",
                autoClose: 4000,
            });
            return;
        }

        // Validación con BD

        // Envío de email

        toast.success("Se ha enviado un correo con las instrucciones para cambiar la contraseña.", {
            position: "bottom-right",
            autoClose: 4000,
        });

        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setTimeout(() => window.location.reload(), 800);
        }, 4000);

    }

    return (
        <form className="flex flex-col justify-center items-center border-2 max-w-lg mx-auto mt-12 mb-12 p-8 bg-white rounded-2xl shadow-2xl space-y-6" onSubmit={submit}>
            <h1 className="text-2xl font-bold text-blue-700 mb-2">Cambiar contraseña</h1>
            <p className="text-gray-600 mb-4">
                ¿Te olvidaste tu contraseña? No te preocupes. Ingresá tu email de ONG y te vamos a enviar un correo con las instrucciones para recuperarla.
            </p>
            <div className="w-full">
                <label htmlFor="changeEmail" className="block text-gray-700 font-semibold mb-1">
                    Email de ONG:
                </label>
                <input type="email" name="changeEmail" id="changeEmail"
                    className="border-2 border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-400 transition hover:border-blue-200"
                    required
                    placeholder="caritas@gmail.com"
                />
                <BlueButton
                    text={"Enviar correo de recuperación"}
                    classAttr={"mt-6 w-full"}
                ></BlueButton>
                <div className="flex justify-start mt-4">
                    <a href="/login" className="text-blue-600 hover:underline transition-all duration-200 hover:text-lg">Volver</a>
                </div>
            </div>
        </form>
    )
}

export default ChangePasswordForm;