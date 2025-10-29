// src/pages/CartPage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const CLAVE_CARRITO = "carritoReact";

const formatearPrecio = (valor) =>
  Number(valor).toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });

export default function CartPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Estado del carrito (mismo shape que usas en Home: { producto, precio, cantidad })
  const [listaCarrito, setListaCarrito] = useState(() => {
    const guardado = localStorage.getItem(CLAVE_CARRITO);
    return guardado ? JSON.parse(guardado) : [];
  });

  // Persistencia
  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(listaCarrito));
  }, [listaCarrito]);

  // Derivados
  const totalProductos = listaCarrito.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPagar = listaCarrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  // Acciones
  const actualizarCantidad = (nombreProducto, nuevaCantidad) => {
    if (!user) return;
    const cantidadNormalizada = Math.min(30, Math.max(1, Number(nuevaCantidad) || 1));
    setListaCarrito((prev) =>
      prev.map((x) =>
        x.producto === nombreProducto ? { ...x, cantidad: cantidadNormalizada } : x
      )
    );
  };

  const incrementar = (nombreProducto) => {
    if (!user) return;
    setListaCarrito((prev) =>
      prev.map((x) =>
        x.producto === nombreProducto
          ? { ...x, cantidad: Math.min(30, x.cantidad + 1) }
          : x
      )
    );
  };

  const decrementar = (nombreProducto) => {
    if (!user) return;
    setListaCarrito((prev) =>
      prev.map((x) =>
        x.producto === nombreProducto
          ? { ...x, cantidad: Math.max(1, x.cantidad - 1) }
          : x
      )
    );
  };

  const quitarDelCarrito = (nombreProducto) => {
    if (!user) return;
    setListaCarrito((prev) => prev.filter((x) => x.producto !== nombreProducto));
  };

  const vaciarCarrito = () => {
    if (!user) return;
    if (window.confirm("¿Vaciar todo el carrito?")) {
      setListaCarrito([]);
    }
  };

  const irAlCheckout = () => {
    if (!user) {
      alert("Debes iniciar sesión para continuar con el pago.");
      return;
    }
    if (listaCarrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }
    navigate("/checkout");
  };

  // UI bloqueada si no hay usuario (similar a tu BlurOverlay de Home)
  const estaBloqueado = !user;

  return (
    <div
      className="container-fluid"
      style={{
        backgroundImage: 'url("/img/fondo.jpg")',
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
        backgroundPosition: "center",
        width: "100%",
        minHeight: "100vh",
        paddingTop: "60px",
        position: "relative",
      }}
    >
      <div className="container py-4" style={{ position: "relative", zIndex: 1 }}>
        <h1 className="mb-3">Carrito</h1>

        {!user && (
          <div className="alert alert-warning" role="alert">
            Debes <Link to="/login" className="alert-link">iniciar sesión</Link> o{" "}
            <Link to="/register" className="alert-link">registrarte</Link> para gestionar tu carrito.
          </div>
        )}

        {listaCarrito.length === 0 ? (
          <div>
            <div className="alert alert-info">Tu carrito está vacío.</div>
            <Link to="/" className="btn btn-primary">Volver a la tienda</Link>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th style={{ width: 140 }}>Precio</th>
                    <th style={{ width: 180 }}>Cantidad</th>
                    <th style={{ width: 160 }}>Subtotal</th>
                    <th style={{ width: 100 }}></th>
                  </tr>
                </thead>
                <tbody
                  style={{
                    filter: estaBloqueado ? "blur(4px)" : "none",
                    pointerEvents: estaBloqueado ? "none" : "auto",
                    userSelect: estaBloqueado ? "none" : "auto",
                  }}
                >
                  {listaCarrito.map(({ producto, precio, cantidad }) => (
                    <tr key={producto}>
                      <td className="fw-semibold">{producto}</td>
                      <td>{formatearPrecio(precio)}</td>
                      <td>
                        <div className="input-group">
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => decrementar(producto)}
                          >
                            −
                          </button>
                          <input
                            className="form-control text-center"
                            value={cantidad}
                            onChange={(e) => actualizarCantidad(producto, e.target.value)}
                          />
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => incrementar(producto)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="fw-semibold">{formatearPrecio(precio * cantidad)}</td>
                      <td>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => quitarDelCarrito(producto)}
                        >
                          Quitar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              className="d-flex flex-column flex-md-row align-items-md-center justify-content-md-between gap-3 mt-3"
              style={{
                filter: estaBloqueado ? "blur(4px)" : "none",
                pointerEvents: estaBloqueado ? "none" : "auto",
                userSelect: estaBloqueado ? "none" : "auto",
              }}
            >
              <div className="text-muted">
                <strong>{totalProductos}</strong> {totalProductos === 1 ? "artículo" : "artículos"}
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="fs-5">
                  Total: <strong>{formatearPrecio(totalPagar)}</strong>
                </div>
                <button className="btn btn-outline-secondary" onClick={vaciarCarrito}>
                  Vaciar carrito
                </button>
                <button className="btn btn-success" onClick={irAlCheckout}>
                  Ir a pagar
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Capa de bloqueo si NO hay sesión (mismo concepto que tu BlurOverlay) */}
      {!user && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "auto",
          }}
        >
          <h2 className="text-dark mb-3">Debes iniciar sesión para ver el carrito</h2>
          <div>
            <Link to="/login" className="btn btn-primary me-2">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="btn btn-outline-primary">
              Registrarse
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
