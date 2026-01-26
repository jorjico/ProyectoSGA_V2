const { useState } = require("react");

function useAlerta() {
    const [alerta, setAlerta] = useState ({
        isOpen: false,
        titulo: "",
        mensaje: "",
        onConfirm: null,
        confirmText: "Entendido",
    });

    const showAlerta = ({ titulo = "Ups...", mensaje, onConfirm }) => {
        setAlerta({
            isOpen: true,
            titulo,
            mensaje,
            onConfirm,
        });
    }

    const closeAlerta = () => {
        setAlerta((prev) => ({
            ...prev,
            isOpen: false,
        }));
    }

    return { alerta, showAlerta, closeAlerta };
}

export default useAlerta;