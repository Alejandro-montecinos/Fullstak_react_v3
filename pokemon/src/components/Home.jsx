import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          viewBox="0 0 24 24"
          width="80"
          height="80"
          style={{ marginBottom: 15 }}
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 8-4 8-4s8 0 8 4v2H4v-2z" />
        </svg>
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

const cartas = [
  { producto: 'Bulbasaur', imagen: '/img/Bulbasaur.jpg', precio: 4000 },
  { producto: 'Charizard', imagen: '/img/Charizard.png', precio: 25000 },
  { producto: 'Dragonite', imagen: '/img/Dragonite.jpg', precio: 20000 },
  { producto: 'Gengar', imagen: '/img/Gengar.png', precio: 12000 },
  { producto: 'Jigglypuff', imagen: '/img/Jigglypuff.png', precio: 3500 },
  { producto: 'Mewtwo', imagen: '/img/Mewtwo.jpg', precio: 15000 },
  { producto: 'Pikachu', imagen: '/img/Pikachu.jpg', precio: 5000 },
  { producto: 'Snorlax', imagen: '/img/Snorlax.png', precio: 10000 },
  { producto: 'Squirtle', imagen: '/img/Squirtle.jpg', precio: 4500 },
  { producto: 'Eevee', imagen: '/img/Eevee.png', precio: 6000 },
];

function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [carrito, setCarrito] = useState(() => {
    const saved = localStorage.getItem('carritoReact');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('carritoReact', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto, precio, cantidad) => {
    if (!user) {
      alert('Debes iniciar sesión para agregar al carrito.');
      return;
    }
    cantidad = Number(cantidad);
    if (cantidad < 1 || cantidad > 30) {
      alert('La cantidad debe estar entre 1 y 30.');
      return;
    }
    const existingIndex = carrito.findIndex((item) => item.producto === producto);
    let nuevoCarrito = [...carrito];
    if (existingIndex >= 0) {
      nuevoCarrito[existingIndex].cantidad += cantidad;
    } else {
      nuevoCarrito.push({ producto, precio, cantidad });
    }
    setCarrito(nuevoCarrito);
    alert(`${cantidad} carta(s) de ${producto} añadida(s) al carrito.`);
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

      <section
        className="d-flex flex-wrap justify-content-center align-items-start"
        style={{ gap: '16px', marginTop: '40px', position: 'relative', zIndex: 1 }}
      >
        {cartas.map(({ producto, imagen, precio }) => (
          <ProductCard
            key={producto}
            producto={producto}
            imagen={imagen}
            precio={precio}
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
        onClick={() => alert('Funcionalidad de carrito no implementada aún')}
        aria-label="Carrito de compras"
        disabled={!user}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="black"
        >
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm0 2zM1 2h2l3.6 7.59-1.35 2.44c-.16.28-.25.61-.25.97 0 1.11.89 2 2 2h12v-2H7.42a.25.25 0 01-.24-.17L7 11h11c.83 0 1.54-.5 1.84-1.22L21.72 6c.08-.2.09-.42.07-.64-.04-.39-.39-.68-.78-.68H5.21l-.94-2H1v2z" />
        </svg>
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
