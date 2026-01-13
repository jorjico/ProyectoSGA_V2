import { useEffect, useState } from "react";

function useProveedorById(id) {
    const [proveedor, setProveedor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProveedor = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                const res = await fetch(`http://localhost:4000/api/proveedores/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    const dataText = await res.text();
                    throw new Error(`Proveedor no encontrado: ${dataText}`);
                }

                const data = await res.json();
                setProveedor(data.data.proveedor);

            } catch (err) {
                console.error(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProveedor();
    }, [id]);

    return { proveedor, loading, error };
}

export default useProveedorById;