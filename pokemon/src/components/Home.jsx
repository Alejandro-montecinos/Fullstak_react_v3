import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function Sidebar({ user, onLogout }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <button
        onClick={() => setAbierto(!abierto)}
        style={{
          position: 'fixed',
          top: 20,
          left: 20,
          zIndex: 2500,
          backgroundColor: '#646372ff',
          border: 'none',
          padding: '10px',
          borderRadius: '5px',
          cursor: user ? 'pointer' : 'default',
          fontSize: '24px',
          transition: 'transform 0.3s ease',
          transform: abierto ? 'rotate(90deg)' : 'rotate(0deg)',
          color: 'white',
          filter: user ? 'none' : 'blur(4px)',
          pointerEvents: user ? 'auto' : 'none',
          userSelect: user ? 'auto' : 'none',
        }}
        aria-label="Abrir menú"
        disabled={!user}
      >
        &#9776;
      </button>

      <div
        style={{
          position: 'fixed',
          top: 0,
          left: abierto ? 0 : '-260px',
          height: '100%',
          width: '260px',
          backgroundColor: '#646372ff',
          boxShadow: '2px 0 5px rgba(0,0,0,0.3)',
          transition: 'left 0.3s ease-in-out',
          padding: '20px',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: 'white',
        }}
      >
        {/* SVG reemplazado por div simple */}
        <div style={{ 
          width: 80, 
          height: 80, 
          background: 'radial-gradient(circle at 50% 30%, white 20%, transparent 50%)', 
          borderRadius: '50%', 
          marginBottom: 15,
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            bottom: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 40,
            height: 20,
            background: 'white',
            borderRadius: '10px'
          }} />
        </div>
        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '20px' }}>
          Hola, {user ? (user.nombreCompleto || user.email) : 'Invitado'}
        </div>
        <button
          className="btn btn-danger w-100"
          onClick={() => {
            onLogout();
            setAbierto(false);
          }}
          disabled={!user}
        >
          Cerrar sesión
        </button>
      </div>
    </>
  );
}

const BlurOverlay = () => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      pointerEvents: 'auto',
    }}
  >
    <h2 className="text-dark mb-3">Debes iniciar sesión para iniciar la aventura</h2>
    <div>
      <a href="/login" className="btn btn-primary me-2">
        Iniciar Sesión
      </a>
      <a href="/register" className="btn btn-outline-primary">
        Registrarse
      </a>
    </div>
  </div>
);
function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Estado para carrito (mismo que antes)
  const [carrito, setCarrito] = useState(() => {
    const saved = localStorage.getItem('carritoReact');
    return saved ? JSON.parse(saved) : [];
  });

  // Estado para productos desde la API
  const [productos, setProductos] = useState([]);
  const [cargandoProd, setCargandoProd] = useState(false);
  const [errorProd, setErrorProd] = useState('');

  // Persistencia del carrito
  useEffect(() => {
    localStorage.setItem('carritoReact', JSON.stringify(carrito));
  }, [carrito]);

  // Cargar productos desde Spring Boot
  useEffect(() => {
    const cargarProductos = async () => {
      setCargandoProd(true);
      try {
        const data = await api.obtenerProductos();
        setProductos(data);
      } catch (e) {
        setErrorProd(e.message);
      } finally {
        setCargandoProd(false);
      }
    };
    cargarProductos();
  }, []);

  // agregarAlCarrito adaptado para objetos producto completos
  const agregarAlCarrito = (productoObj, cantidad) => {
  if (!user) {
    alert('Debes iniciar sesión para agregar al carrito.');
    return;
  }

  const stock = Number(productoObj.cantidad || 0);
  cantidad = Number(cantidad);

  if (cantidad < 1 || cantidad > 30) {
    alert('La cantidad debe estar entre 1 y 30.');
    return;
  }

  const nombre = productoObj.nombre;
  const precio = productoObj.precio;

  // Buscar si ya existe en el carrito
  const existingIndex = carrito.findIndex((item) => item.producto === nombre);
  const nuevoCarrito = [...carrito];

  const cantidadActualEnCarrito =
    existingIndex >= 0 ? nuevoCarrito[existingIndex].cantidad : 0;

  const totalDeseado = cantidadActualEnCarrito + cantidad;

  // Validar contra stock
  if (totalDeseado > stock) {
    alert(`No puedes agregar más de ${stock} cartas de ${nombre}.`);
    return;
  }

  if (existingIndex >= 0) {
    nuevoCarrito[existingIndex].cantidad = totalDeseado;
  } else {
    nuevoCarrito.push({
      producto: nombre,
      precio,
      cantidad,
      rutaImagen: productoObj.rutaImagen,
      stock, // stock del producto
    });
  }

  setCarrito(nuevoCarrito);
  alert(`${cantidad} carta(s) de ${nombre} añadida(s) al carrito.`);
};


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      className="container-fluid"
      style={{
        backgroundImage: 'url("/img/fondo.jpg")',
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
        backgroundPosition: 'center',
        width: '100%',
        minHeight: '100vh',
        paddingTop: '60px',
        position: 'relative',
      }}
    >
      <Sidebar user={user} onLogout={handleLogout} />
      
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 2,
          filter: user ? 'none' : 'blur(4px)',
          pointerEvents: user ? 'auto' : 'none',
          userSelect: user ? 'auto' : 'none',
        }}
      >
        <img
          src="/img/icono.png"
          alt="Pokémon Icono"
          style={{ height: 60 }}
        />
      </div>

      {!user && (
        <div
          className="alert alert-warning text-center mb-3"
          role="alert"
          style={{ marginTop: 80 }}
        >
          Debes <a href="/login" className="alert-link">iniciar sesión</a> o{' '}
          <a href="/register" className="alert-link">registrarte</a> para interactuar con el catálogo y el carrito.
        </div>
      )}

      {/* Estados de carga/error */}
      {cargandoProd && (
        <div className="text-center mt-5 text-light">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando cartas Pokémon...</p>
        </div>
      )}
      
      {errorProd && (
        <div className="alert alert-danger text-center mt-5">
          Error al cargar productos: {errorProd}
        </div>
      )}

      {/* Render de productos desde API */}
      <section
        className="d-flex flex-wrap justify-content-center align-items-start"
        style={{ gap: '16px', marginTop: '40px', position: 'relative', zIndex: 1 }}
      >
        {productos.map((p) => (
          <ProductCard
            key={p.id}
            producto={p}
            agregarAlCarrito={agregarAlCarrito}
          />
        ))}
      </section>

      {!user && <BlurOverlay />}

      <button
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          backgroundColor: '#646372ff',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          border: 'none',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          cursor: user ? 'pointer' : 'default',
          zIndex: 3000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'black',
          filter: user ? 'none' : 'blur(4px)',
          pointerEvents: user ? 'auto' : 'none',
          userSelect: user ? 'auto' : 'none',
        }}
        onClick={() => navigate('/cart')}
        aria-label="Carrito de compras"
        disabled={!user}
      >
        {/* SVG reemplazado por emoji */}
        <span style={{ fontSize: '24px' }}>🛒</span>
      </button>
      
      <div style={{ maxWidth: 640, margin: '40px auto', textAlign: 'center' }}>
        <h2>¡Atrápalos ya!</h2>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/Q6OSaAQE2es?si=TqGwOLudPWbMuNWK"
          title="Pokémon Opening"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
        <p style={{ fontSize: 12, marginTop: 20, color: '#555' }}>
          © 2025 Pokémon Cards Store | Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}

export default Home;
