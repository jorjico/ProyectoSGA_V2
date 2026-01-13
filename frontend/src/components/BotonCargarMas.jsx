import { Box, Button, useTheme } from "@chakra-ui/react";

function BotonCargarMas({ onClick, loading, hayMas }) {
    const theme = useTheme();
    const styles = theme.components.BotonCargarMas;

    if (!hayMas) return null;

    return (
        <Box sx={styles.container}>
        <Button sx={styles.button} onClick={onClick} isLoading={loading}>
            Ver más
        </Button>
        </Box>
    );
}

export default BotonCargarMas;
