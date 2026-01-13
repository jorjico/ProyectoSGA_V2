import './App.css'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx'
import { useContext } from 'react';
import { UsuarioContext } from './context/UsuarioContext.jsx';
import Home from './paginas/Home.jsx';
import Login from './paginas/Login.jsx';
import VerProductos from './paginas/VerProductos.jsx';
import FichaProducto from './paginas/FichaProducto.jsx';
import EditarProductoWrapper from './components/EditarProductoWrapper.jsx';
import Familias from './paginas/VerFamilias.jsx';
import EditarFamiliaWrapper from './components/EditarFamiliaWrapper.jsx';
import FichaProveedor from './paginas/FichaProveedor.jsx';
import Footer from './components/Footer.jsx';
import FichaFamilia from './paginas/FichaFamilia.jsx';
import VerProyectos from './paginas/VerProyecto.jsx';
import FichaProyecto from './paginas/FichaProyecto.jsx';
import EditarProyectoWrapper from './components/EditarProyectoWrapper.jsx';
import VerClientes from './paginas/verCliente.jsx';
import EditarClienteWrapper from './components/EditarClienteWrapper.jsx';
import FichaCliente from './paginas/FichaCliente.jsx';
import VerPedidos from './paginas/VerPedidos.jsx';
import FichaPedido from './paginas/FichaPedido.jsx';
import CrearPedido from './paginas/CrearPedido.jsx';
import EditarPedidoWrapper from './components/EditarPedidoWrapper.jsx';
import VerUsuarios from './paginas/VerUsuarios.jsx';
import FichaUsuario from './paginas/FichaUsuario.jsx';
import EditarUsuarioWrapper from './components/EditarUsuarioWrapper.jsx';
import VerProveedores from './paginas/VerProveedor.jsx';
import FichaContactoProveedor from './paginas/FichaContactoProveedor.jsx';
import EditarContactoProveedorWrapper from './components/EditarContactoProveedorWrapper.jsx';
import EditarProveedorWrapper from './components/EditarProveedorWrapper.jsx';
import VerAlbaranes from './paginas/VerAlbaran.jsx';
import FichaAlbaran from './paginas/FichaAlbaran.jsx';
import VerMovimientos from './paginas/VerMovimientos.jsx';
import RegistrarSalida from './paginas/RegistrarSalida.jsx';

function App() {
  const { usuario } = useContext(UsuarioContext);
  const location = useLocation();

  const mostrarNavbar = usuario && location.pathname !== '/login' && location.pathname !== '/home';
  const mostrarFooter = usuario && location.pathname !== '/login';

  return (
    <div className='App'>
      {mostrarNavbar && <Navbar />}

      <main className = "Main">

        <Routes>
          <Route 
            path="/login"
            element={usuario ? <Navigate to="/home" replace /> : <Login />}
          />

          <Route
            path="/"
            element={usuario ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/home"
            element={usuario ? <Home /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/productos/ver"
            element={usuario ? <VerProductos /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/producto/:sku"
            element={usuario ? <FichaProducto /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/editar-producto/:sku"
            element={usuario ? <EditarProductoWrapper /> : <Navigate to="/login" replace />}
          />

           <Route
            path="/productos/familias"
            element={usuario ? <Familias /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/familia/:id"
            element={usuario ? <FichaFamilia /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/editar-familia/:id"
            element={usuario ? <EditarFamiliaWrapper /> : <Navigate to="/login" replace />} 
          />

          <Route
            path="/proyectos"
            element={usuario ? <VerProyectos /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/proyecto/:id"
            element={usuario ? <FichaProyecto /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/editar-proyecto/:id"
            element={usuario ? <EditarProyectoWrapper/> : <Navigate to="/login" replace />}
          />

          <Route
            path="/clientes"
            element={usuario ? <VerClientes /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/cliente/:id"
            element={usuario ? <FichaCliente /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/editar-cliente/:id"
            element={usuario ? <EditarClienteWrapper /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/pedidos"
            element={usuario ? <VerPedidos /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/pedido/:id" 
            element={usuario ?<FichaPedido /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/crear-pedido"
            element={usuario ?<CrearPedido /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/editar-pedido/:id"
            element={usuario ?<EditarPedidoWrapper /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/usuarios/ver"
            element={usuario ? <VerUsuarios /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/usuarios/:id"
            element={usuario ? <FichaUsuario /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/editar-usuario/:id"
            element={usuario ? <EditarUsuarioWrapper /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/proveedores/ver"
            element={usuario ? <VerProveedores /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/proveedores/:id"
            element={usuario ? <FichaProveedor /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/editar-proveedor/:id"
            element={usuario ? <EditarProveedorWrapper /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/contactos-proveedores/:id"
            element={usuario ? <FichaContactoProveedor /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/editar-contacto-proveedor/:id"
            element={usuario ? <EditarContactoProveedorWrapper /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/editar-contacto-proveedor/:id"
            element={usuario ? <EditarContactoProveedorWrapper /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/albaranes"
            element={usuario ? <VerAlbaranes /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/albaran/:id"
            element={usuario ? <FichaAlbaran /> : <Navigate to="/login" replace /> }
          />

          <Route
            path="/productos/movimientos"
            element={usuario ? <VerMovimientos /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/proveedores/:id"
            element={usuario ? <FichaProveedor /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/productos/salida"
            element={usuario ? <RegistrarSalida /> : <Navigate to="/login" replace />}
          />

          <Route 
            path="*"
            element={
              <Navigate to={usuario ? "/home" : "/login"} replace />
            }
          />
          
        </Routes>
      </main>
      
      {mostrarFooter && <Footer />}

    </div>
  )
}

export default App
