import { useEffect, useState } from "react";

function useFamiliaById(id) {
    const [familia, setFamilia] = useState(null);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFamilia = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/familias/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!res.ok) {
                    throw new Error("Error al cargar la familia");
                }

                const data = await res.json();

                setFamilia(data.data.familia);
                setProductos(data.data.productos);

            } catch (err) {
                console.error(err);
                setError(err);
                
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchFamilia();

    }, [id]);

    return { familia, productos, loading, error };
}

export default useFamiliaById;