import { useState, useContext } from "react";
import { Heading, Input, Button } from "@chakra-ui/react";
import { UsuarioContext } from "../context/UsuarioContext.jsx";
import { useNavigate } from "react-router-dom";
import { EstiloChakra } from "../components/EstiloChakra.jsx";
import AlertaModal from "../components/AlertaModal";
import useAlert from "../hooks/useAlert";

function Login() {
    const { setUsuario } = useContext(UsuarioContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { alert, showAlert, closeAlert } = useAlert();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) throw new Error("Email o contraseña incorrectos");
            const data = await res.json();

            localStorage.setItem("token", data.token);

            const usuarioRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/usuario`, {
                headers: { Authorization: `Bearer ${data.token}` },
            });

            if (!usuarioRes.ok) throw new Error("No se pudo obtener el usuario");
            const userData = await usuarioRes.json();

            setUsuario(userData);
            navigate("/home");
        /*} catch (error) {
            alert(error.message);
        }*/
        } catch (error) {
            showAlert({
                titulos: "Error de autenticación",
                mensaje: error.message,
            })
        }
    };

    return (
        <>
            <EstiloChakra onSubmit={handleSubmit}>
                <Heading>Iniciar sesión</Heading>
                <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    placeholder="Contraseña"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" colorScheme="blue" width="full">
                    Acceder
                </Button>
            </EstiloChakra>

            <AlertaModal
                isOpen={alert.isOpen}
                titulo={alert.titulo}
                mensaje={alert.mensaje}
                onClose={closeAlert}
                onConfirm={closeAlert}
            />

        </>

        
    );
}

export default Login;



