import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditarDatos from "../components/EditarDatos";
import BackButton from "../components/BotonAtras";

function EditarContactoProveedor({ contacto }) {
    const [formData, setFormData] = useState({
        nombre: contacto.nombre || "",
        cargo: contacto.cargo || "",
        telefono: contacto.telefono || "",
        email: contacto.email || "",
        activo: String(contacto.activo ?? true),
    });

    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const campos = [
        { name: "nombre", label: "Nombre", type: "text" },
        { name: "cargo", label: "Cargo", type: "text" },
        { name: "telefono", label: "Teléfono", type: "text" },
        { name: "email", label: "Email", type: "email" },
        {
            name: "activo",
            label: "Activo",
            type: "select",
            options: ["true", "false"],
        },
    ];

    const handleCambio = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");

            const payload = {
                ...formData,
                activo: formData.activo === "true",
            };

            const res = await fetch(`${backendUrl}/api/contactos-proveedores/${contacto._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (result.success) {
                navigate(`/contactos-proveedores/${contacto._id}`);
            } else {
                alert(result.error || "Error al actualizar contacto");
            }
        } catch (error) {
            console.error("Error actualizando contacto:", error);
        }
    };

    return (
        <EditarDatos
            recurso="contacto"
            campos={campos}
            data={formData}
            handleChange={handleCambio}
            handleSubmit={handleSubmit}
            menu={<BackButton />}
        />
    );
}

export default EditarContactoProveedor;