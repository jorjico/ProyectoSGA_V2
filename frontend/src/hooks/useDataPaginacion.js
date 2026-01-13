import { useCallback, useEffect, useMemo, useState } from "react";

const useDataPaginacion = (endpoint, limite = 24, filtros = {}) => {
    const [items, setItems] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [hayMas, setHayMas] = useState(true);
    const [loading, setLoading] = useState(false);

    const filtrosMemo = useMemo(() => {
        return filtros;
    }, [filtros]);

    const fetchItems = useCallback(async (paginaActual = 1) => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const query = new URLSearchParams({
                pagina: paginaActual,
                limite,
                ...filtrosMemo
            }).toString();

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"}${endpoint}?${query}`,
            {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined,
                    "Content-Type": "application/json",
                }
            });

            if (!res.ok) throw new Error(`Error al cargar ${endpoint}`);

            const data = await res.json();

            setItems(prev =>
                paginaActual === 1 ? data.data : [...prev, ...data.data
            ]);

            const total =
                data.total ??
                data.totalProductos ??
                data.totalProyectos ??
                data.totalClientes ??
                data.totalPedidos ??
                data.totalProveedores ??
                data.totalAlbaranes ??
                0;

            setHayMas((paginaActual * limite) < total);

        } catch (error) {
            console.error(error);
            throw error;

        } finally {
            setLoading(false);
        }

    }, [endpoint, limite, filtrosMemo]);

    useEffect(() => {
        fetchItems(pagina);
    }, [pagina, fetchItems]);

    useEffect(() => {
        setPagina(1);
        setItems([]);
        setHayMas(true);
    }, [filtrosMemo]);

    const cargarMas = () => {
        if (hayMas) setPagina(prev => prev + 1);
    };

    return {
        items,
        setItems,
        loading,
        hayMas,
        cargarMas,
    };
};

export default useDataPaginacion;