import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EditarUsuario from "../paginas/EditarUsuario";

function EditarUsuarioWrapper() {
    const { id } = useParams();
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
                const token = localStorage.getItem("token");

                const res = await fetch(`${backendUrl}/api/usuarios/${id}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });

                const text = await res.text();

                if (!res.ok) {
                    throw new Error(text || "Error al cargar usuario");
                }

                const data = JSON.parse(text);
                setUsuario(data.data);
                setErrorMsg(null);

            } catch (error) {
                console.error("Error cargando usuario:", error);
                setErrorMsg(error.message);
                setUsuario(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUsuario();
    }, [id]);

    if (loading) return <div>Cargando usuario...</div>;
    if (errorMsg) return <div>{errorMsg}</div>;
    if (!usuario) return <div>Usuario no encontrado</div>;

    return <EditarUsuario usuario={usuario} />;
}

export default EditarUsuarioWrapper;