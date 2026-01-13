import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EditarProveedor from "../paginas/EditarProveedor";

function EditarProveedorWrapper() {
    const { id } = useParams();
    const [proveedor, setProveedor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        const fetchProveedor = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
                const token = localStorage.getItem("token");

                const res = await fetch(`${backendUrl}/api/proveedores/${id}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });

                const text = await res.text();
                if (!res.ok) throw new Error(text);

                const data = JSON.parse(text);
                setProveedor(data.data.proveedor);
            } catch (err) {
                setErrorMsg(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProveedor();
    }, [id]);

    if (loading) return <div>Cargando proveedor...</div>;
    if (errorMsg) return <div>{errorMsg}</div>;
    if (!proveedor) return <div>Proveedor no encontrado</div>;

    return <EditarProveedor proveedor={proveedor} />;
}

export default EditarProveedorWrapper;