import { FormControl, FormLabel, HStack, Input, Select, useTheme } from "@chakra-ui/react";
import AutoCompletarInput from "./AutoCompletarInput";
import BotonCrearElemento from "./BotonCrearElemento";

function CampoDinamico({ campo, value, onChange, backendUrl, iconoSrc }) {
    const theme = useTheme();
    const styles = theme.components.EditarDatosForm;

    switch (campo.type) {
        case "select":
            return (
                <FormControl>
                    <FormLabel>{campo.label}</FormLabel>
                    <Select
                        value={value ?? ""}
                        onChange={e => {
                            let val = e.target.value;
                            if (campo.parse === "number") {
                                val = val === "" ? "" : Number(val);
                            }
                            onChange(val);
                        }}
                    >
                        <option value="">Seleccionar...</option>
                        {campo.options.map(opt => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </Select>
                </FormControl>
            );

        case "file":
            return (
                <FormControl>
                    <FormLabel>{campo.label}</FormLabel>
                    <Input
                        type="file"
                        onChange={e => onChange(e.target.files[0])}
                    />
                </FormControl>
            );

        case "autocomplete":
            return (
                <FormControl>
                    <FormLabel>{campo.label}</FormLabel>
                    <HStack sx={styles.parts.autocompleteWrapper}> 
                        <AutoCompletarInput
                            value={value ?? null}
                            onChange={(val) => {
                                if (!val) return;
                                onChange(val._id);
                            }}
                            fetchOptions={`${backendUrl}${campo.fetchOptions}`}
                            placeholder={campo.placeholder || ""}
                            multiple={campo.multiple || false}
                            token={localStorage.getItem("token")}
                        />


                        {campo.onCreate && (
                            <BotonCrearElemento
                                recurso={campo.label}
                                apiUrl={`${backendUrl}${campo.onCreate.apiUrl}`}
                                campos={campo.onCreate.campos}
                                iconoSrc={iconoSrc}
                                backendUrl={backendUrl}
                                onCreated={(nuevo) => {
                                    if (campo.multiple) {
                                            onChange([...(value || []), nuevo]);
                                    } else {
                                        onChange(nuevo);
                                    }
                                }}
                            />
                        )}
                    </HStack>
                </FormControl>
            );

        default:
            return (
                <FormControl>
                    <FormLabel>{campo.label}</FormLabel>
                    <Input
                        type={campo.type || "text"}
                        value={value ?? ""}
                        onChange={e =>
                            onChange(
                            campo.type === "number"
                                ? Number(e.target.value)
                                : e.target.value
                            )
                        }
                    />
                </FormControl>
            );
    }
}

export default CampoDinamico;