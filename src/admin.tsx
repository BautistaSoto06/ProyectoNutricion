import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Legend,
} from 'recharts';
import './admin.css';

interface SurveyResponse {
  id: number;
  name: string;
  age: number;
  gender: string;
  faculty: string;
  wouldRecommend: boolean;
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

const countIntervals = (responses: SurveyResponse[], field: keyof SurveyResponse) =>
  INTERVAL_LABELS.map((name, i) => ({
    name,
    Cantidad: responses.filter(r => toIntervalIndex(r[field] as number) === i).length,
  }));

const avg = (values: number[]) =>
  values.length ? parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)) : 0;

/* ─── Gender bar chart ─────────────────────────────── */
const GenderChart: React.FC<{ responses: SurveyResponse[] }> = ({ responses }) => {
  const data = [
    { name: 'Masculino', Cantidad: responses.filter(r => r.gender === 'masculino').length },
    { name: 'Femenino', Cantidad: responses.filter(r => r.gender === 'femenino').length },
    { name: 'Otro', Cantidad: responses.filter(r => r.gender === 'otro').length },
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

/* ─── Age bar chart ────────────────────────────────── */
const AgeChart: React.FC<{ responses: SurveyResponse[] }> = ({ responses }) => {
  const data = [
    { name: '18-25', Cantidad: responses.filter(r => r.age >= 18 && r.age <= 25).length },
    { name: '26-40', Cantidad: responses.filter(r => r.age >= 26 && r.age <= 40).length },
    { name: '+40', Cantidad: responses.filter(r => r.age > 40).length },
  ];
  return (
    <div className="adm-card">
      <h2 className="adm-card-title">Distribución por Edad</h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3a2010" />
          <XAxis dataKey="name" tick={{ fill: '#c9a86c', fontSize: 13 }} />
          <YAxis allowDecimals={false} tick={{ fill: '#c9a86c', fontSize: 12 }} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(201,168,108,0.08)' }} />
          <Bar dataKey="Cantidad" fill="#e8975a" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/* ─── Flavor radar chart ───────────────────────────── */
const FlavorRadar: React.FC<{ responses: SurveyResponse[] }> = ({ responses }) => {
  const data = [
    { flavor: 'Banana', valor: avg(responses.map(r => r.intensityBanana)) },
    { flavor: 'Chocolate', valor: avg(responses.map(r => r.intensityChocolate)) },
    { flavor: 'Garbanzo', valor: avg(responses.map(r => r.intensityGarbanzo)) },
    { flavor: 'Zanahoria', valor: avg(responses.map(r => r.intensityCarrot)) },
  ];
  return (
    <div className="adm-card adm-card--wide">
      <h2 className="adm-card-title">Intensidad de Sabores — Promedio (escala 1-10)</h2>
      <ResponsiveContainer width="100%" height={340}>
        <RadarChart data={data} margin={{ top: 16, right: 40, bottom: 16, left: 40 }}>
          <PolarGrid stroke="#4a2f1a" />
          <PolarAngleAxis dataKey="flavor" tick={{ fill: '#f5e6d0', fontSize: 14, fontWeight: 600 }} />
          <PolarRadiusAxis angle={30} domain={[0, 10]} tickCount={6} tick={{ fill: '#c9a86c', fontSize: 11 }} />
          <Radar name="Intensidad promedio" dataKey="valor" stroke="#e8975a" fill="#e8975a" fillOpacity={0.35} strokeWidth={2} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Legend wrapperStyle={{ color: '#c9a86c', fontSize: 13, paddingTop: 8 }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

/* ─── Interval bar chart (generic) ────────────────── */
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

/* ─── Main admin dashboard ─────────────────────────── */
const AdminDashboard: React.FC = () => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v2/encuestas/data')
      .then(res => res.json())
      .then(json => { setResponses(json.data ?? []); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) return <div className="adm-loading">Cargando datos...</div>;
  if (error)   return <div className="adm-error">Error al cargar datos: {error}</div>;

  return (
    <div className="adm-root">
      <header className="adm-header">
        <h1 className="adm-title">Panel de Administración</h1>
        <p className="adm-subtitle">Evaluación Sensorial — Budín de Garbanzo y Zanahoria</p>
        <div className="adm-total-badge">{responses.length} respuestas totales</div>
      </header>

      <main className="adm-grid">
        <GenderChart responses={responses} />
        <AgeChart responses={responses} />
        <FlavorRadar responses={responses} />
        <IntervalBarChart
          title="Nivel de Dulzor"
          data={countIntervals(responses, 'descSweetness')}
          color="#d4a843"
        />
        <IntervalBarChart
          title="Aceptabilidad de la Textura"
          data={countIntervals(responses, 'descTexture')}
          color="#b87d3a"
        />
        <IntervalBarChart
          title="Intensidad del Aroma"
          data={countIntervals(responses, 'descAroma')}
          color="#9b6d3f"
        />
        <IntervalBarChart
          title="Intensidad del Olor"
          data={countIntervals(responses, 'descOdor')}
          color="#7a5230"
        />
      </main>
    </div>
  );
};

export default AdminDashboard;
