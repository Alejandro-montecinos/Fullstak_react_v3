import { useState } from 'react';

const ProductCard = ({ producto, imagen, precio, agregarAlCarrito }) => {
  const [cantidad, setCantidad] = useState(1);

  const handleCantidadChange = (e) => {
    let value = Number(e.target.value);
    value = Math.max(1, Math.min(value, 30));
    setCantidad(value);
  };

  return (
    <article
      className="p-3 rounded shadow text-center"
      style={{
        width: '180px',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '2px solid #eee',
        backgroundColor: 'rgba(255,255,255,0.5)', // fondo con opacidad
        boxShadow: '0 0 15px 3px rgba(255, 255, 204, 0.7)', // brillo suave
        transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 0 30px 6px rgba(255, 255, 204, 0.9)';
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 0 15px 3px rgba(255, 255, 204, 0.7)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <img
        src={imagen}
        alt={producto}
        className="rounded mb-2"
        style={{
          width: '100%',
          height: '100px',
          objectFit: 'contain',
          background: 'transparent', // fondo transparente para la imagen
        }}
      />
      <h5 style={{ margin: '12px 0 4px' }}>{producto}</h5>
      <p style={{ fontWeight: 600, color: '#333', marginBottom: '8px' }}>${precio.toLocaleString()}</p>
      <div className="input-group mb-2" style={{ width: '120px' }}>
        <button
          className="btn btn-outline-secondary btn-sm"
          style={{ minWidth: '32px' }}
          onClick={() => setCantidad(Math.max(1, cantidad - 1))}
        >
          -
        </button>
        <input
          type="number"
          min="1"
          max="30"
          value={cantidad}
          onChange={handleCantidadChange}
          className="form-control text-center"
          style={{ padding: '2px' }}
        />
        <button
          className="btn btn-outline-secondary btn-sm"
          style={{ minWidth: '32px' }}
          onClick={() => setCantidad(Math.min(30, cantidad + 1))}
        >
          +
        </button>
      </div>
      <button
        className="btn w-100"
        style={{
          fontWeight: 600,
          backgroundColor: '#646372ff',
          color: 'white',
          border: 'none',
        }}
        onClick={() => agregarAlCarrito(producto, precio, cantidad)}
      >
        <i className="bi bi-ticket-perforated"></i> Añadir
      </button>
    </article>
  );
};

export default ProductCard;
