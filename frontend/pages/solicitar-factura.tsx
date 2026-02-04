import { useState } from 'react';
import Layout from '../components/Layout';

export default function SolicitarFactura() {
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('Enviando solicitud...');
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/public/appointments/${form.get('appointmentId')}/invoice`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ note: form.get('note') })
        }
      );

      if (!response.ok) {
        throw new Error('Error');
      }

      setStatus('Solicitud registrada. Recepción te contactará.');
      event.currentTarget.reset();
    } catch (error) {
      setStatus('No se pudo registrar la solicitud.');
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-6 shadow">
        <h1 className="text-xl font-semibold">Solicitar factura</h1>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input name="appointmentId" placeholder="ID de la cita" className="input" required />
          <textarea name="note" placeholder="Notas adicionales" className="input" />
          <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white">
            Enviar solicitud
          </button>
        </form>
        {status && <p className="mt-3 text-sm text-slate-600">{status}</p>}
      </div>
    </Layout>
  );
}
