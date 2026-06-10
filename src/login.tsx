import React, { useState } from 'react';
import './login.css';

interface Props {
  onSuccess: (token: string) => void;
}

const AdminLogin: React.FC<Props> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res  = await fetch('/api/v3/admin/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ username, password }),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.message ?? 'Error al iniciar sesión.');
      } else {
        onSuccess(json.token);
      }
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lgn-root">
      <div className="lgn-card">
        <div className="lgn-icon">🔐</div>
        <h1 className="lgn-title">Panel de Administración</h1>
        <p className="lgn-subtitle">Evaluación Sensorial — Acceso restringido</p>

        <form className="lgn-form" onSubmit={handleSubmit}>
          <div className="lgn-field">
            <label className="lgn-label">Usuario</label>
            <input
              className="lgn-input"
              type="text"
              placeholder="Ingresá tu usuario"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="lgn-field">
            <label className="lgn-label">Contraseña</label>
            <input
              className="lgn-input"
              type="password"
              placeholder="Ingresá tu contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="lgn-error">{error}</div>}

          <button className="lgn-btn" type="submit" disabled={loading}>
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
