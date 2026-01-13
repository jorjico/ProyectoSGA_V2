import { useState, useEffect } from "react";

function useContactoProveedorById(id) {
    const [contacto, setContacto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    useEffect(() => {
        const fetchContacto = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${backendUrl}/api/contactos-proveedores/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Error al obtener el contacto: ${text}`);
                }

                const data = await res.json();
                if (data.success) setContacto(data.data);
                else throw new Error(data.message);

            } catch (err) {
                setError(err);

            } finally {
                setLoading(false);
            }
        };

        if (id) fetchContacto();
    }, [id, backendUrl]);

    return { contacto, loading, error };
}

export default useContactoProveedorById;