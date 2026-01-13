import {Box, Heading, VStack, HStack, Button, Input, Text, Textarea, useTheme } from "@chakra-ui/react";
import { useState } from "react";
import CampoDinamico from "../components/CampoDinamico";
import productosStyle from "../theme/productosStyle";
import MenuBar from "../components/MenuBar";
import BackButton from "../components/BotonAtras";

function RegistrarSalida() {
    const theme = useTheme();
    const styles = productosStyle(theme);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const [proyectoId, setProyectoId] = useState(null);
    const [motivo, setMotivo] = useState("");
    const [fechaSalida, setFechaSalida] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [notas, setNotas] = useState("");

    const [productosSalida, setProductosSalida] = useState([
        { productoSeleccionado: null, productoTexto: "", cantidad: 1, opciones: [], dropdownOpen: false },
    ]);

    const token = localStorage.getItem("token");

        const agregarProducto = () => {
        setProductosSalida((prev) => [
            ...prev,
            { productoSeleccionado: null, productoTexto: "", cantidad: 1, opciones: [], dropdownOpen: false },
        ]);
    };

    const validarFormulario = () => {
        if (!motivo && !proyectoId) {
            alert("Debes rellenar al menos proyecto o motivo.");
            return false;
        }
        if (productosSalida.length === 0) {
            alert("Debes añadir al menos un producto.");
            return false;
        }
        for (const p of productosSalida) {
            if (!p.productoSeleccionado) {
                alert("Debes seleccionar todos los productos.");
                return false;
            }
            if (p.cantidad <= 0) {
                    alert("La cantidad debe ser mayor que 0.");
                    return false;
            }
        }

        return true;
    };


    const buscarProductos = async (texto, index) => {
        if (!texto) {
            const copy = [...productosSalida];
            copy[index].opciones = [];
            copy[index].dropdownOpen = false;
            setProductosSalida(copy);
            return;
        }

        try {
            const res = await fetch(
                `${backendUrl}/api/productos?nombreProducto=${encodeURIComponent(texto)}`,
                {headers: token ? { Authorization: `Bearer ${token}` } : {},}
            );

            const data = await res.json();

            const copy = [...productosSalida];
            copy[index].opciones = data.data || [];
            copy[index].dropdownOpen = true;
            setProductosSalida(copy);

        } catch (err) {
            console.error("Error buscando productos:", err);
        }
    };


    const registrarSalida = async () => {
        if (!validarFormulario()) return;

        const payload = {
            proyecto: proyectoId,
            motivo,
            fechaSalida,
            notas,
            productos: productosSalida.map((p) => ({
                producto: p.productoSeleccionado._id,
                sku: p.productoSeleccionado.sku,
                nombreProducto: p.productoTexto,
                cantidad: p.cantidad,
            })),
        };

        try {
            const res = await fetch(`${backendUrl}/api/salidas`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!data.success) {
                alert("Error al crear salida: " + data.message);
                return;
            }

            alert("Salida creada correctamente!");
            console.log("Salida creada:", data.data);


            setProyectoId(null);
            setMotivo("");
            setFechaSalida(new Date().toISOString().split("T")[0]);
            setNotas("");
            setProductosSalida([
                { productoSeleccionado: null, productoTexto: "", cantidad: 1, opciones: [], dropdownOpen: false },
            ]);

        } catch (error) {
            console.error("Error al crear salida:", error);
            alert("Error al crear salida");
        }
    };

    return (

        <Box>
            <MenuBar>
                <BackButton />
            </MenuBar>


            <Box sx={styles.container}>
                <Heading sx={styles.fichaTitulo}>Registrar Salida</Heading>

                <VStack spacing={6} align="stretch" sx={styles.fichaRow}>

                    <Box sx={styles.SalidaBox}>
                        <Box>
                            <Text sx={styles.fichaText}>Fecha de salida</Text>
                            <Input
                                type="date"
                                value={fechaSalida}
                                onChange={(e) => setFechaSalida(e.target.value)}
                                sx={styles.fechaInput}
                            />
                        </Box>


                        <Text sx={styles.fichaText}>
                            Selecciona Proyecto y/o motivo de la salida
                        </Text>

                        <CampoDinamico
                            campo={{
                                type: "autocomplete",
                                fetchOptions: "/api/proyectos",
                                placeholder: "Buscar proyecto...",
                            }}
                            value={proyectoId}
                            onChange={setProyectoId}
                            backendUrl={backendUrl}
                        />

                        <Box>
                            <Input
                                placeholder="Motivo de la salida"
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                                sx={styles.inputField}
                            />
                        </Box>

                        <VStack spacing={4} align="stretch">
                            <Text sx={styles.fichaText}>
                                Selecciona Producto/s
                            </Text>

                            {productosSalida.map((linea, index) => (
                                <Box key={index} sx={styles.productoFila}>
                                    <Box sx={styles.productoCol}>
                                        <Input
                                            placeholder="Buscar producto..."
                                            value={linea.productoTexto}
                                            onChange={(e) => {
                                                const texto = e.target.value;
                                                const copy = [...productosSalida];
                                                copy[index].productoTexto = texto;
                                                setProductosSalida(copy);
                                                buscarProductos(texto, index);
                                            }}
                                        />

                                        {linea.dropdownOpen && linea.opciones.length > 0 && (
                                            <VStack align="start" spacing={1}>
                                                {linea.opciones.map((p) => (
                                                    <Text
                                                        key={p._id}
                                                        cursor="pointer"
                                                        onClick={() => {
                                                            const copy = [...productosSalida];
                                                            copy[index].productoSeleccionado = p;
                                                            copy[index].productoTexto = p.nombreProducto;
                                                            copy[index].dropdownOpen = false;
                                                            setProductosSalida(copy);
                                                        }}
                                                    >
                                                        {p.nombreProducto}
                                                    </Text>
                                                ))}
                                            </VStack>
                                        )}
                                    </Box>

                                    <Box sx={styles.cantidadCol}>
                                        <Input
                                            type="number"
                                            min={1}
                                            value={linea.cantidad}
                                            onChange={(e) => {
                                                const copy = [...productosSalida];
                                                copy[index].cantidad = Number(e.target.value);
                                                setProductosSalida(copy);
                                            }}
                                        />
                                    </Box>
                                </Box>
                            ))}
                        </VStack>

                        <Box sx={styles.buttonContainer}>
                            <Button sx={styles.buttonAñadirProducto} onClick={agregarProducto}>
                                Añadir producto
                            </Button>
                        </Box>

                        <Box>
                            <Text sx={styles.inputLabel}>Notas (opcional)</Text>
                            <Textarea
                                placeholder="Notas adicionales"
                                value={notas}
                                onChange={(e) => setNotas(e.target.value)}
                                sx={styles.inputField}
                            />
                        </Box>

                        <Box Box sx={styles.buttonContainer}>
                            <Button sx={styles.buttonAñadirProducto} onClick={registrarSalida}>
                                Registrar Salida
                            </Button>
                        </Box>
                    </Box>
                </VStack>
            </Box>
        </Box>
    );
}

export default RegistrarSalida;