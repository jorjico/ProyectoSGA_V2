import { useParams } from "react-router-dom";
import EditarFamilia from "../paginas/EditarFamilia";
import { useEffect, useState } from "react";

function EditarFamiliaWrapper() {
    const { id } = useParams();
    const [familia, setFamilia] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        const fetchFamilia = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
                const url = `${backendUrl}/api/familias/${id}`;

                const token = localStorage.getItem("token");

                const res = await fetch(url, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });

                const text = await res.text();

                if (!res.ok) {
                    throw new Error(`Error al cargar familia: ${res.status} ${text}`);
                }

                let data;

                try {
                    data = JSON.parse(text);

                } catch {
                    throw new Error(`La respuesta no es JSON: ${text}`);
                }

                setFamilia(data.data.familia);
                setErrorMsg(null);

            } catch (error) {
                console.error("Error capturado en fetchFamilia:", error);
                setErrorMsg(error.message || "Error al cargar familia");
                setFamilia(null);

            } finally {
                setLoading(false);
            }
        };

        fetchFamilia();

    }, [id]);

    if (loading) return <div>Cargando familia...</div>;
    if (errorMsg) return <div>{errorMsg}</div>;
    if (!familia) return <div>Familia no encontrada</div>;

    return <EditarFamilia familia={familia} />;
}

export default EditarFamiliaWrapper;