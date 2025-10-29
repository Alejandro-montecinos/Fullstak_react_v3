import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const CLAVE_CARRITO = "carritoReact";

const formatearPrecio = (valor) =>
  Number(valor).toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });

function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [listaCarrito, setListaCarrito] = useState(() => {
    const guardado = localStorage.getItem(CLAVE_CARRITO);
    return guardado ? JSON.parse(guardado) : [];
  });

  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(listaCarrito));
  }, [listaCarrito]);

  const totalProductos = listaCarrito.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPagar = listaCarrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

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
    if (window.confirm("¿Vaciar todo el carrito?")) setListaCarrito([]);
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
          <div className="alert alert-warning">
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
                <tbody>
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

            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-md-between gap-3 mt-3">
              <div className="text-muted">
                <strong>{totalProductos}</strong>{" "}
                {totalProductos === 1 ? "artículo" : "artículos"}
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
    </div>
  );
}

export default Cart;
