import { Box, useTheme } from "@chakra-ui/react"

const MenuBar = ({children}) => {
        const theme = useTheme();
        const styles = theme.components.MenuBar;
    return (
        <Box sx={styles.baseStyle}>
            {children}
        </Box>
    )
};

export default MenuBar;