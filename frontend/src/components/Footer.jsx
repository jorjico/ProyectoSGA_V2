import { Box, Text, useStyleConfig } from "@chakra-ui/react";

function Footer() {

    const styles = useStyleConfig("Footer")

    return (
        <Box __css={styles}>
            <Text >Proyecto SGA - Rock The Code</Text>
        </Box>       
    );
}

export default Footer;