const usuariosStyle = (theme) => ({

    container: {
        p: 6,
        bg: theme.colors.SGA.bg1,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pb: "60px",
        justifyContent: "flex-start",
    },

    gridContainer: {
        px: 6,
        bg: theme.colors.SGA.bg1,
        minH: "100vh",
        width: "100%",
        pb: "80px",
        pt: 6,
    },

    grid: {
        columns: { base: 2, md: 3, lg: 5 },
        spacing: 6,
    },

    card: {
        p: 1,
        borderRadius: "md",
        shadow: "md",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        height: { base: "100px", md: "180px" },
        border: "2px solid",
        borderColor: "gray.400",
        _hover: {
            bg: theme.colors.SGA.bg2,
            cursor: "pointer",
            shadow: "lg",
            border: "2px solid",
            borderColor: theme.colors.SGA.bg3,
        },
    },

    cardBody: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        p: 2,
        justifyContent: { base: "center", md: "space-between" },
        alignItems: "center",
    },

    cardTitle: {
        fontSize: { base: "lg", md: "md", lg: "xl" },
        fontWeight: "bold",
        color: theme.colors.SGA.color2,
        textAlign: "center",
        flexBasis: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        whiteSpace: "normal",
        wordBreak: "keep-all",
        overflowWrap: "normal",
    },

    rolText: {
        fontSize: { base: "md", md: "sm" },
        color: theme.colors.SGA.color2,
        textAlign: "center",
        mt: 2,
    },

    fichaContainer: {
        border: "2px solid",
        borderColor: theme.colors.SGA.bg3,
        borderRadius: "md",
        p: 6,
        bg: theme.colors.SGA.bg1,
        maxW: "800px",
        mx: "auto",
        mt: 6,
        shadow: "md",
    },

    fichaText: {
        fontSize: { base: "md", md: "lg" },
        color: theme.colors.SGA.color2,
    },

    fichaTitulo: {
        fontSize: { base: "3xl", md: "2xl" },
        fontWeight: "bold",
        color: theme.colors.SGA.color2,
        textAlign: "center",
        mb: 8,
    },

    fichaRow: {
        display: "flex",
        flexDirection: "column",
        gap: 6,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        maxW: "900px",
    },

    fichaInfo: {
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: { base: "100%", md: "70%" },
    },

    fichaLabel: {
        fontWeight: "bold",
        display: "inline",
    },

    fichaValue: {
        fontWeight: "normal",
        display: "inline",
    },

    linkText: {
        color: theme.colors.SGA.color2,
        fontWeight: "bold",
        textDecoration: "underline",
        cursor: "pointer",
    },

    menuBarGrid: {
        width: "100%",
        display: "grid",
        gridTemplateColumns: {
            base: "auto 1fr",
            md: "auto auto auto auto"
        },
        gap: 4,
        alignItems: "center",
    },

    menuBarItem: {
        width: "100%",
    },

    menuCrear: {
        order: { base: 1, md: 1 },
    },

    menuBuscador: {
        order: { base: 2, md: 2 },
    },


});

export default usuariosStyle;