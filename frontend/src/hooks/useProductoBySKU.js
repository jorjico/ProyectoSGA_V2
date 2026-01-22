import { useEffect, useState } from "react";

function useProductoBySKU(sku) {
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/productos/${sku}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!res.ok) throw new Error("Error al cargar el producto");

                const data = await res.json();
                setProducto(data.data);

            } catch (err) {
                console.error(err);
                setError(err);
                
            } finally {
                setLoading(false);
            }
        };

        if (sku) fetchProducto();

    }, [sku]);

    return { producto, loading, error };
}

export default useProductoBySKU;

