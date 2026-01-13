import { useState, useMemo } from "react";
import { Box, Input, Text, VStack, Table, Thead, Tbody, Tr, Th, Td, NumberInput, NumberInputField, Button } from "@chakra-ui/react";
import EditarDatos from "../components/EditarDatos";
import BackButton from "../components/BotonAtras";
import { useNavigate } from "react-router-dom";
import useProductosByProveedor from "../hooks/useProductoByProveedor";

function EditarPedido({ pedido }) {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const [proyectoTexto, setProyectoTexto] = useState(pedido.proyecto?.nombre || "");
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(pedido.proyecto || null);
    const [proyectoOpciones, setProyectoOpciones] = useState([]);
    const [dropdownProyectoOpen, setDropdownProyectoOpen] = useState(false);


    const [lineas, setLineas] = useState(
        pedido.productos.map((p) => ({
            _id: p._id,
            productoSeleccionado: p.productoProveedor,
            productoTexto: p.productoProveedor.producto.nombreProducto,
            cantidad: p.cantidad,
            precioUnitario: p.precioUnitario,
        }))
    );

    const [dropdownProductoOpenIndex, setDropdownProductoOpenIndex] = useState(null);
    const { filtrarProductos } = useProductosByProveedor(pedido.proveedor?._id, backendUrl);

    const { totalBruto, totalConIVA } = useMemo(() => {
        let bruto = 0;
        let conIVA = 0;

        lineas
            .filter(linea => linea.productoSeleccionado)
            .forEach(linea => {
                const cantidad = Number(linea.cantidad) || 0;
                const precio = Number(linea.precioUnitario) || 0;
                const iva = Number(linea.productoSeleccionado.producto?.IVA) / 100 || 0;

                bruto += cantidad * precio;
                conIVA += cantidad * precio * (1 + iva);
            });

        return { totalBruto: bruto, totalConIVA: conIVA };
    }, [lineas]);

    const handleAgregarFila = () => {
        setLineas(prev => [
            ...prev,
            { productoSeleccionado: null, productoTexto: "", cantidad: "", precioUnitario: 0 }
        ]);
    };

    const handleProductoChange = (index, valor) => {
        setLineas(prev => {
            const copy = [...prev];
            copy[index].productoTexto = valor;
            return copy;
        });

        setDropdownProductoOpenIndex(index);
    };

    const handleSeleccionProducto = (index, producto) => {
        setLineas(prev => {
            const copy = [...prev];
            copy[index].productoSeleccionado = producto;
            copy[index].productoTexto = producto.producto?.nombreProducto || "";
            copy[index].precioUnitario = producto.precioUnitario || 0;
            copy[index].cantidad = producto.cantidadMinima || 1;
            return copy;
        });

        setDropdownProductoOpenIndex(null);
    };

    const handleCantidadChange = (index, cantidad) => {
        setLineas(prev => {
            const copy = [...prev];
            copy[index].cantidad = cantidad;
            return copy;
        });
    };

    const handleEliminarLinea = (index) => {
        setLineas(prev => prev.filter((_, i) => i !== index));
    };

    const handleProyectoChange = async (valor) => {
        setProyectoTexto(valor);
        setDropdownProyectoOpen(true);

        if (!valor) {
            setProyectoOpciones([]);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${backendUrl}/api/proyectos?q=${valor}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            const data = await res.json();
            setProyectoOpciones(data.data || []);

        } catch (error) {
            console.error("Error buscando proyectos:", error);
            setProyectoOpciones([]);
        }
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            const body = {
                proyecto: proyectoSeleccionado?._id || null,
                productos: lineas
                .filter(l => l.productoSeleccionado)
                .map((l) => ({
                    _id: l._id,
                    productoProveedor: l.productoSeleccionado._id,
                    cantidad: l.cantidad,
                    precioUnitario: l.precioUnitario,
                })),
            };
            const res = await fetch(`${backendUrl}/api/pedidos/${pedido._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },

                body: JSON.stringify(body),
            });

            const result = await res.json();
            if (!result.success) {
                alert(result.message || "Error al actualizar pedido");
                return;
            }
            navigate(`/pedido/${pedido._id}`);

        } catch (error) {
            console.error("Error al guardar pedido:", error);
            alert("Error al guardar pedido");
        }
    };

    const extra = {
        children: (
            <Box>
                <Text mb={1}>Proyecto (opcional)</Text>

                <Input
                    placeholder="Buscar proyecto..."
                    value={proyectoTexto}
                    onChange={(e) => handleProyectoChange(e.target.value)}
                    onFocus={() => setDropdownProyectoOpen(true)}
                />
                {dropdownProyectoOpen && proyectoOpciones.length > 0 && (
                    <VStack align="start" spacing={1} mt={2}>
                        {proyectoOpciones.map(p => (
                            <Text
                                key={p._id}
                                cursor="pointer"
                                _hover={{ bg: "gray.100" }}
                                w="100%"
                                onClick={() => {
                                    setProyectoSeleccionado(p);
                                    setProyectoTexto(p.nombre);
                                    setDropdownProyectoOpen(false);
                                }}
                            >
                                {p.nombre}
                            </Text>
                        ))}
                    </VStack>
                )}

                <Box mt={4}>
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Producto</Th>
                                <Th>Cantidad</Th>
                                <Th>Acciones</Th>
                            </Tr>
                        </Thead>

                        <Tbody>
                            {lineas.map((linea, i) => {
                                const productosFiltrados = filtrarProductos(linea.productoTexto);
                                return (
                                    <Tr key={linea._id || i}>
                                        <Td>
                                            <Input
                                                placeholder="Buscar producto..."
                                                value={linea.productoTexto}
                                                onChange={(e) => handleProductoChange(i, e.target.value)}
                                                onFocus={() => setDropdownProductoOpenIndex(i)}
                                            />
                                            {dropdownProductoOpenIndex === i && productosFiltrados.length > 0 && (
                                                <VStack align="start" spacing={1} mt={1}>
                                                    {productosFiltrados.map(p => (
                                                        <Text
                                                            key={p._id}
                                                            cursor="pointer"
                                                            _hover={{ bg: "gray.100" }}
                                                            w="100%"
                                                            onClick={() => handleSeleccionProducto(i, p)}
                                                        >
                                                            {p.producto?.nombreProducto}
                                                        </Text>
                                                    ))}
                                                </VStack>
                                            )}
                                        </Td>

                                        <Td>
                                            <NumberInput
                                                min={linea.productoSeleccionado?.cantidadMinima || 1}
                                                value={linea.cantidad}
                                                onChange={(_, value) => handleCantidadChange(i, value)}
                                                onBlur={() => {
                                                    const min = linea.productoSeleccionado?.cantidadMinima || 1;
                                                    if (linea.cantidad < min) handleCantidadChange(i, min);
                                                }}
                                            >

                                                <NumberInputField
                                                    placeholder={linea.productoSeleccionado ? `Mínimo: ${linea.productoSeleccionado.cantidadMinima || 1} unidades` : ""}
                                                />
                                            </NumberInput>
                                        </Td>

                                        <Td>
                                            <Button colorScheme="red" size="sm" onClick={() => handleEliminarLinea(i)}>
                                                Eliminar
                                            </Button>
                                        </Td>
                                    </Tr>
                                );
                            })}
                        </Tbody>
                    </Table>
                </Box>

                <Box mt={4}>
                    <Text>Total bruto: {totalBruto.toFixed(2)} €</Text>
                    <Text>Total con IVA: {totalConIVA.toFixed(2)} €</Text>
                </Box>

                <Box mt={4}>
                    <Button onClick={handleAgregarFila}>Añadir producto</Button>
                </Box>

            </Box>
        ),
    };

    return (
        <EditarDatos
            recurso="pedido"
            campos={[]}
            data={{}}
            handleChange={() => {}}
            handleSubmit={handleSubmit}
            extra={extra}
            menu={<BackButton />}
        />
    );
}

export default EditarPedido;