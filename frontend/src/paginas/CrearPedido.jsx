import { Box, useTheme } from "@chakra-ui/react";
import comprasStyle from "../theme/comprasStyle";
import useCrearPedido from "../hooks/useCrearPedido";
import CrearPedidoForm from "../components/CrearPedidoForm";

export default function CrearPedido() {
    const theme = useTheme();
    const styles = comprasStyle(theme);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const crearPedidoHook = useCrearPedido(backendUrl);

    return (
        <Box sx={styles.pedidoContainer1}>
            <CrearPedidoForm
                backendUrl={backendUrl}
                
                proveedorProps={{
                    texto: crearPedidoHook.proveedorTexto,
                    setTexto: crearPedidoHook.setProveedorTexto,
                    seleccionado: crearPedidoHook.proveedorSeleccionado,
                    setSeleccionado: crearPedidoHook.setProveedorSeleccionado,
                    opciones: crearPedidoHook.proveedorOpciones,
                }}

                proyectoProps={{
                    texto: crearPedidoHook.proyectoTexto,
                    setTexto: crearPedidoHook.setProyectoTexto,
                    seleccionado: crearPedidoHook.proyectoSeleccionado,
                    setSeleccionado: crearPedidoHook.setProyectoSeleccionado,
                    opciones: crearPedidoHook.proyectoOpciones,
                }}
            />
        </Box>
    );
}