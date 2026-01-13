import { Box, Image, Input, InputGroup, InputLeftElement, useTheme } from "@chakra-ui/react";
import { useState } from "react";

function Buscador({ placeholder = "Buscar...", onSearch }) {
    const [term, setTerm] = useState("");
    const theme = useTheme();
    const styles = theme.components.Buscador.baseStyle;

    
    const handleSearch = () => {
        if (onSearch) onSearch(term);
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && onSearch) {
            onSearch(term)
        }
    };

    return (
        <Box sx={styles.container}>
            <InputGroup>
                <InputLeftElement sx={styles.leftElement} onClick={handleSearch}>
                    <Image 
                        src="/search.png" 
                        alt="Buscar" 
                    />
                </InputLeftElement>
                <Input
                    placeholder={placeholder}
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    sx={styles.input}
                />
            </InputGroup>
        </Box>
    );
}

export default Buscador;