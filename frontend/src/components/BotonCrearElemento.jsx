import { useState } from "react";
import BotonConIcono from "./BotonConIcono";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useTheme, useToast  } from "@chakra-ui/react";
import FormularioGenerico from "./FormularioGenerico";

function BotonCrearElemento({ recurso, apiUrl, campos, iconoSrc, onCreated, backendUrl }) {
    const theme = useTheme();
    const styles = theme.components.EditarDatosForm;


    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState(
        (campos || []).reduce((acc, campo) => ({ ...acc, [campo.name]: campo.default || "" }), {})
    );

    const toast = useToast();
    
    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");

            let body;
            const haveFile = Object.values(formData).some(val => val instanceof File);

            if (haveFile) {
                body = new FormData();
                for (const key in formData) {
                    if (Array.isArray(formData[key])) {
                        formData[key].forEach(item => body.append(key, item));
                    } else {
                        body.append(key, formData[key]);
                    }
                }

            }else {
                body = JSON.stringify(formData);
            }

            const res = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    ...(haveFile ? {} : { "Content-Type": "application/json" }),
                },
                body
            });

            const result = await res.json();

            if (result.success) {
                toast({ title: "Creado", description: `${recurso} creado correctamente`, status: "success" });
                onCreated && onCreated(result.data);
                setIsOpen(false);
                setFormData(campos.reduce((acc, campo) => ({ ...acc, [campo.name]: campo.default || "" }), {}));
            } else {
                toast({ title: "Error", description: result.error || "Error al crear", status: "error" });
            }
        
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: error.message, status: "error" });
        }
    };

    return (
        <>
            <BotonConIcono
                text={`Crear ${recurso}`}
                iconoSrc={iconoSrc}
                onClick={() => setIsOpen(true)}
            />

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Crear {recurso}</ModalHeader>
                    <ModalBody>
                        <FormularioGenerico
                            campos={campos}
                            formData={formData}
                            onChange={handleChange}
                            backendUrl={backendUrl}
                            iconoSrc={iconoSrc}
                        />
                    </ModalBody>
                    <ModalFooter sx={styles.parts.modalButton}>
                        <Button onClick={handleSubmit}>Crear</Button>
                        <Button onClick={() => setIsOpen(false)}>Cancelar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default BotonCrearElemento;