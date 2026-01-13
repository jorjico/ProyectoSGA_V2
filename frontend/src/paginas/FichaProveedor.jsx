import { Box, Card, CardBody, Heading, SimpleGrid, Stack, Text, useTheme } from "@chakra-ui/react";
import proveedoresStyle from "../theme/ProveedorStyle";
import { useNavigate, useParams } from "react-router-dom";
import MenuBar from "../components/MenuBar";
import BackButton from "../components/BotonAtras";
import BotonEliminarElemento from "../components/BotonEliminarElemento";
import BotonEditarProveedor from "../components/BotonEditarProveedor";
import useProveedorById from "../hooks/useProveedorById";
import { useState, useEffect } from "react";
import BotonCrearElemento from "../components/BotonCrearElemento";

function FichaProveedor() {
    const theme = useTheme();
    const styles = proveedoresStyle(theme);
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const { id } = useParams();
    const { proveedor, loading, error } = useProveedorById(id);

    const [contactos, setContactos] = useState([]);
    const [loadingContactos, setLoadingContactos] = useState(false);
    const [errorContactos, setErrorContactos] = useState(null);

    useEffect(() => {
        if (!proveedor) return;

        const fetchContactos = async () => {
            try {
                setLoadingContactos(true);
                const token = localStorage.getItem("token");

                const res = await fetch(`${backendUrl}/api/contactos-proveedores?proveedorId=${proveedor._id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Error cargando contactos: ${text}`);
                }

                const data = await res.json();
                if (data.success) {
                    setContactos(data.data);
                } else {
                    setErrorContactos(new Error(data.message));
                }

            } catch (err) {
                console.error(err);
                setErrorContactos(err);
            } finally {
                setLoadingContactos(false);
            }
        };

        fetchContactos();
    }, [proveedor, backendUrl]);

    if (loading) return <h1>Cargando proveedor...</h1>;
    if (error) return <h1>Error: {error.message}</h1>;
    if (!proveedor) return <h1>No se encontró el proveedor</h1>;

    const handleDeleted = () => {
        navigate("/proveedores/ver");
    };

    return (
        <Box>
            <MenuBar>
                <BackButton />

                <BotonEditarProveedor
                    recurso="proveedor"
                    id={proveedor._id}
                    apiUrl={`${backendUrl}/api/proveedores/${proveedor._id}`}
                />

                <BotonEliminarElemento
                    recurso="proveedor"
                    apiUrl={`${backendUrl}/api/proveedores/${proveedor._id}`}
                    onDeleted={handleDeleted}
                />

                <BotonCrearElemento
                    recurso="contacto"
                    apiUrl={`${backendUrl}/api/contactos-proveedores`}
                    backendUrl={backendUrl}
                    iconoSrc="/create.png"
                    campos={[
                        { name: "nombre", label: "Nombre", type: "text" },
                        { name: "cargo", label: "Cargo", type: "text" },
                        { name: "telefono", label: "Teléfono", type: "text" },
                        { name: "email", label: "Email", type: "email" },
                        { name: "proveedor", label: "Proveedor", type: "hidden", default: proveedor._id },
                    ]}
                    extra={{
                        children: (
                            <Text>
                                <Text as="span" fontWeight="bold">Proveedor:</Text> {proveedor.nombre}
                            </Text>
                        )
                    }}
                    onCreated={(nuevoContacto) => {
                        setContactos(prev => [nuevoContacto, ...prev]);
                        navigate(`/proveedores/${proveedor._id}`);
                    }}
                />

            </MenuBar>

            <Box sx={styles.fichaContainer}>
                <Heading sx={styles.fichaTitulo}>{proveedor.nombre}</Heading>

                <Box sx={styles.fichaRow}>
                    <Stack sx={styles.fichaInfo}>
                        <Text sx={styles.fichaText}><Text sx={styles.fichaLabel}>CIF:</Text> {proveedor.CIF}</Text>
                        <Text sx={styles.fichaText}><Text sx={styles.fichaLabel}>Dirección:</Text> {proveedor.direccion}</Text>
                        <Text sx={styles.fichaText}><Text sx={styles.fichaLabel}>Código Postal:</Text> {proveedor.codigoPostal}</Text>
                        <Text sx={styles.fichaText}><Text sx={styles.fichaLabel}>País:</Text> {proveedor.pais}</Text>
                        <Text sx={styles.fichaText}><Text sx={styles.fichaLabel}>Condiciones de Pago:</Text> {proveedor.condicionesPago}</Text>
                        <Text sx={styles.fichaText}><Text sx={styles.fichaLabel}>Días de Entrega:</Text> {proveedor.diasTiempoEntrega}</Text>
                        <Text sx={styles.fichaText}><Text sx={styles.fichaLabel}>Activo:</Text> {proveedor.activo ? "Sí" : "No"}</Text>
                        <Text sx={styles.fichaText}><Text sx={styles.fichaLabel}>Creado el:</Text> {new Date(proveedor.createdAt).toLocaleDateString()}</Text>
                        <Text sx={styles.fichaText}><Text sx={styles.fichaLabel}>Última actualización:</Text> {new Date(proveedor.updatedAt).toLocaleDateString()}</Text>
                    </Stack>
                </Box>

                <Box sx={styles.fichaContactosBox}>
                    <Heading sx={styles.fichaContactosTitulo}>Contactos asociados</Heading>

                    {loadingContactos && <Text>Cargando contactos...</Text>}
                    {errorContactos && <Text>Error al cargar contactos: {errorContactos.message}</Text>}

                    {!loadingContactos && contactos.length > 0 ? (
                        <SimpleGrid columns={styles.contactoGrid.columns} spacing={styles.contactoGrid.spacing}>
                            {contactos.map(contacto => (

                                <Card
                                    key={contacto._id}
                                    sx={styles.contactoCard}
                                    onClick={() => navigate(`/contactos-proveedores/${contacto._id}`)}
                                >

                                    <CardBody sx={styles.cardBody}>
                                        <Heading sx={styles.cardTitle}>{contacto.nombre}</Heading>

                                        <Text sx={styles.contactoCardInfo}> {contacto.cargo} </Text>
                                    </CardBody>
                                </Card>
                            ))}
                        </SimpleGrid>
                    ) : (
                        !loadingContactos && <Text>No hay contactos asociados a este proveedor</Text>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default FichaProveedor;