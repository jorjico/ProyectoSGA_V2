import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditarDatos from "../components/EditarDatos";
import BackButton from "../components/BotonAtras";
import Roles from "../data/roles";

function EditarUsuario({ usuario }) {
    const [formData, setFormData] = useState({
        email: usuario.email,
        rol: usuario.rol,
        password: ""
    });

    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const campos = [
        { name: "email", label: "Email", type: "email" },
        {
            name: "rol",
            label: "Rol",
            type: "select",
            options: Object.values(Roles)
        },
        { name: "password", label: "Nueva contraseña", type: "password" },
    ];

    const handleCambio = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");

            const payload = {
                email: formData.email,
                rol: formData.rol,
                ...(formData.password.trim() && { password: formData.password })
            };

            const res = await fetch(`${backendUrl}/api/usuarios/${usuario._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (result.success) {
                navigate(`/usuarios/${usuario._id}`);
            } else {
                alert(result.message || "Error al actualizar usuario");
            }

        } catch (error) {
            console.error("Error actualizando usuario:", error);
        }
    };

    return (
        <EditarDatos
            recurso="usuario"
            campos={campos}
            data={formData}
            handleChange={handleCambio}
            handleSubmit={handleSubmit}
            menu={<BackButton />}
        />
    );
}

export default EditarUsuario;