import useDataPaginacion from "./useDataPaginacion";

const useProductos = (limite = 24,  filtros = {}) => {
    const { items, setItems, loading, hayMas, cargarMas } = useDataPaginacion (
        "/api/productos",
        limite,
        filtros
    );

    return {
        productos: items,
        setProductos: setItems,
        loading,
        hayMas,
        cargarMasProductos: cargarMas,
    };
};

export default useProductos;
