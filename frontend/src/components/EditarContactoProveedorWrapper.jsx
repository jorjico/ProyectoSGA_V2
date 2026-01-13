import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EditarContactoProveedor from "../paginas/EditarContactoProveedor";

function EditarContactoProveedorWrapper() {
    const { id } = useParams();
    const [contacto, setContacto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    useEffect(() => {
        const fetchContacto = async () => {
            try {
                
                const token = localStorage.getItem("token");

                const res = await fetch(`${backendUrl}/api/contactos-proveedores/${id}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });

                const text = await res.text();

                if (!res.ok) {
                    throw new Error(text || "Error al cargar contacto");
                }

                const data = JSON.parse(text);
                setContacto(data.data);
                setErrorMsg(null);

            } catch (error) {
                console.error("Error cargando contacto:", error);
                setErrorMsg(error.message);
                setContacto(null);
            } finally {
                setLoading(false);
            }
        };

        fetchContacto();
    }, [id, backendUrl]);

    if (loading) return <div>Cargando contacto...</div>;
    if (errorMsg) return <div>{errorMsg}</div>;
    if (!contacto) return <div>Contacto no encontrado</div>;

    return <EditarContactoProveedor contacto={contacto} />;
}

export default EditarContactoProveedorWrapper;