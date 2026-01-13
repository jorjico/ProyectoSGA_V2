import useDataPaginacion from "./useDataPaginacion";

const useUsuarios = (limite = 24, filtros = {}) => {
    const { items, setItems, loading, hayMas, cargarMas } = useDataPaginacion(
        "/api/usuarios",
        limite,
        filtros
    );

    return {
        usuarios: items,
        setUsuarios: setItems,
        loading,
        hayMas,
        cargarMasUsuarios: cargarMas,
    };
};

export default useUsuarios;