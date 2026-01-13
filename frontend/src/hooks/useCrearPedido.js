import { useState, useEffect } from "react";

function useCrearPedido(backendUrl) {
    const token = localStorage.getItem("token");

    const [proveedorTexto, setProveedorTexto] = useState("");
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
    const [proveedorOpciones, setProveedorOpciones] = useState([]);

    useEffect(() => {
        if (!proveedorTexto) return;

        const fetchProveedores = async () => {
            try {
                const url = `${backendUrl}/api/proveedores?q=${encodeURIComponent(proveedorTexto)}`;
                const res = await fetch(url, { 
                    headers: { Authorization: token ? `Bearer ${token}` : "" } 
                });
                const data = await res.json();
                setProveedorOpciones(data.data || []);
            } catch (err) {
                console.error("Error fetch proveedores:", err);
            }
        };

        fetchProveedores();
    }, [proveedorTexto, backendUrl, token]);

    const [proyectoTexto, setProyectoTexto] = useState("");
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
    const [proyectoOpciones, setProyectoOpciones] = useState([]);

    useEffect(() => {
        if (!proyectoTexto) return;

        const fetchProyectos = async () => {
            try {
                const url = `${backendUrl}/api/proyectos?q=${encodeURIComponent(proyectoTexto)}`;
                const res = await fetch(url, { 
                    headers: { Authorization: token ? `Bearer ${token}` : "" } 
                });
                const data = await res.json();
                setProyectoOpciones(data.data || []);
            } catch (err) {
                console.error("Error fetch proyectos:", err);
            }
        };

        fetchProyectos();
    }, [proyectoTexto, backendUrl, token]);

    return {
        proveedorTexto,
        setProveedorTexto,
        proveedorSeleccionado,
        setProveedorSeleccionado,
        proveedorOpciones,
        proyectoTexto,
        setProyectoTexto,
        proyectoSeleccionado,
        setProyectoSeleccionado,
        proyectoOpciones,
    };
}

export default useCrearPedido;