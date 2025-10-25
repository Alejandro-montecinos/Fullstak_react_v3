function Home() {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <h1>¡Bienvenido a la Pokédex!</h1>
          <p className="lead">Inicia sesión o regístrate para comenzar tu aventura.</p>
          <div className="mt-4">
            <a href="/login" className="btn btn-primary me-3">Iniciar Sesión</a>
            <a href="/register" className="btn btn-outline-primary">Registrarse</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; // ← ESTA LÍNEA ES IMPORTANTE