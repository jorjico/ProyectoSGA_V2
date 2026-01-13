import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    SGA: {
      bg1: "#f7fafc",  //gray.100
      bg2: "#edf2f7",  //gray.200
      bg3: "#cbd5e0",  //gray.400
      color1: "#000000", //black
      color2: "#1a202c", // gray.900
    }
  },

  styles: {
    global: {
      body: {
        bg: "SGA.bg1",
        color: "SGA.color2",
      },
    },
  },

  components: {
    Footer: {
      baseStyle: {
        bg: "gray.400",
        borderTop: "1px solid",
        borderColor: "gray.300",
        py: 4,
        textAlign: "center",
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        zIndex: 10,
        fontWeight: "bold",
      },
    },

    LogoutButton: {
      baseStyle: {
        fontWeight: "bold",
      },
    },

    BotonCargarMas: {
      container: {
        textAlign: "center",
        mt: 6,
      },
      button: {
        bg: "SGA.bg2",
        color: "SGA.color2",
        _hover: {
          bg: "SGA.bg3",
        },
      },
    },

    BotonconIcono: {
      baseStyle: {
        bg: "gray.400",
        color: "black",
        borderRadius: "6px",
        fontWeight: "600",
        border: "1px solid",
        borderColor: "gray.800",
        px: 2,
        py: 2,
        _hover: {
          bg: "gray.600",
          color: "white",
        },
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        whiteSpace: "nowrap",
        width: "auto",
        minW: 0,
        flexShrink: 0,
      },
      parts: {
        icon: {
          width: "20px",
          height: "20px",
          objectFit: "contain",
        },
      },
    },

    MenuBar: {
      baseStyle: {
        bg: "SGA.bg2",
        width: "100%",
        borderBottom: "1px solid",
        borderColor: "SGA.bg3",
        px: 2,
        py: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "left-start",
        gap: 4,
      },
    },

    AutoCompletarInput: {
      parts: ["dropdown", "option"],
      baseStyle: {
        dropdown: {
          position: "absolute",
          top: "100%",
          width: "100%",
          bg: "white",
          borderRadius: "md",
          borderWidth: "1px",
          borderColor: "gray.300",
          boxShadow: "md",
          maxH: "200px",
          overflowY: "auto",
          zIndex: 20,
        },
        option: {
          px: 3,
          py: 2,
          cursor: "pointer",
          _hover: {
            bg: "gray.100",
          },
        },
      },
    },

    EditarDatosForm: {
      baseStyle: {
        maxW: "600px",
        mx: "auto",
        p: 4,
        pb: "120px",
        borderRadius: "md",
        bg: "gray.50",
        boxShadow: "md",
        mt: 4,
      },
      parts: {
        autocompleteWrapper: {
          flexDirection: { base: "column", md: "row" },
          alignItems: { base: "flex-start", md: "center" },
          gap: 2,
        },
        botonCrear: {
          mb: { base: 2, md: 0 },
        },
        modalButton: {
          gap: 4,
        },
      },
    },

    Buscador: {
      baseStyle: {
        container: {
          minW: { base: "100%", md: "200px" }
        },
        leftElement: {
          pointerEvents: "auto",
          h: "full",
          cursor: "pointer",
          img: {
            boxSize: "16px",
            objectFit: "contain",
          }
        },
        input: {
          bg: "white",
          border: "1px solid",
          borderColor: "gray.300",
          borderRadius: "6px",
          _hover: {
            borderColor: "gray.400",
          },
          _focus: {
            borderColor: "gray.400",
            boxShadow: "0 0 0 1px var(--chakra-colors-gray.400)",
          },
        },
      },
    },

  },

});

export default theme;


