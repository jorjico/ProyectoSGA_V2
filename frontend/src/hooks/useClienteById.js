import { useEffect, useState } from "react";

function useClienteById(id) {
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                const res = await fetch(`http://localhost:4000/api/clientes/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) throw new Error("Cliente no encontrado");

                const data = await res.json();
                setCliente(data.data);

            } catch (err) {
                console.error(err);
                setError(err);
                
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCliente();

    }, [id]);

    return { cliente, loading, error };
}

export default useClienteById;