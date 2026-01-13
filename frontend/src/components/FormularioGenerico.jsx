import { VStack } from "@chakra-ui/react";
import CampoDinamico from "./CampoDinamico";

function FormularioGenerico ({ campos, formData, onChange, backendUrl, iconoSrc }) {
    return (
        <VStack>
            {campos.map(campo => (
                <CampoDinamico
                    key={campo.name}
                    campo={campo}
                    value={formData[campo.name]}
                    onChange={val => onChange(campo.name, val)}
                    backendUrl={backendUrl}
                    iconoSrc={iconoSrc}
                />
            ))}
        </VStack>
    );
}

export default FormularioGenerico;