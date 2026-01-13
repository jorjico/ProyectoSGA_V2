import { useEffect, useState } from "react";

function useProductosByProveedor(proveedorId, backendUrl) {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!proveedorId) {
            setProductos([]);
            return;
        }

        const fetchProductos = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const res = await fetch(`${backendUrl}/api/producto-proveedor/proveedor/${proveedorId}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });

                if (!res.ok) throw new Error("Error al cargar productos");

                const data = await res.json();
                setProductos(Array.isArray(data.data) ? data.data : []);
            } catch (err) {
                console.error(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, [proveedorId, backendUrl]);

    const filtrarProductos = (query) => {
        if (!query) return productos;
        const qLower = query.toLowerCase();
        return productos.filter(rel =>
            rel.producto?.nombreProducto.toLowerCase().includes(qLower)
        );
    };

    return { productos, loading, error, filtrarProductos };
}

export default useProductosByProveedor;