import { useState } from "react";

function useCrearSalida() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const crearSalida = async (datos) => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/salidas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(datos),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Error al crear salida");

            return data.data;

        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { crearSalida, loading, error };
}

export default useCrearSalida;