import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { StatusBadge } from '../components/StatusBadge';

export default function Dashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const columns = [
    { key: 'RECIBIDO', label: 'Recepción' },
    { key: 'REVISION', label: 'Revisión' },
    { key: 'PRUEBA_MANEJO', label: 'Prueba manejo' },
    { key: 'SERVICIO', label: 'Servicio' },
    { key: 'PREPARACION', label: 'Preparación' },
    { key: 'LISTO', label: 'Listo' }
  ];

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem('accessToken');
      const date = new Date().toISOString().slice(0, 10);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/daily?date=${date}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    }
    load();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Dashboard del día</h1>
        <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {columns.map((column) => (
            <div key={column.key} className="rounded-2xl bg-white p-3 shadow">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-700">{column.label}</h2>
                <span className="text-xs text-slate-500">
                  {appointments.filter((item) => item.pipelineStatus === column.key).length}
                </span>
              </div>
              <div className="space-y-3">
                {appointments
                  .filter((appointment) => appointment.pipelineStatus === column.key)
                  .map((appointment) => (
                    <div key={appointment.id} className="rounded-xl border border-slate-100 p-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold">
                          {appointment.vehicle.make} {appointment.vehicle.model}
                        </h3>
                        <StatusBadge label={appointment.pipelineStatus} />
                      </div>
                      <p className="text-xs text-slate-600">Cliente: {appointment.customer.name}</p>
                      <p className="text-xs text-slate-500">
                        Mecánico: {appointment.assignedMechanic?.name ?? 'Sin asignar'}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
