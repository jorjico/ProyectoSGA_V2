const menuOpciones = [
    {
        label: "Productos", 
        items: [
            { label: "Ver Productos", path: "/productos/ver" },
            { label: "Movimientos", path: "/productos/movimientos" }, 
            { label: "Familias", path: "/productos/familias" }, 
            { label: "Registrar Salida", path: "/productos/salida" },
        ]
    }, 
    {
        label: "Proyectos", 
        items: [
            { label: "Ver Proyectos", path: "/proyectos" },
            { label: "Clientes", path: "/clientes" },
        ]
    }, 
    {
        label: "Compras", 
        items: [
            { label: "Pedidos", path: "/pedidos" },
            { label: "Proveedores", path: "/proveedores/ver" },
            { label: "Albaranes", path: "/albaranes" },
        ]
    }, 
    {
        label: "Usuarios", 
        items: [
            { label: "Usuarios", path: "/usuarios/ver" },
        ]
    }, 
]

export default menuOpciones;