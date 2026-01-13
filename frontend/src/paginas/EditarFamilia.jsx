import { useState } from "react";
import EditarDatos from "../components/EditarDatos";
import { Input, FormControl, FormLabel } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BotonAtras";

function EditarFamilia({ familia }) {
    const [formData, setFormData] = useState({
        nombre: familia.nombre,
    });

    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const campos = [
        { name: "nombre", label: "Nombre", type: "text" },
    ];

    const handleCambio = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${backendUrl}/api/familias/${familia._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify(formData),
            });

            const result = await res.json();

            if (result.success) navigate(`/familia/${familia._id}`);
            else alert(result.error || "Error al actualizar familia");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <EditarDatos
            recurso="familia"
            campos={campos}
            data={formData}
            handleChange={handleCambio}
            handleSubmit={handleSubmit}
            menu={<BackButton />}
        />
    );
}

export default EditarFamilia;