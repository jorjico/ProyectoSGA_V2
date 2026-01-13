import { useParams } from "react-router-dom";
import EditarProducto from "../paginas/EditarProducto";
import { useEffect, useState } from "react";

function EditarProductoWrapper() {
    const { sku } = useParams();
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        const fetchProducto = async () => {

            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
                const url = `${backendUrl}/api/productos/${sku}`;

                const token = localStorage.getItem("token");

                const res = await fetch(url, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });

                const text = await res.text();

                if (!res.ok) {
                    throw new Error(`Error al cargar producto: ${res.status} ${text}`);
                }

                let data;

                try {
                    data = JSON.parse(text);

                } catch {
                    throw new Error(`La respuesta no es JSON: ${text}`);
                }

                setProducto(data.data);
                setErrorMsg(null);

            } catch (error) {
                console.error("Error capturado en fetchProducto:", error);
                setErrorMsg(error.message || "Error al cargar producto");
                setProducto(null);

            } finally {
                setLoading(false);
            }
        };

        fetchProducto();

    }, [sku]);

    if (loading) return <div>Cargando producto...</div>;
    if (errorMsg) return <div>{errorMsg}</div>;
    if (!producto) return <div>Producto no encontrado</div>;

    return <EditarProducto producto={producto} />;
}

export default EditarProductoWrapper;
