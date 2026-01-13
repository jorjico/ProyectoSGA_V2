const homeStyle = (theme) => ({
    container: {
        p: 6,
        bg: theme.colors.SGA.bg1,
        color: theme.colors.SGA.color2,
        minH: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },

    cardRow: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
        flexDirection: { base: "column", md: "row" },
        width: "auto",
    },

    card: {
        textAlign: "center",
        p: { base: 1, md: 4 },
        borderRadius: "lg",
        shadow: "md",
        _hover: {
        bg: theme.colors.SGA.bg2,
        cursor: "pointer",
        },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        aspectRatio: { base: "auto", md: "1" },
        width: { base: "100%", md: "150px" },
        minW: "150px",
        maxW: "200px",
        
        
    },

    cardTitulo: {
        fontSize: "lg",
        fontWeight: "bold",
        color: theme.colors.SGA.color2,
    },

    cardIcon: {
        boxSize: { base: 0, md: "100px" },
        objectFit: "contain",
        mt: { base: 0, md: 2 },
    },

    logoutContainer: {
        textAlign: "center",
        mt: 8,
    },

    logoutButton: {
        px: 4,
        py: 2,
        borderRadius: "md",
        bg: theme.colors.SGA.bg3,
        color: theme.colors.SGA.color2,
        _hover: {
            bg: theme.colors.SGA.bg2,
        },
        fontWeight: "bold",
    },
});

export default homeStyle;
