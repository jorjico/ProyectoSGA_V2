import { Box, Button, FormControl, FormLabel, Input, VStack, Image, Select, useTheme } from "@chakra-ui/react";
import MenuBar from "./MenuBar";

function EditarDatos({ recurso, campos, data, handleChange, handleSubmit, extra, menu }) {
    const theme = useTheme();
    const styles = theme.components.EditarDatosForm;

    return (
        <Box>
            {menu && <MenuBar>{menu}</MenuBar>}

            <Box
                as="form"
                sx={styles?.baseStyle}
                onSubmit={e => { e.preventDefault(); handleSubmit(); }}
                
            >
                <VStack spacing={4} align="stretch">

                    {campos.map(f => (
                        <FormControl key={f.name}>
                            <FormLabel>{f.label}</FormLabel>
                            {f.type === "select" ? (
                                <Select
                                    value={data[f.name] || ""}
                                    onChange={e => handleChange(f.name, e.target.value)}
                                >
                                    {f.options.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </Select>
                            ) : (

                                <Input
                                    type={f.type}
                                    value={data[f.name] || ""}
                                    onChange={e => handleChange(f.name, e.target.value)}
                                />
                            )}
                        </FormControl>
                    ))}

                    {extra?.fileInput && extra.fileInput(handleChange)}

                    {extra?.children && (
                            <VStack spacing={4} align="start">
                                {extra.children}
                            </VStack>
                    )}

                    {data.foto && typeof data.foto === "string" && (
                        <Image src={data.foto} alt="Vista previa" />
                    )}

                    <Button type="submit">
                        Guardar {recurso}
                    </Button>

                </VStack>
            </Box>
        </Box>
    );
}

export default EditarDatos;
