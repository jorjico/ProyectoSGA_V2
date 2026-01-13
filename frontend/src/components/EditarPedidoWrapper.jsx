import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EditarPedido from "../paginas/EditarPedido";

function EditarPedidoWrapper() {
    const { id } = useParams();
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        const fetchPedido = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
                const url = `${backendUrl}/api/pedidos/${id}`;
                const token = localStorage.getItem("token");

                const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
                const text = await res.text();
                if (!res.ok) throw new Error(`Error al cargar pedido: ${res.status} ${text}`);

                let data;
                try { data = JSON.parse(text); } catch { throw new Error(`La respuesta no es JSON: ${text}`); }

                setPedido(data.data);
                setErrorMsg(null);
            } catch (error) {
                console.error(error);
                setErrorMsg(error.message || "Error al cargar pedido");
                setPedido(null);
            } finally {
                setLoading(false);
            }
        };
        fetchPedido();
    }, [id]);

    if (loading) return <div>Cargando pedido...</div>;
    if (errorMsg) return <div>{errorMsg}</div>;
    if (!pedido) return <div>Pedido no encontrado</div>;

    return <EditarPedido pedido={pedido} />;
}

export default EditarPedidoWrapper;