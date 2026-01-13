import { useEffect, useState } from "react";
import { UsuarioContext } from "./UsuarioContext.jsx";

export const UsuarioProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) return;

        const cargarUsuario = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/auth/usuario", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    localStorage.removeItem("token");
                    return; 
                }

                const data = await res.json();
                setUsuario(data);
            } catch (error) {
                console.error("Error al cargar el usuario:", error);
                localStorage.removeItem("token");
            }
        };

        cargarUsuario();
    }, []);

    const logout = () => {
        setUsuario(null);
        localStorage.removeItem("token");
    };

    return (
        <UsuarioContext.Provider value={{ usuario, setUsuario, logout }}>
            {children}
        </UsuarioContext.Provider>
    );
};
