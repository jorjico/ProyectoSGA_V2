import { Box, VStack, Text, Table, Thead, Tbody, Tr, Th, Td, Input, useTheme } from "@chakra-ui/react";
import { useState, useMemo } from "react";
import comprasStyle from "../theme/comprasStyle";
import useCrearPedido from "../hooks/useCrearPedido";
import useProductosByProveedor from "../hooks/useProductoByProveedor";
import TotalesPedido from "./TotalesPedido";
import BotonConIcono from "./BotonConIcono";
import BotonHacerPedido from "./BotonHacerPedido";
import { useNavigate } from "react-router-dom";

function CrearPedidoForm({ backendUrl: backendUrlProp }) {
    const theme = useTheme();
    const styles = comprasStyle(theme);
    const backendUrl = backendUrlProp || import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const navigate = useNavigate();

    const {
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
        setProyectoOpciones,
    } = useCrearPedido(backendUrl);

    const { filtrarProductos } = useProductosByProveedor(proveedorSeleccionado?._id, backendUrl);

    const [lineasPedido, setLineasPedido] = useState([
        { productoSeleccionado: null, productoTexto: "", cantidad: "", precioUnitario: 0, total: 0 },
    ]);

    const [dropdownProveedorOpen, setDropdownProveedorOpen] = useState(false);
    const [dropdownProyectoOpen, setDropdownProyectoOpen] = useState(false);
    const [dropdownProductoOpenIndex, setDropdownProductoOpenIndex] = useState(null);

    const { totalBruto, totalConIVA } = useMemo(() => {
        let bruto = 0;
        let conIVA = 0;
        lineasPedido.forEach((linea) => {
            const subtotal = linea.total || 0;
            const iva = (linea.productoSeleccionado?.producto?.IVA || 0) / 100;
            bruto += subtotal;
            conIVA += subtotal * (1 + iva);
        });

        return { totalBruto: bruto, totalConIVA: conIVA };
        
    }, [lineasPedido]);

    const handleAgregarFila = () => {
        setLineasPedido(prev => [
            ...prev,
            { productoSeleccionado: null, productoTexto: "", cantidad: "", precioUnitario: 0, total: 0 }
        ]);
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

    return (
        <Box sx={styles.pedidoContainer1}>
            <VStack align="start" spacing={4}>
                <Box>
                    <Text>Proveedor</Text>
                    <Input
                        placeholder="Buscar proveedor..."
                        value={proveedorTexto}
                        onChange={(e) => {
                            setProveedorTexto(e.target.value);
                            setDropdownProveedorOpen(true);
                        }}
                        onFocus={() => setDropdownProveedorOpen(true)}
                    />
                    {dropdownProveedorOpen && proveedorOpciones.length > 0 && (
                        <VStack align="start" spacing={1}>
                            {proveedorOpciones.map(p => (
                                <Text
                                    key={p._id}
                                    cursor="pointer"
                                    onClick={() => {
                                        setProveedorSeleccionado(p);
                                        setProveedorTexto(p.nombre);
                                        setLineasPedido([{
                                            productoSeleccionado: null,
                                            productoTexto: "",
                                            cantidad: "",
                                            precioUnitario: 0,
                                            total: 0
                                        }]);
                                        setDropdownProveedorOpen(false);
                                    }}
                                >
                                    {p.nombre}
                                </Text>
                            ))}
                        </VStack>
                    )}
                </Box>

                <Box>
                    <Text>Proyecto (opcional)</Text>
                    <Input
                        placeholder="Buscar proyecto..."
                        value={proyectoTexto}
                        onChange={(e) => handleProyectoChange(e.target.value)}
                        onFocus={() => setDropdownProyectoOpen(true)}
                    />
                    {dropdownProyectoOpen && proyectoOpciones.length > 0 && (
                        <VStack align="start" spacing={1}>
                            {proyectoOpciones.map(p => (
                                <Text
                                    key={p._id}
                                    cursor="pointer"
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
                </Box>

                <Table variant="simple">
                    <Thead>
                        <Tr>
                        <Th>Producto</Th>
                        <Th>SKU</Th>
                        <Th>Referencia Proveedor</Th>
                        <Th>Cantidad</Th>
                        <Th>Ud. Medida</Th>
                        <Th>Precio Unitario</Th>
                        <Th>Importe Bruto</Th>
                        <Th>IVA</Th>
                        <Th>Importe con IVA</Th>
                        </Tr>
                    </Thead>

                    <Tbody>
                        {lineasPedido.map((linea, i) => {
                            const productosFiltrados = filtrarProductos(linea.productoTexto);
                            return (
                                <Tr key={i}>
                                    <Td>
                                        <Input
                                            placeholder="Buscar producto..."
                                            value={linea.productoTexto}
                                            onChange={(e) => {
                                                setLineasPedido(prev => {
                                                    const copy = [...prev];
                                                    copy[i].productoTexto = e.target.value;
                                                    return copy;
                                                });
                                                setDropdownProductoOpenIndex(i);
                                            }}
                                            onFocus={() => setDropdownProductoOpenIndex(i)}
                                        />
                                        {dropdownProductoOpenIndex === i && productosFiltrados.length > 0 && (
                                            <VStack align="start" spacing={1}>
                                                {productosFiltrados.map(p => (
                                                    <Text
                                                        key={p._id}
                                                        cursor="pointer"
                                                        onClick={() => {
                                                            setLineasPedido(prev => {
                                                                const copy = [...prev];
                                                                copy[i].productoSeleccionado = p;
                                                                copy[i].productoTexto = p.producto?.nombreProducto || "";
                                                                copy[i].precioUnitario = p.precioUnitario || 0;
                                                                copy[i].cantidad = "";
                                                                copy[i].total = 0;
                                                                return copy;
                                                            });
                                                            setDropdownProductoOpenIndex(null);
                                                        }}
                                                    >
                                                        {p.producto?.nombreProducto}
                                                    </Text>
                                                ))}
                                            </VStack>
                                        )}
                                    </Td>

                                    <Td>{linea.productoSeleccionado?.producto?.sku || "-"}</Td>

                                    <Td>{linea.productoSeleccionado?.referenciaProveedor || "-"}</Td>

                                    <Td>
                                        <Input
                                            type="number"
                                            placeholder={linea.productoSeleccionado ? `Mínimo: ${linea.productoSeleccionado.cantidadMinima || 1} unidades` : ""}
                                            value={linea.cantidad}
                                            onChange={(e) => {
                                                const valor = e.target.value;
                                                setLineasPedido(prev => {
                                                    const copy = [...prev];
                                                    copy[i].cantidad = valor;
                                                    copy[i].total = copy[i].precioUnitario * (Number(valor) || 0);
                                                    return copy;
                                                });
                                            }}
                                            onBlur={(e) => {
                                                const valor = Number(e.target.value);
                                                const min = linea.productoSeleccionado?.cantidadMinima || 1;
                                                setLineasPedido(prev => {
                                                    const copy = [...prev];
                                                    copy[i].cantidad = Math.max(valor, min);
                                                    copy[i].total = copy[i].precioUnitario * copy[i].cantidad;
                                                    return copy;
                                                });
                                            }}
                                        />
                                    </Td>

                                    <Td>{linea.productoSeleccionado?.producto?.unidadMedida || "-"}</Td>

                                    <Td>{linea.productoSeleccionado ? `${linea.precioUnitario?.toFixed(2) || 0} ${linea.productoSeleccionado.moneda || "EUR"}` : "-"}</Td>

                                    <Td>{linea.total && linea.productoSeleccionado ? `${linea.total.toFixed(2)} ${linea.productoSeleccionado.moneda || "EUR"}` : "-"}</Td>

                                    <Td>{linea.total && linea.productoSeleccionado?.producto?.IVA != null ? `${(linea.total * (linea.productoSeleccionado.producto.IVA / 100)).toFixed(2)} ${linea.productoSeleccionado.moneda || "EUR"}` : "-"}</Td>
                                    
                                    <Td>{linea.total && linea.productoSeleccionado?.producto?.IVA != null ? `${(linea.total * (1 + linea.productoSeleccionado.producto.IVA / 100)).toFixed(2)} ${linea.productoSeleccionado.moneda || "EUR"}` : "-"}</Td>
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>

                <BotonConIcono
                    text="Añadir producto"
                    iconoSrc="/create.png"
                    onClick={handleAgregarFila}
                />

                <TotalesPedido totalBruto={totalBruto} totalConIVA={totalConIVA} styles={{}} />

                <BotonHacerPedido
                    proveedorSeleccionado={proveedorSeleccionado}
                    proyectoSeleccionado={proyectoSeleccionado}
                    lineasPedido={lineasPedido}
                    backendUrl={backendUrl}
                    onCreated={(pedido) => {
                        console.log("Pedido creado:", pedido);
                        setLineasPedido([{ productoSeleccionado: null, productoTexto: "", cantidad: "", precioUnitario: 0, total: 0 }]);
                        setProveedorSeleccionado(null);
                        setProveedorTexto("");
                        setProyectoSeleccionado(null);
                        setProyectoTexto("");
                        navigate("/pedidos");
                    }}
                />
            </VStack>
        </Box>
    );
}

export default CrearPedidoForm;