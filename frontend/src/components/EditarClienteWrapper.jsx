import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EditarCliente from "../paginas/EditarCliente";

function EditarClienteWrapper() {
    const { id } = useParams();
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
                const token = localStorage.getItem("token");

                const res = await fetch(`${backendUrl}/api/clientes/${id}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });

                const text = await res.text();
                if (!res.ok) throw new Error(text);

                const data = JSON.parse(text);
                setCliente(data.data);
            } catch (err) {
                setErrorMsg(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCliente();
    }, [id]);

    if (loading) return <div>Cargando cliente...</div>;
    if (errorMsg) return <div>{errorMsg}</div>;
    if (!cliente) return <div>Cliente no encontrado</div>;

    return <EditarCliente cliente={cliente} />;
}

export default EditarClienteWrapper;