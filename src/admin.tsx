import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Legend,
  PieChart, Pie, Cell,
} from 'recharts';
import AdminLogin from './login';
import './admin.css';

const SESSION_KEY = 'adm_token';

interface SurveyResponse {
  id: number;
  age: number | null;
  gender: string;
  faculty: string;
  wouldRecommend: boolean;
  whyRecommend: string;
  comments: string;
  priceRange: string;
  descOdor: number;
  descAroma: number;
  descSweetness: number;
  descTexture: number;
  intensityBanana: number;
  intensityChocolate: number;
  intensityGarbanzo: number;
  intensityCarrot: number;
}

const TOOLTIP_STYLE = {
  background: '#1e120a',
  border: '1px solid #c9a86c',
  color: '#f5e6d0',
  borderRadius: 8,
};

const INTERVAL_LABELS = ['1-2', '3-4', '5-6', '7-8', '9-10'];

const toIntervalIndex = (v: number) => {
  if (v <= 2) return 0;
  if (v <= 4) return 1;
  if (v <= 6) return 2;
  if (v <= 8) return 3;
  return 4;
};
// Convierte un array de respuestas a un conteo por intervalos para un campo específico
const countIntervals = (responses: SurveyResponse[], field: keyof SurveyResponse) =>
  INTERVAL_LABELS.map((name, i) => ({
    name,
    Cantidad: responses.filter(r => toIntervalIndex(r[field] as number) === i).length,
  }));

const avg = (values: number[]) =>
  values.length ? parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)) : 0;

/* barra de genero */
const GenderChart: React.FC<{ responses: SurveyResponse[] }> = ({ responses }) => {
  const data = [
    { name: 'Masculino', Cantidad: responses.filter(r => r.gender === 'masculino').length },
    { name: 'Femenino',  Cantidad: responses.filter(r => r.gender === 'femenino').length },
    { name: 'Otro',      Cantidad: responses.filter(r => r.gender === 'otro').length },
  ];
  return (
    <div className="adm-card">
      <h2 className="adm-card-title">Distribución por Sexo</h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3a2010" />
          <XAxis dataKey="name" tick={{ fill: '#c9a86c', fontSize: 13 }} />
          <YAxis allowDecimals={false} tick={{ fill: '#c9a86c', fontSize: 12 }} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(201,168,108,0.08)' }} />
          <Bar dataKey="Cantidad" fill="#c9a86c" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/* Torta de recomendación */
const RADIAN = Math.PI / 180;
const PIE_COLORS = ['#6dbb8a', '#d97070'];

const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent === 0) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Recomendación 
const RecommendPieChart: React.FC<{ responses: SurveyResponse[] }> = ({ responses }) => {
  const si = responses.filter(r => r.wouldRecommend === true).length;
  const no = responses.filter(r => r.wouldRecommend === false).length;
  const data = [
    { name: 'Sí lo recomendaría', value: si },
    { name: 'No lo recomendaría', value: no },
  ];
  return (
    <div className="adm-card">
      <h2 className="adm-card-title">¿Recomendarías el producto?</h2>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            labelLine={false}
            label={renderPieLabel}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i]} />
            ))}
          </Pie>
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Legend wrapperStyle={{ color: '#c9a86c', fontSize: 13, paddingTop: 8 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

/*Barras del precio*/
const PRICE_LABELS: Record<string, string> = {
  'Menos de $1.000':  '< $1.000',
  '$1.000 – $1.500':  '$1k – $1.5k',
  '$1.500 – $2.000':  '$1.5k – $2k',
  'Más de $2.000':    '> $2.000',
};
const PRICE_ORDER = ['Menos de $1.000', '$1.000 – $1.500', '$1.500 – $2.000', 'Más de $2.000'];

const PriceRangeChart: React.FC<{ responses: SurveyResponse[] }> = ({ responses }) => {
  const data = PRICE_ORDER.map(range => ({
    name: PRICE_LABELS[range],
    Cantidad: responses.filter(r => r.priceRange === range).length,
  }));
  return (
    <div className="adm-card">
      <h2 className="adm-card-title">¿Cuánto pagarías por el producto?</h2>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3a2010" />
          <XAxis dataKey="name" tick={{ fill: '#c9a86c', fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fill: '#c9a86c', fontSize: 12 }} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(201,168,108,0.08)' }} />
          <Bar dataKey="Cantidad" fill="#a78bfa" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/* Intensidad de sabores */
const FlavorRadar: React.FC<{ responses: SurveyResponse[] }> = ({ responses }) => {
  const data = [
    { flavor: 'Banana',    valor: avg(responses.map(r => r.intensityBanana)) },
    { flavor: 'Chocolate', valor: avg(responses.map(r => r.intensityChocolate)) },
    { flavor: 'Garbanzo',  valor: avg(responses.map(r => r.intensityGarbanzo)) },
    { flavor: 'Zanahoria', valor: avg(responses.map(r => r.intensityCarrot)) },
  ];
  return (
    <div className="adm-card adm-card--wide">
      <h2 className="adm-card-title">Intensidad de Sabores — Promedio (escala 1-10)</h2>
      <ResponsiveContainer width="100%" height={340}>
        <RadarChart data={data} margin={{ top: 16, right: 40, bottom: 16, left: 40 }}>
          <PolarGrid stroke="#4a2f1a" />
          <PolarAngleAxis dataKey="flavor" tick={{ fill: '#f5e6d0', fontSize: 14, fontWeight: 600 }} />
          <Radar name="Intensidad promedio" dataKey="valor" stroke="#e8975a" fill="#e8975a" fillOpacity={0.35} strokeWidth={2} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Legend wrapperStyle={{ color: '#c9a86c', fontSize: 13, paddingTop: 8 }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

/* Barras de atributos descriptivos (dulzor, textura, aroma, olor) */
const IntervalBarChart: React.FC<{
  title: string;
  data: { name: string; Cantidad: number }[];
  color: string;
}> = ({ title, data, color }) => (
  <div className="adm-card">
    <h2 className="adm-card-title">{title}</h2>
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#3a2010" />
        <XAxis dataKey="name" tick={{ fill: '#c9a86c', fontSize: 13 }} />
        <YAxis allowDecimals={false} tick={{ fill: '#c9a86c', fontSize: 12 }} />
        <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(201,168,108,0.08)' }} />
        <Bar dataKey="Cantidad" fill={color} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

/* Bloque de respuestas de texto */
const TextResponsesBlock: React.FC<{ title: string; items: string[] }> = ({ title, items }) => {
  const filled = items.filter(t => t && t.trim().length > 0);
  return (
    <div className="adm-card">
      <h2 className="adm-card-title">{title} <span style={{ color: '#6b4a2a', fontWeight: 400, fontSize: '0.85rem' }}>({filled.length} respuestas)</span></h2>
      {filled.length === 0 ? (
        <p className="adm-text-empty">Sin respuestas todavía.</p>
      ) : (
        <div className="adm-text-list">
          {filled.map((text, i) => (
            <div key={i} className="adm-text-item">{text}</div>
          ))}
        </div>
      )}
    </div>
  );
};

/* Dashboard de administración */
const Dashboard: React.FC<{ token: string; onLogout: () => void }> = ({ token, onLogout }) => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v3/encuestas/data', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (res.status === 401) throw new Error('Sesión expirada. Volvé a iniciar sesión.');
        return res.json();
      })
      .then(json => { setResponses(json.data ?? []); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [token]);

  if (loading) return <div className="adm-loading">Cargando datos...</div>;
  if (error)   return (
    <div className="adm-error">
      {error}
      <br />
      <button onClick={onLogout} style={{ marginTop: 16, padding: '8px 20px', cursor: 'pointer' }}>
        Volver al login
      </button>
    </div>
  );

  return (
    <div className="adm-root">
      <header className="adm-header">
        <h1 className="adm-title">Panel de Administración</h1>
        <p className="adm-subtitle">Evaluación Sensorial — Budín de Garbanzo y Zanahoria</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="adm-total-badge">{responses.length} respuestas totales</div>
          <button className="adm-logout-btn" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </header>

      <main className="adm-grid">
        {/* Demografía */}
        <GenderChart responses={responses} />

        {/* Sabores */}
        <FlavorRadar responses={responses} />

        {/* Atributos descriptivos */}
        <IntervalBarChart title="Nivel de Dulzor"             data={countIntervals(responses, 'descSweetness')} color="#d4a843" />
        <IntervalBarChart title="Aceptabilidad de la Textura" data={countIntervals(responses, 'descTexture')}   color="#b87d3a" />
        <IntervalBarChart title="Intensidad del Aroma"        data={countIntervals(responses, 'descAroma')}     color="#9b6d3f" />
        <IntervalBarChart title="Intensidad del Olor"         data={countIntervals(responses, 'descOdor')}      color="#7a5230" />

        {/* Recomendación y precio */}
        <RecommendPieChart responses={responses} />
        <PriceRangeChart   responses={responses} />

        {/* Respuestas de texto */}
        <TextResponsesBlock
          title="¿Por qué recomendarías el producto?"
          items={responses.map(r => r.whyRecommend)}
        />
        <TextResponsesBlock
          title="¿Qué cambios le harías?"
          items={responses.map(r => r.comments)}
        />
      </main>
    </div>
  );
};

/* Panel de administración */
const AdminDashboard: React.FC = () => {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(SESSION_KEY));

  const handleLoginSuccess = (t: string) => {
    sessionStorage.setItem(SESSION_KEY, t);
    setToken(t);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setToken(null);
  };

  if (!token) return <AdminLogin onSuccess={handleLoginSuccess} />;
  return <Dashboard token={token} onLogout={handleLogout} />;
};

export default AdminDashboard;
