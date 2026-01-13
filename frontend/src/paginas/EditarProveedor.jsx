import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditarDatos from "../components/EditarDatos";
import BackButton from "../components/BotonAtras";
import CondicionesPagoData from "../data/condicionesPago";

function EditarProveedor({ proveedor }) {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const [formData, setFormData] = useState({
        nombre: proveedor.nombre || "",
        CIF: proveedor.CIF || "",
        direccion: proveedor.direccion || "",
        codigoPostal: proveedor.codigoPostal || "",
        pais: proveedor.pais || "",
        condicionesPago: proveedor.condicionesPago || "transferencia",
        diasTiempoEntrega: proveedor.diasTiempoEntrega || 0,
        activo: String(proveedor.activo ?? true),
    });

    const campos = [
        { name: "nombre", label: "Nombre", type: "text" },
        { name: "CIF", label: "CIF", type: "text" },
        { name: "direccion", label: "Dirección", type: "text" },
        { name: "codigoPostal", label: "Código postal", type: "text" },
        { name: "pais", label: "País", type: "text" },
        { name: "condicionesPago", label: "Condición de pago", type: "select", options: CondicionesPagoData },
        { name: "diasTiempoEntrega", label: "Días de entrega", type: "number" },
        { name: "activo", label: "Activo", type: "select", options: ["true", "false"] },
    ];

    const handleCambio = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            const payload = { ...formData, activo: formData.activo === "true" };

            const res = await fetch(`${backendUrl}/api/proveedores/${proveedor._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            if (result.success) {
                navigate(`/proveedores/${proveedor._id}`);
            } else {
                alert(result.error || "Error al actualizar proveedor");
            }
        } catch (error) {
            console.error("Error actualizando proveedor:", error);
            alert("Error al actualizar proveedor");
        }
    };

    return (
        <EditarDatos
            recurso="proveedor"
            campos={campos}
            data={formData}
            handleChange={handleCambio}
            handleSubmit={handleSubmit}
            menu={<BackButton />}
        />
    );
}

export default EditarProveedor;