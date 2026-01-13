import { Button, Image, useTheme } from "@chakra-ui/react";

function BotonConIcono({text, iconoSrc, onClick }) {
    const theme = useTheme();
    const styles = theme.components.BotonconIcono;

    return (
        <Button sx={styles.baseStyle} onClick={onClick}>
            {text}

            <Image src={iconoSrc} sx={styles.parts.icon} />
        </Button>
    );
}

export default BotonConIcono;

