import useDataPaginacion from "./useDataPaginacion";

const useClientes = (limite = 20, filtros = {}) => {
    const { items, setItems, loading, hayMas, cargarMas } = useDataPaginacion(
        "/api/clientes",
        limite,
        filtros
    );

    return {
        clientes: items,
        setClientes: setItems,
        loading,
        hayMas,
        cargarMasClientes: cargarMas
    };
};

export default useClientes;