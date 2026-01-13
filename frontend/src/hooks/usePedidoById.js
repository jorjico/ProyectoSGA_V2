import { useEffect, useState } from "react";

function usePedidoById(id) {
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPedido = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                const res = await fetch(`http://localhost:4000/api/pedidos/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) throw new Error("Pedido no encontrado");

                const data = await res.json();
                setPedido(data.data);

            } catch (err) {
                console.error(err);
                setError(err);

            } finally {
                setLoading(false);
            }
        };

        if (id) fetchPedido();

    }, [id]);

    return { pedido, loading, error };
}

export default usePedidoById;