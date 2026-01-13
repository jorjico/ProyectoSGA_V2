const comprasStyle = (theme) => ({
    gridContainer: {
        px: { base: 3, md: 6 },
        bg: theme.colors.SGA.bg1,
        minH: "100vh",
        width: "100%",
        pb: "80px",
        pt: 6,
        overflowX: "hidden",
    },

    filtroSelect: {
        width: { base: "100%", md: "180px" },
        bg: theme.colors.SGA.bg1,
        color: theme.colors.SGA.color2,
        borderColor: theme.colors.SGA.bg3,
        border: "1px solid",
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


    tableContainer: {
        width: "100%",
        overflowX: "auto",
    },

    table: {
        width: "100%",
        tableLayout: "fixed",
        fontSize: "clamp(10px, 1vw, 18px)",
        "& th, & td": {
            fontSize: "clamp(10px, 1vw, 18px)",
            minWidth: 0,
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflow: "visible",
            padding: "8px",
        },
    },

    
    tableRow: {
        cursor: "pointer",
        _hover: {
            bg: theme.colors.SGA.bg3,
        },
    },

    menuBarContainer: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 4,
        alignItems: "center",
    },

    menuBarGrupoIzquierda: {
        display: "flex",
        alignItems: "center",
        gap: { base: 1, md: 2 },
        order: { base: 1, md: 1 },
        flexWrap: "wrap",
    },

    menuBarGrupoDerecha: {
        display: "flex",
        alignItems: "center",
        gap: { base: 1, md: 2 },
        order: { base: 2, md: 2 },
        flexWrap: "wrap",
        width: { base: "100%", md: "auto" },
        justifyContent: { base: "flex-start", md: "flex-end" },
    },

    totalContainer: {
        mt: 4,
        p: 4,
        borderRadius: "md",
        bg: "gray.100",
        textAlign: "right",
        boxShadow: "sm",
    },
    
    totalText: {
        fontWeight: "bold",
        fontSize: "lg",
        mb: 1,
    },

    pedidoContainer1: {
        px: { base: 3, md: 6 },
        bg: theme.colors.SGA.bg1,
        width: "100%",
        pt: 6,
        overflowX: "hidden",
    },

    pedidoContainer2: {
        px: { base: 3, md: 6 },
        bg: theme.colors.SGA.bg1,
        width: "100%",
        pb: "80px",
        pt: 6,
        overflowX: "hidden",
    },

    linkText: {
        color: theme.colors.SGA.color2,
        fontWeight: "bold",
        textDecoration: "underline",
        cursor: "pointer",
    },

    deleteButton: {
        p: 1,
        minW: "auto",
        h: "auto",
        bg: "transparent",
        _hover: {
            bg: theme.colors.SGA.bg2,
        },
    },

    deleteIcon: {
        boxSize: "16px",
        cursor: "pointer",
    },

    lineaInput: {
        maxW: "100px",
    },

    lineaSelect: {
        minW: "200px",
    },

    totalesContainer: {
        mt: 4,
        p: 4,
        textAlign: "right",
        fontWeight: "bold",
        bg: theme.colors.SGA.bg2,
        borderRadius: "md",
    },

    totalesText: {
        fontSize: "lg",
    },

    botonCrearPedido: {
        display: "flex",
        alignItems: "center",
        gap: 2,
        bg: theme.colors.SGA.bg2,
        color: theme.colors.SGA.color2,
        border: "1px solid",
        borderColor: theme.colors.SGA.bg3,
        borderRadius: "md",
        px: 4,
        py: 2,
        fontWeight: "bold",
        _hover: {
            bg: theme.colors.SGA.bg3,
        },
    },

    botonCrearPedidoIcono: {
        boxSize: "18px",
    },

    pedidoLineaContainer: {
        width: "100%",
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        alignItems: "center",
    },

    crearAlbaranButton: {
        colorScheme: "blue",
        my: 2,
    },

    crearAlbaranModalContent: {
        maxW: "xl",
        w: "100%",
    },

    crearAlbaranFormulario: {
        display: "flex",
        flexDirection: "column",
        gap: 3,
    },

    crearAlbaranLinea: {
        display: "flex",
        justifyContent: "space-between",
        w: "100%",
        alignItems: "center",
        gap: 2,
    },

    crearAlbaranInputCantidad: {
        w: "100px",
    },

    columnaAlbaranes: {
        display: "block",
        fontSize: "clamp(10px, 1vw, 18px)",
        color: theme.colors.SGA.color2,
        fontWeight: "bold",
        textDecoration: "underline",
        cursor: "pointer",
        whiteSpace: 'pre-line',
        lineHeight: "1.5",
    },        

});

export default comprasStyle;