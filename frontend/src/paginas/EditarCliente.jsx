import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditarDatos from "../components/EditarDatos";
import BackButton from "../components/BotonAtras";

function EditarCliente({ cliente }) {
    const [formData, setFormData] = useState({
        tipo: cliente.tipo || "persona",
        nombre: cliente.nombre || "",
        NIF: cliente.NIF || "",
        CIF: cliente.CIF || "",
        direccionFacturacion: cliente.direccionFacturacion || "",
        telefono: cliente.telefono || "",
        email: cliente.email || "",
        activo: String(cliente.activo ?? true),
    });

    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const campos = [
        {
            name: "tipo",
            label: "Tipo",
            type: "select",
            options: ["persona", "empresa"],
        },
        { name: "nombre", label: "Nombre", type: "text" },
        { name: "NIF", label: "NIF", type: "text" },
        { name: "CIF", label: "CIF", type: "text" },
        {
            name: "direccionFacturacion",
            label: "Dirección de facturación",
            type: "text",
        },
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

            const res = await fetch(
                `${backendUrl}/api/clientes/${cliente._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                    body: JSON.stringify(payload),
                }
            );

            const result = await res.json();

            if (result.success) {
                navigate(`/cliente/${cliente._id}`);
            } else {
                alert(result.error || "Error al actualizar cliente");
            }
        } catch (error) {
            console.error("Error actualizando cliente:", error);
        }
    };

    return (
        <EditarDatos
            recurso="cliente"
            campos={campos}
            data={formData}
            handleChange={handleCambio}
            handleSubmit={handleSubmit}
            menu={<BackButton />}
        />
    );
}

export default EditarCliente;