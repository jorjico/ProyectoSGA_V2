import useDataPaginacion from "./useDataPaginacion";

const useProyectos = (limite = 24, filtros = {}) => {
    const { items, setItems, loading, hayMas, cargarMas } = useDataPaginacion(
        "/api/proyectos",
        limite,
        filtros
    );

    return {
        proyectos: items,
        setProyectos: setItems,
        loading,
        hayMas,
        cargarMasProyectos: cargarMas
    };
};

export default useProyectos;