import useDataPaginacion from "./useDataPaginacion";

const usePedidos = (limite = 20, filtros = {}) => {
    const { items, setItems, loading, hayMas, cargarMas } = useDataPaginacion(
        "/api/pedidos",
        limite,
        filtros
    );

    return {
        pedidos: items,
        setPedidos: setItems,
        loading,
        hayMas,
        cargarMasPedidos: cargarMas
    };
};

export default usePedidos;