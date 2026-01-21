import { useState } from "react";
import EditarDatos from "../components/EditarDatos";
import { Input, FormControl, FormLabel, VStack, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import BotonCrear from "../components/BotonCrear";
import BackButton from "../components/BotonAtras";
import AutoCompletarInput from "../components/AutocompletarInput";

function EditarProducto({ producto }) {
    const [formData, setFormData] = useState({
        ...producto,
        familia: producto.familia || null
    });
    const navigate = useNavigate();

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const campos = [
        { name: "nombreProducto", label: "Nombre", type: "text" },
        { name: "IVA", label: "IVA", type: "select", options: [4, 5, 10, 21] },
        { name: "unidadMedida", label: "Unidad de medida", type: "select", options: ["Uds", "ML", "Caja", "Pack"] },
    ];

    const handleCambio = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const form = new FormData();
        form.append("nombreProducto", formData.nombreProducto);
        form.append("IVA", formData.IVA);
        form.append("unidadMedida", formData.unidadMedida);
        form.append("sku", formData.sku);

        if (formData.familia?._id) form.append("familia", formData.familia._id);
        if (formData.foto instanceof File) form.append("foto", formData.foto);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${backendUrl}/api/productos/${formData.sku}`, {
                method: "PUT",
                body: form,
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            const result = await res.json();
            if (result.success) navigate(`/producto/${formData.sku}`);
            else alert(result.error || "Error al actualizar producto");
        } catch (error) {
            console.error(error);
        }
    };

    const extra = {
        fileInput: handleChange => (
            <Input
                type="file"
                onChange={e => {
                    if (e.target.files?.[0]) handleChange("foto", e.target.files[0]);
                }}
            />
        ),
        children: (
            <VStack align="start" spacing={4} mt={4}>
                <FormControl>
                    <FormLabel>Familia</FormLabel>
                    <HStack>
                        <AutoCompletarInput
                            value={formData.familia}
                            onChange={val => handleCambio("familia", val)}
                            fetchOptions={`${backendUrl}/api/familias`}
                            multiple={false}
                            placeholder="Selecciona la familia"
                        />

                        <BotonCrear
                            recurso="familia"
                            apiUrl={`${backendUrl}/api/familias`}
                            campoNombre="nombre"
                            iconoSrc="/create.png"
                            onCreated={(nuevaFamilia) => {
                                const familiaObj = {
                                    _id: nuevaFamilia._id,
                                    nombre: nuevaFamilia.nombre
                                };
                                setFormData(prev => ({ ...prev, familia: familiaObj }));
                            }}
                        />
                    </HStack>
                </FormControl>
            </VStack>
        )
    };

    return (
        <EditarDatos
            recurso="producto"
            campos={campos}
            data={formData}
            handleChange={handleCambio}
            handleSubmit={handleSubmit}
            extra={extra}
            menu={<BackButton />}
        />
    );
}

export default EditarProducto;
