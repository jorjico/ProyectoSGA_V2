import { useState } from "react";

function useAlert() {
    const [alerta, setAlerta] = useState ({
        isOpen: false,
        titulo: "",
        mensaje: "",
        onConfirm: null,
        confirmText: "Entendido",
    });

    const showAlert = ({ titulo = "Ups...", mensaje, onConfirm }) => {
        setAlerta({
            isOpen: true,
            titulo,
            mensaje,
            onConfirm,
        });
    }

    const closeAlert = () => {
        setAlerta((prev) => ({
            ...prev,
            isOpen: false,
        }));
    }

    return { alerta, showAlert, closeAlert };
}

export default useAlert;