const productosStyle = (theme) => ({

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
        columns: { base: 2, md: 5, lg: 8 },
        spacing: 6,
    },

    gridFamilias: {
        columns: { base: 1, md: 3, lg: 4 },
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
        height: { base: "100px", md: "250px" },
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
        fontSize: { base: "xl", md: "lg" },
        fontWeight: "bold",
        color: theme.colors.SGA.color2,
        textAlign: "center",
        flexBasis: "35%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    cardImage: {
        width: "100%",
        height: "auto",
        maxHeight: "55%",
        objectFit: "contain",
        borderRadius: "md",
        mt: 2,
    },

    cardInfo: {
        fontSize: { base: "md", md: "lg" },
        color: theme.colors.SGA.color2,
        textAlign: "center",
        mt: 1,
    },

    cardFamilia: {
        p: 1,
        borderRadius: "md",
        shadow: "md",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: { base: "80px", md: "120px" },
        border: "2px solid",
        borderColor: "gray.400",
        padding: 2,
        _hover: {
            bg: theme.colors.SGA.bg2,
            cursor: "pointer",
            shadow: "lg",
            border: "2px solid",
            borderColor: theme.colors.SGA.bg3,
        },    
    },

    sku: {
        fontSize: { base: "md", md: "sm" },
        color: theme.colors.SGA.color2,
        textAlign: "center",
        mt: 2,
        mb: 1,
        maxHeight: "10%",
        maxWidth: "100%",
        overflowWrap: "anywhere",
        wordBreak: "break-word",
    },

    mostrarImagen: {
        base: false,
        md: true,
        lg: true,
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
        width: "100%",
        maxW: "900px",
        gap: 6,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
    },

    fichaInfo: {
        width: { base: "100%", md: "70%" },
        display: "flex",
        flexDirection: "column",
        gap: 3,
        order: { base: 2, md: 1 },
    },

    fichaProductosBox: {
        width: "100%",
        mt: 6,
    },

    
    fichaImageBox: {
        width: { base: "100%", md: "30%" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        order: { base: 1, md: 2 }
    },

    fichaImage: {
        width: "100%",
        maxH: "250px",
        objectFit: "contain",
    },

    proveedoresBox: {
        mt: 10,
        width: "100%",
        p: 4,
        borderRadius: "md",
        border: "1px solid",
        borderColor: "gray.300",
        bg: theme.colors.SGA.bg2,
    },

    proveedorItem: {
        p: 3,
        borderBottom: "1px solid",
        borderColor: "gray.300",
        _last: { borderBottom: "none" },

    },

    proveedoresHeading: {
        fontSize: "xl",
        mb: 2,
        textAlign: "center",
    },

    linkText: {
        color: theme.colors.SGA.color2,
        fontWeight: "bold",
        textDecoration: "underline",
        cursor: "pointer",
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

    tipoEntrada: {
        color: theme.colors.green[500],
    },
    
    tipoSalida: {
        color: theme.colors.red[500],
    },

    proyectoBuscadorBox: {
    position: "relative",
    width: "100%",
},

    proyectoOpcionesBox: {
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        mt: 1,
        bg: theme.colors.SGA.bg1,
        border: "1px solid",
        borderColor: "gray.300",
        borderRadius: "md",
        maxH: "220px",
        overflowY: "auto",
        zIndex: 10,
    },

    proyectoOpcionItem: {
        px: 3,
        py: 2,
        cursor: "pointer",
        color: theme.colors.SGA.color2,
        _hover: {
            bg: theme.colors.SGA.bg2,
        },
    },

    SalidaBox: {
        width: "100%",
        p: 4,
        borderRadius: "md",
        border: "1px solid",
        borderColor: "gray.300",
        bg: theme.colors.SGA.bg2,
        display: "flex",
        flexDirection: "column",
        gap: 3,
    },

    fechaInput: {
        bg: theme.colors.SGA.bg2,
        borderRadius: "md",
        p: 2,
        width: "100%",
    },

    fechaLabel: {
        fontSize: { base: "md", md: "lg" },
        color: theme.colors.SGA.color2,
        textAlign: "center",
        fontWeight: "bold",
        mb: 2,
    },

    productoFila: {
        display: "flex",
        width: "100%",
        gap: 4,
        alignItems: "flex-start",
    },

    productoCol: {
        flex: 1,
        width: "700px",
    },

    cantidadCol: {
        width: "120px",
    },

    buttonAñadirProducto: {
        bg: theme.colors.SGA.bg2,
        color: theme.colors.SGA.color2,
        borderRadius: "md",
        border: "2px solid",
        borderColor: "gray.400",
        width: "200px",
        minWidth: "fit-content",
        justifyContent: "center",
        _hover: {
            bg: theme.colors.SGA.bg3,
            borderColor: theme.colors.SGA.color2,
        },
    }, 
    
    buttonContainer: {
        display: "flex",
        justifyContent: "center",
        width: "100%",
        mt: 3,
    },

});

export default productosStyle;