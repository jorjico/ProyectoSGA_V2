import { useState, useContext } from "react";
import { Heading, Input, Button } from "@chakra-ui/react";
import { UsuarioContext } from "../context/UsuarioContext.jsx";
import { useNavigate } from "react-router-dom";
import { EstiloChakra } from "../components/EstiloChakra.jsx";

function Login() {
    const { setUsuario } = useContext(UsuarioContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:4000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) throw new Error("Email o contraseña incorrectos");
            const data = await res.json();

            localStorage.setItem("token", data.token);

            const usuarioRes = await fetch("http://localhost:4000/api/auth/usuario", {
                headers: { Authorization: `Bearer ${data.token}` },
            });

            if (!usuarioRes.ok) throw new Error("No se pudo obtener el usuario");
            const userData = await usuarioRes.json();

            setUsuario(userData);
            navigate("/home");
        } catch (error) {
        alert(error.message);
        }
    };

    return (
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
    );
}

export default Login;



