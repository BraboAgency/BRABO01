import { useState } from 'react';
import Layout from '../components/Layout';
import Timeline from '../components/Timeline';
import { StatusBadge } from '../components/StatusBadge';

export default function Tracking() {
  const [trackingCode, setTrackingCode] = useState('');
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setData(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/public/track/${trackingCode}`
      );
      if (!response.ok) {
        throw new Error('No encontrado');
      }
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError('No se encontró la cita.');
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Tracking de tu cita</h1>
        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
          <input
            value={trackingCode}
            onChange={(event) => setTrackingCode(event.target.value)}
            placeholder="Código de tracking"
            className="input"
          />
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-white">Buscar</button>
        </form>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {data && (
          <div className="grid gap-6 rounded-2xl bg-white p-6 shadow">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-semibold">{data.vehicle.make} {data.vehicle.model}</h2>
              <StatusBadge label={data.pipelineStatus} />
            </div>
            <p className="text-sm text-slate-600">
              Responsable: {data.assignedMechanic?.name ?? 'Sin asignar'}
            </p>
            <Timeline
              items={data.statusEvents.map((event: any) => ({
                status: event.pipelineStatus,
                time: new Date(event.createdAt).toLocaleString(),
                notes: event.notes
              }))}
            />
            {data.eta && (
              <p className="text-sm text-slate-600">ETA: {new Date(data.eta).toLocaleString()}</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
