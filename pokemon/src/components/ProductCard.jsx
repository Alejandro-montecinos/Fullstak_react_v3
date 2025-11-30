// ProductCard.jsx
import { useState } from 'react';

const formatearPrecio = (valor) =>
  Number(valor).toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });

const ProductCard = ({ producto, agregarAlCarrito }) => {
  const [cantidad, setCantidad] = useState(1);

  const handleAgregar = () => {
    agregarAlCarrito(producto, cantidad);
    setCantidad(1); // reset
  };

  if (!producto) return null;

  return (
    <div className="card" style={{ width: '18rem', height: '100%' }}>
      <img
  src={producto.rutaImagen}
  className="card-img-top"
  alt={producto.nombre}
  style={{
    height: '260px',        // ajusta el alto fijo que quieras
    objectFit: 'contain',   // muestra toda la carta aunque sobre espacio
    backgroundColor: '#000',// opcional, fondo detrás de la imagen
  }}
/>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{producto.nombre}</h5>
        <p className="card-text fw-bold fs-4 mb-2">
          {formatearPrecio(producto.precio)}
        </p>
        <p className="card-text text-muted small mb-3">
          Stock: {producto.cantidad || 0}
        </p>
        
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            value={cantidad}
            onChange={(e) => setCantidad(Math.max(1, Math.min(30, e.target.value)))}
            min="1"
            max="30"
          />
          <button className="btn btn-primary" onClick={handleAgregar}>
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
