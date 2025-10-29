import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      setErrors({ email: 'El email es requerido' });
      return;
    }

    if (!formData.password) {
      setErrors({ password: 'La contraseña es requerida' });
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'url("/img/fondo2.png")',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center',
        // filter: 'blur(8px)', <-- Esta línea fue removida para quitar el blur
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <div className="card shadow" style={{ maxWidth: '400px', width: '100%', backgroundColor: 'white', filter: 'none' }}>
        <div className="card-header bg-primary text-white">
          <h2 className="text-center mb-0">Iniciar Sesión</h2>
        </div>
        <div className="card-body p-4">
          {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Tu contraseña"
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Entrar al Mundo Pokémon'
                )}
              </button>
            </div>

            <div className="text-center mt-3">
              <small className="text-muted">
                ¿No tienes cuenta? <a href="/register" className="text-decoration-none">Regístrate aquí</a>
              </small>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
