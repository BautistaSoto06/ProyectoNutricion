import React, { useState, useEffect } from 'react';
import './brownie.css';


const BrownieSurvey: React.FC = () => {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const rootEl = document.getElementById('root');
    const prevHtml = html.style.background;
    const prevBody = body.style.background;
    const prevBorder = rootEl?.style.borderColor ?? '';
    html.style.background = '#2c1503';
    body.style.background = '#2c1503';
    if (rootEl) rootEl.style.borderColor = 'transparent';
    return () => {
      html.style.background = prevHtml;
      body.style.background = prevBody;
      if (rootEl) rootEl.style.borderColor = prevBorder;
    };
  }, []);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    faculty: '',
    would_recommend: '',
    why_recommend: '',
    desc_odor: 1,
    desc_aroma: 1,
    desc_sweetness: 1,
    desc_texture: 1,
    intensity_banana: 1,
    intensity_chocolate: 1,
    intensity_garbanzo: 1,
    intensity_carrot: 1,
    comments: '',
    price_range: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: parseInt(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Manual Validation
    const ageVal = parseInt(formData.age, 10);
    if (!formData.age || isNaN(ageVal) || ageVal < 15 || ageVal > 99) {
      setError('Seleccione una edad dentro del rango permitido (15-99)');
      setLoading(false);
      return;
    }

    if (!formData.faculty || !formData.gender) {
      setError('Por favor, complete todos los campos obligatorios');
      setLoading(false);
      return;
    }

    try {

        const payload = { ...formData, age: ageVal || null };
        const response = await fetch(`/api/v3/encuestas/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      let result;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        result = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Respuesta no JSON del servidor: ${text || response.statusText}`);
      }

      if (response.ok) {
        setSubmitted(true);
      } else {
        setError(result?.message || 'Error al enviar la encuesta');
      }
    } catch (err: any) {
      console.error('Error al enviar:', err);
      const isNetworkError = err instanceof TypeError && /fetch|network|internet/i.test(err.message);
      setError(isNetworkError
        ? 'Sin conexión a Internet. Verificá tu red e intentá nuevamente.'
        : err.message || 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bs-root">
        <div className="bs-thanks">
          <div className="bs-thanks-icon">✨</div>
          <h1>¡Muchas gracias!</h1>
          <p>Tu opinión nos ayuda a mejorar nuestro Brownie de garbanzo y zanahoria.</p>
          <button className="bs-submit" onClick={() => window.location.reload()}>
            Enviar otra respuesta
          </button>
        </div>
      </div>
    );
  }

  const renderSlider = (name: string, label: string) => (
    <div className="bs-field">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="bs-label">{label}</span>
        <span className="bs-slider-value">{(formData as any)[name]}</span>
      </div>
      <div className="bs-slider-track">
        <input
          type="range"
          name={name}
          min="1"
          max="10"
          value={(formData as any)[name]}
          onChange={handleSliderChange}
          className="bs-slider-input"
        />
        <div
          className="bs-slider-fill"
          style={{ width: `${(((formData as any)[name] - 1) / 9) * 100}%` }}
        ></div>
        <div
          className="bs-slider-thumb"
          style={{ left: `calc(${(((formData as any)[name] - 1) / 9) * 100}% - 11px)` }}
        ></div>
      </div>
      <div className="bs-slider-labels">
        <span>Muy bajo</span>
        <span>Muy alto</span>
      </div>
    </div>
  );

  return (
    <div className="bs-root">
      <div className="bs-hero">
        <a href="/admin" className="bs-admin-link">Administración</a>
        <img src="/Logo.jpeg" alt="Logo" style={{ height: 300, marginTop: 16, marginBottom: 8, borderRadius: 14, objectFit: 'contain' }} />
        <h1>Evaluación Sensorial</h1>
        <br />
        <p className="bs-subtitle">Sin Tacc ● Natural ● Delicioso</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <section className="bs-card">
          <div className="bs-card-header">
            <span className="bs-step">1</span>
            <h2>Datos Generales</h2>
          </div>

          <div className="bs-field">
            <label className="bs-label">Edad</label>
            <input
              type="number"
              name="age"
              className="bs-input"
              placeholder="Ej: 22"
              min="15"
              max="99"
              value={formData.age}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="bs-field">
            <label className="bs-label">Carrera / Facultad</label>
            <select
                name="faculty"
                className="bs-input"
                value={formData.faculty}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="ingenieria">Facultad de Ciencias Sociales y Humanidades</option>
                <option value="ciencias">Facultad de Ciencias de la Salud y Bienestar</option>
                <option value="humanidades">Facultad de Ingenieria, Tecnologia y Arquitectura</option>
                <option value="salud">Facultad de Ciencias Juridicas y Politicas</option>
                <option value="artes">Facultad de Ciencias Economicas Y Ambientales</option>
              </select>
          </div>

          <div className="bs-field">
            <label className="bs-label">Género</label>
            <select
              name="gender"
              className="bs-input"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccionar...</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
            </select>
          </div>
        </section>

        <section className="bs-card">
          <div className="bs-card-header">
            <span className="bs-step">2</span>
            <h2>Atributos Descriptivos</h2>
          </div>
          {renderSlider('desc_odor', 'Intensidad del Olor')}
          {renderSlider('desc_aroma', 'Intensidad del Aroma')}
          {renderSlider('desc_sweetness', 'Nivel de Dulzor')}
          {renderSlider('desc_texture', 'Aceptabilidad de la Textura')}
        </section>

        <section className="bs-card">
          <div className="bs-card-header">
            <span className="bs-step">3</span>
            <h2>Intensidad de Sabores</h2>
          </div>
          {renderSlider('intensity_banana', 'Sabor a Banana')}
          {renderSlider('intensity_chocolate', 'Sabor a Chocolate')}
          {renderSlider('intensity_garbanzo', 'Sabor a Garbanzo')}
          {renderSlider('intensity_carrot', 'Sabor a Zanahoria')}
        </section>

        <section className="bs-card">
          <div className="bs-card-header">
            <span className="bs-step">4</span>
            <h2>Recomendación y Comentarios</h2>
          </div>

          <div className="bs-field">
            <label className="bs-label">¿Recomendarías este producto?</label>
            <div className="bs-chips">
              <button
                type="button"
                className={`bs-chip ${formData.would_recommend === 'si' ? 'bs-chip--active' : ''}`}
                onClick={() => setFormData((prev: any) => ({ ...prev, would_recommend: 'si' }))}
              >
                Sí
              </button>
              <button
                type="button"
                className={`bs-chip ${formData.would_recommend === 'no' ? 'bs-chip--active' : ''}`}
                onClick={() => setFormData((prev: any) => ({ ...prev, would_recommend: 'no' }))}
              >
                No
              </button>
            </div>
          </div>

          <div className="bs-field">
            <label className="bs-label">¿Cuánto pagarías por este producto?</label>
            <div className="bs-chips">
              {['Menos de $1.000', '$1.000 – $1.500', '$1.500 – $2.000', 'Más de $2.000'].map((range) => (
                <button
                  key={range}
                  type="button"
                  className={`bs-chip ${formData.price_range === range ? 'bs-chip--active' : ''}`}
                  onClick={() => setFormData((prev: any) => ({ ...prev, price_range: range }))}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="bs-field">
            <label className="bs-label">¿Por qué?</label>
            <input
              type="text"
              name="why_recommend"
              className="bs-input"
              value={formData.why_recommend}
              onChange={handleInputChange}
            />
          </div>

          <div className="bs-field">
            <label className="bs-label">¿Qué cambios le harías o comentarios adicionales?</label>
            <textarea
              name="comments"
              className="bs-input bs-textarea"
              value={formData.comments}
              onChange={handleInputChange}
            ></textarea>
          </div>
        </section>

        <div className="bs-footer">
          {error && <div className="bs-error-banner">{error}</div>}
          <button type="submit" className="bs-submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Encuesta'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BrownieSurvey;
