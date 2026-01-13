const NavbarStyle = {
    container: {
        bg: "gray.400",
        color: "black",
        px: 4,
        py: 2,
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

    },

    izquierda: {
        flex: "0 0 auto",
        display: "flex",
        alignItems: "center",
    },

    centro: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        gap: 6,
    },

    derecha: {
        flex: "0 0 auto",
        display: "flex",
        alignItems: "center",
    },

    logo: {
        height: "50px",
        width: "auto",
    },

    desktopMenu: {
        display: { base: "none", md: "flex" },
        alignItems: "center",
        justifyContent: "space-between",
        h: 16,
        w: "100%",
    },

    MenuButton: {
        _hover: {
            border: "1px solid black",
            borderRadius: "6px",
            bg: "gray.300",
        },
        px: 2,
        py: 2,
        fontWeight: "bold",
    },  
    
    logoutButton: {
        _hover: {
            bg: "red.500",
            color: "white",
        },
        fontWeight: "bold",

    },    
    
    mobileMenu: {
        display: { base: "flex", md: "none" },
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        h: 16,
        w: "100%",
    },

    mobileContenedorMenuDesplegable: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
    },
    
    mobileMenuDesplegable: {
        position: "absolute",
        top: "100%",
        left: 0,
        w: "160px",
        bg: "gray.400",
        py: 2,
        px: 4,
        display: "flex",
        flexDirection: "column",        
        gap: 2,
        zIndex: 10,
        borderRadius: "6px",
    }, 

    mobileMenuItem: {
        py: 2,
        px: 2,
        borderRadius: "6px",
        _hover: {
            bg: "gray.300",
        },
        display: "flex", 
        justifyContent: "space-between",
        cursor: "pointer",
        fontSize: "lg",
    },

    mobileLogout: {
        py: 2,
        px: 2,
        borderRadius: "6px",
        _hover: {
            bg: "red.500",
            color: "white",
        },

        mt: 2,
    },

};

export default NavbarStyle;
