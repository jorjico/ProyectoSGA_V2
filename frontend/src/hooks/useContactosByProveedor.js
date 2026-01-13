import { useState, useEffect } from "react";

function useContactosByProveedor(proveedorId) {
    const [contactos, setContactos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContactos = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
                const res = await fetch(`${backendUrl}/api/contactos?proveedorId=${proveedorId}`);
                
                if (!res.ok) throw new Error(`Error al obtener contactos: ${res.statusText}`);

                const data = await res.json();

                const contactosOrdenados = (data.data || []).sort((a, b) => 
                    a.nombre.localeCompare(b.nombre)
                );

                setContactos(contactosOrdenados);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (proveedorId) fetchContactos();
    }, [proveedorId]);

    return { contactos, loading, error };
}

export default useContactosByProveedor;