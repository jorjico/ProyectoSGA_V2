import useDataPaginacion from "./useDataPaginacion";

const useAlbaranes = (limite = 20, filtros = {}) => {
    const { items, setItems, loading, hayMas, cargarMas } = useDataPaginacion(
        "/api/albaranes",
        limite,
        filtros
    );

    return {
        albaranes: items,
        setAlbaranes: setItems,
        loading,
        hayMas,
        cargarMasAlbaranes: cargarMas
    };
};

export default useAlbaranes;