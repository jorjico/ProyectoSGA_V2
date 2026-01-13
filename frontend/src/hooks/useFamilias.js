import useDataPaginacion from "./useDataPaginacion";

const useFamilias = (limite = 24, filtros = {}) => {
    const { items, setItems, loading, hayMas, cargarMas } = useDataPaginacion(
        "/api/familias",
        limite,
        filtros
    );

    return {
        familias: items,
        setFamilias: setItems,
        loading,
        hayMas,
        cargarMasFamilias: cargarMas
    };
};

export default useFamilias;