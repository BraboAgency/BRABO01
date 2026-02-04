import { useState } from 'react';
import Layout from '../components/Layout';

export default function Home() {
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('Enviando...');
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: payload.name,
          customerPhone: payload.phone,
          customerEmail: payload.email,
          scheduledAt: payload.date,
          vehicleMake: payload.make,
          vehicleModel: payload.model,
          vehicleYear: Number(payload.year),
          vehiclePlate: payload.plate,
          serviceNotes: payload.notes
        })
      });

      if (!response.ok) {
        throw new Error('No se pudo agendar');
      }

      const data = await response.json();
      setStatus(`Cita creada. Código de tracking: ${data.trackingCode}`);
      event.currentTarget.reset();
    } catch (error) {
      setStatus('Error al agendar la cita.');
    }
  }

  return (
    <Layout>
      <section className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Agenda tu cita para transmisión automática
          </h1>
          <p className="mt-3 text-slate-600">
            Recibimos tu auto a las 8:00 AM y te acompañamos con tracking en tiempo real.
          </p>
          <div className="mt-6 grid gap-4 rounded-2xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold">Pipeline del día</h2>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>✔ Recepción</li>
              <li>✔ Revisión inicial</li>
              <li>✔ Prueba de manejo</li>
              <li>✔ Servicio (aceite, filtros)</li>
              <li>✔ Preparación final</li>
              <li>✔ Listo para entrega</li>
            </ul>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl bg-white p-6 shadow"
        >
          <h2 className="text-lg font-semibold">Agendar cita</h2>
          <div className="grid gap-3">
            <input name="name" placeholder="Nombre completo" required className="input" />
            <input name="email" type="email" placeholder="Email" required className="input" />
            <input name="phone" placeholder="Teléfono" required className="input" />
            <input name="date" type="datetime-local" required className="input" />
          </div>
          <div className="grid gap-3">
            <input name="make" placeholder="Marca" required className="input" />
            <input name="model" placeholder="Línea/Modelo" required className="input" />
            <input name="year" type="number" placeholder="Año" required className="input" />
            <input name="plate" placeholder="Placa (opcional)" className="input" />
            <textarea name="notes" placeholder="Motivo o servicio solicitado" className="input" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white">
            Agendar
          </button>
          {status && <p className="text-sm text-slate-600">{status}</p>}
        </form>
      </section>
    </Layout>
  );
}
