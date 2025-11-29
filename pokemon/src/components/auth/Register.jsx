import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    password: '',
    confirmPassword: '',
    direccion: '',
    comuna: '',
    ciudad: '',
    numeracion: '',
    codigoPostal: '',
    indicacionesEntrega: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombreCompleto.trim()) {
      newErrors.nombreCompleto = 'El nombre completo es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }

    if (!formData.comuna.trim()) {
      newErrors.comuna = 'La comuna es requerida';
    }

    if (!formData.ciudad.trim()) {
      newErrors.ciudad = 'La ciudad es requerida';
    }

    if (!formData.numeracion.trim()) {
      newErrors.numeracion = 'La numeración es requerida';
    }

    if (!formData.codigoPostal.trim()) {
      newErrors.codigoPostal = 'El código postal es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { confirmPassword, ...userData } = formData;

      // Mapeo FORM → backend UsuarioModel
      const usuarioBackend = {
        nombre: userData.nombreCompleto,
        correo: userData.email,
        contrasenia: userData.password,
        direccion: userData.direccion,
        numeracion: userData.numeracion,
        comuna: userData.comuna,
        ciudad: userData.ciudad,
        codigoPostal: userData.codigoPostal,
        descripcionEntrega: userData.indicacionesEntrega,
      };

      await register(usuarioBackend);
      navigate('/');
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-6"
      style={{
        backgroundImage: 'url("/img/fondo2.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h2 className="text-center mb-0">Únete a la Aventura Pokémon</h2>
              </div>
              <div className="card-body p-4">
                {errors.submit && (
                  <div className="alert alert-danger" role="alert">
                    {errors.submit}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Información Personal */}
                  <fieldset className="mb-4">
                    <legend className="h5 text-primary border-bottom pb-2">
                      Información Personal
                    </legend>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="nombreCompleto" className="form-label">
                            Nombre Completo *
                          </label>
                          <input
                            type="text"
                            className={`form-control ${
                              errors.nombreCompleto ? 'is-invalid' : ''
                            }`}
                            id="nombreCompleto"
                            name="nombreCompleto"
                            value={formData.nombreCompleto}
                            onChange={handleChange}
                            placeholder="Ej: Ash Ketchum"
                          />
                          {errors.nombreCompleto && (
                            <div className="invalid-feedback">
                              {errors.nombreCompleto}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">
                            Email *
                          </label>
                          <input
                            type="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="ejemplo@pokemon.com"
                          />
                          {errors.email && (
                            <div className="invalid-feedback">{errors.email}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="password" className="form-label">
                            Contraseña *
                          </label>
                          <input
                            type="password"
                            className={`form-control ${
                              errors.password ? 'is-invalid' : ''
                            }`}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Mínimo 6 caracteres"
                          />
                          {errors.password && (
                            <div className="invalid-feedback">{errors.password}</div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="confirmPassword" className="form-label">
                            Confirmar Contraseña *
                          </label>
                          <input
                            type="password"
                            className={`form-control ${
                              errors.confirmPassword ? 'is-invalid' : ''
                            }`}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Repite tu contraseña"
                          />
                          {errors.confirmPassword && (
                            <div className="invalid-feedback">
                              {errors.confirmPassword}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </fieldset>

                  {/* Dirección de Entrega */}
                  <fieldset className="mb-4">
                    <legend className="h5 text-primary border-bottom pb-2">
                      Dirección de Entrega
                    </legend>

                    <div className="mb-3">
                      <label htmlFor="direccion" className="form-label">
                        Dirección *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.direccion ? 'is-invalid' : ''
                        }`}
                        id="direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        placeholder="Ej: Calle Pikachu"
                      />
                      {errors.direccion && (
                        <div className="invalid-feedback">{errors.direccion}</div>
                      )}
                    </div>

                    <div className="row">
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label htmlFor="numeracion" className="form-label">
                            Numeración *
                          </label>
                          <input
                            type="text"
                            className={`form-control ${
                              errors.numeracion ? 'is-invalid' : ''
                            }`}
                            id="numeracion"
                            name="numeracion"
                            value={formData.numeracion}
                            onChange={handleChange}
                            placeholder="Ej: 123"
                          />
                          {errors.numeracion && (
                            <div className="invalid-feedback">{errors.numeracion}</div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="mb-3">
                          <label htmlFor="comuna" className="form-label">
                            Comuna *
                          </label>
                          <input
                            type="text"
                            className={`form-control ${
                              errors.comuna ? 'is-invalid' : ''
                            }`}
                            id="comuna"
                            name="comuna"
                            value={formData.comuna}
                            onChange={handleChange}
                            placeholder="Ej: Pueblo Paleta"
                          />
                          {errors.comuna && (
                            <div className="invalid-feedback">{errors.comuna}</div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="mb-3">
                          <label htmlFor="ciudad" className="form-label">
                            Ciudad *
                          </label>
                          <input
                            type="text"
                            className={`form-control ${
                              errors.ciudad ? 'is-invalid' : ''
                            }`}
                            id="ciudad"
                            name="ciudad"
                            value={formData.ciudad}
                            onChange={handleChange}
                            placeholder="Ej: Kanto"
                          />
                          {errors.ciudad && (
                            <div className="invalid-feedback">{errors.ciudad}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="codigoPostal" className="form-label">
                            Código Postal *
                          </label>
                          <input
                            type="text"
                            className={`form-control ${
                              errors.codigoPostal ? 'is-invalid' : ''
                            }`}
                            id="codigoPostal"
                            name="codigoPostal"
                            value={formData.codigoPostal}
                            onChange={handleChange}
                            placeholder="Ej: 1234567"
                          />
                          {errors.codigoPostal && (
                            <div className="invalid-feedback">
                              {errors.codigoPostal}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="indicacionesEntrega" className="form-label">
                        Indicaciones para la Entrega (Opcional)
                      </label>
                      <textarea
                        className="form-control"
                        id="indicacionesEntrega"
                        name="indicacionesEntrega"
                        value={formData.indicacionesEntrega}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Ej: Timbre azul, departamento 4B..."
                      />
                    </div>
                  </fieldset>

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Registrando...
                        </>
                      ) : (
                        'Crear Cuenta Pokémon'
                      )}
                    </button>
                  </div>

                  <div className="text-center mt-3">
                    <small className="text-muted">
                      ¿Ya tienes cuenta?{' '}
                      <a href="/login" className="text-decoration-none">
                        Inicia sesión aquí
                      </a>
                    </small>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
