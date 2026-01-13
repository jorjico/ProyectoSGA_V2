import useDataPaginacion from "./useDataPaginacion";

const useProveedores = (limite = 20, filtros = {}) => {
    const { items, setItems, loading, hayMas, cargarMas } = useDataPaginacion(
        "/api/proveedores",
        limite,
        filtros
    );

    return {
        proveedores: items,
        setProveedores: setItems,
        loading,
        hayMas,
        cargarMasProveedores: cargarMas
    };
};

export default useProveedores;