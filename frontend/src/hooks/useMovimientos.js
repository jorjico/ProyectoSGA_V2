import { useEffect, useState, useCallback } from "react";

function useMovimientos(limitInicial = 20, filtros = {}) {
    const [movimientos, setMovimientos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hayMas, setHayMas] = useState(true);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const cargarMovimientos = useCallback(async (pagina = 1, reiniciar = false) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: pagina,
                limit: limitInicial,
                ...filtros
            });

            const token = localStorage.getItem("token");
            const res = await fetch(`${backendUrl}/api/movimientos?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Error al obtener movimientos");

            const data = await res.json();
            if (reiniciar) {
                setMovimientos(data.data);
            } else {
                setMovimientos(prev => [...prev, ...data.data]);
            }

            setHayMas(data.data.length === limitInicial);
            setPage(pagina);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [limitInicial, filtros, backendUrl]);

    const cargarMasMovimientos = () => cargarMovimientos(page + 1);

    useEffect(() => {
        cargarMovimientos(1, true);
    }, [cargarMovimientos]);

    return { movimientos, loading, hayMas, cargarMasMovimientos };
}

export default useMovimientos;