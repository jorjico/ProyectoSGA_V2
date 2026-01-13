const proyectosStyle = (theme) => ({

    gridContainer: {
        px: 6,
        bg: theme.colors.SGA.bg1,
        minH: "100vh",
        width: "100%",
        pb: "80px",
        pt: 6,
    },

    grid: {
        columns: { base: 2, md: 5, lg: 8 },
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
        height: { base: "100px", md: "130px" },
        border: "2px solid",
        borderColor: "gray.400",
        _hover: {
            bg: theme.colors.SGA.bg2,
            cursor: "pointer",
            shadow: "lg",
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
        pt: 5,
        pb: 5,
    },

    cardTitle: {
        fontSize: { base: "xl", md: "lg" },
        fontWeight: "bold",
        color: theme.colors.SGA.color2,
        textAlign: "center",
    },

    cardInfo: {
        fontSize: { base: "md", md: "lg" },
        color: theme.colors.SGA.color2,
        textAlign: "center",
        mt: 1,
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

    fichaTitulo: {
        fontSize: { base: "2xl", md: "3xl" },
        fontWeight: "bold",
        mb: 4,
        color: theme.colors.SGA.color2,
        textAlign: "center",
    },

    fichaRow: {
        display: "flex",
        flexDirection: "column",
        gap: 3,
    },

    fichaInfo: {
        display: "flex",
        flexDirection: "column",
        gap: 2,
    },

    fichaText: {
        fontSize: { base: "md", md: "lg" },
        color: theme.colors.SGA.color2,
        
    },

    clientesContainer: {
        p: 4,
        width: "100%",
    },

    clientesTableContainer: {
        borderRadius: "md",
        overflow: "hidden",
        boxShadow: "md",
    },

    clientesRow: {
        _hover: {
            bg: theme.colors.SGA.bg2,
            cursor: "pointer",
        },
    },

    clientesHeader: {
        bg: theme.colors.SGA.bg3,
        color: theme.colors.SGA.color1,
        fontWeight: "bold",
    },

    filtroSelect: {
        width: "180px",
        bg: theme.colors.SGA.bg1,
        color: theme.colors.SGA.color2,
        borderColor: theme.colors.SGA.bg3,
        borderRadius: "md",
        _hoverBg: theme.colors.SGA.bg2,
        _focus: {
            borderColor: theme.colors.SGA.color2,
            boxShadow: `0 0 0 1px ${theme.colors.SGA.color2}`,
        },
        icon: {
            boxSize: "16px",
        },
    },

    table: {
        fontSize: "18px",
        "& th, & td": {
            fontSize: "18px",
        },
    },

    tableRow: {
        cursor: "pointer",
        _hover: {
            bg: theme.colors.SGA.bg3,
        },
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

    fichaProyectosBox: {
        width: "100%",
        mt: 6,
        pb: "80px",
    },

    proyectoCard: {
        p: 3,
        borderRadius: "md",
        shadow: "md",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: { base: "100px", md: "150px" },


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

    proyectoCardTitle: {
        fontSize: { base: "lg", md: "xl" },
        fontWeight: "bold",
        color: theme.colors.SGA.color2,
        textAlign: "center",
    },
    proyectoCardInfo: {
        fontSize: { base: "md", md: "lg" },
        color: theme.colors.SGA.color2,
        mt: 1,
        textAlign: "center",
    },

    proyectoGrid: {
        columns: { base: 2, md: 4, lg: 6 },
        spacing: 6,
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
        order: { base: 2, md: 4 },
    },

    menuFiltroAnio: {
        order: { base: 3, md: 2 },
    },

    menuFiltroEstado: {
        order: { base: 4, md: 3 },
    },
});

export default proyectosStyle;