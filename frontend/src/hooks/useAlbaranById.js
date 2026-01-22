import { useEffect, useState } from "react";

function useAlbaranById(id) {
    const [albaran, setAlbaran] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAlbaran = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/albaranes/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) throw new Error("Albarán no encontrado");

                const data = await res.json();
                setAlbaran(data.data);

            } catch (err) {
                console.error(err);
                setError(err);

            } finally {
                setLoading(false);
            }
        };

        if (id) fetchAlbaran();

    }, [id]);

    return { albaran, loading, error };
}

export default useAlbaranById;