import { Box, Input, useMultiStyleConfig, useOutsideClick, VStack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

function AutoCompletarInput({
    value,
    onChange,
    fetchOptions,
    multiple = false,
    placeholder = "Seleccionar...",
    token
}) {
    const styles = useMultiStyleConfig("AutoCompletar");
    const [buscar, setBuscar] = useState("");
    const [opciones, setOpciones] = useState([]);
    const [seleccionado, setSeleccionado] = useState(multiple ? [] : null);
    const [open, setOpen] = useState(false);
    const ref = useRef();

    useOutsideClick({
        ref: ref,
        handler: () => setOpen(false),
    });

    useEffect(() => {
        setSeleccionado(value || (multiple ? [] : null));

        if (multiple) {
            setBuscar("");

        } else {
            setBuscar(value?.nombre || "");
        }
    }, [value, multiple]);


    useEffect(() => {
        if (!buscar) return;

        const fetchData = async () => {
            try {
                const url = fetchOptions.includes("?") 
                    ? `${fetchOptions}&q=${encodeURIComponent(buscar)}`
                    : `${fetchOptions}?q=${encodeURIComponent(buscar)}`;
                
                const res = await fetch(url, {
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {})
                    }
                });

                const data = await res.json();
                setOpciones(data.data || []);
                setOpen(true);

            } catch (error) {
                console.error("Error fetching options:", error);
            }
            };

            fetchData();
        }, [buscar, fetchOptions, token]);

        const handleSelect = (option) => {
            if (!option) return;
            if (multiple) {
                const updated = [...(seleccionado || []), option];
                setSeleccionado(updated);
                onChange(updated);
                setBuscar("");
            } else {
                setSeleccionado(option);
                onChange(option);
                setBuscar(option.nombre);
                setOpen(false);
            }
        };

        return (
        <Box position="relative" ref={ref} w="full">
            <Input
                value={buscar}
                onChange={e => setBuscar(e.target.value)}
                placeholder={placeholder}
                onFocus={() => setOpen(true)}
            />

            {open && opciones.length > 0 && (
                <VStack __css={styles.dropdown}>
                    {opciones.map(opt => (
                        <Box
                            key={opt._id}
                            __css={styles.option}
                            onClick={() => handleSelect(opt)}
                            cursor="pointer"
                        >
                            {opt.nombre}
                        </Box>
                    ))}
                </VStack>
            )}
        </Box>
    );
}

export default AutoCompletarInput;