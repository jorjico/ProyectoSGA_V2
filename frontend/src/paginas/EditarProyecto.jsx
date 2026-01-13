import { useState } from "react";
import EditarDatos from "../components/EditarDatos";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BotonAtras";

function EditarProyecto({ proyecto }) {
    const [formData, setFormData] = useState({ ...proyecto });
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const campos = [
        { name: "nombre", label: "Nombre del proyecto", type: "text" },
        { name: "estado", label: "Estado", type: "select", options: ["presupuesto", "aceptado", "en fabricación", "incidencia", "terminado"] },
        { name: "direccionEntrega", label: "Dirección de entrega", type: "text" },
    ];

    const handleCambio = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${backendUrl}/api/proyectos/${formData._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify(formData),
            });

            const result = await res.json();
            if (result.success) navigate(`/proyecto/${formData._id}`);
            else alert(result.error || "Error al actualizar proyecto");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <EditarDatos
            recurso="proyecto"
            campos={campos}
            data={formData}
            handleChange={handleCambio}
            handleSubmit={handleSubmit}
            menu={<BackButton />}
        />
    );
}

export default EditarProyecto;