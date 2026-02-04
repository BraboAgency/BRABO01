import Layout from '../components/Layout';

export default function Historial() {
  return (
    <Layout>
      <div className="space-y-4 rounded-2xl bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold">Historial de servicios</h1>
        <p className="text-sm text-slate-600">
          Ingresa tu correo o teléfono en recepción para ver el historial completo por vehículo.
        </p>
        <div className="rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-500">
          Esta pantalla se conecta al CRM interno para mostrar servicios por vehículo.
        </div>
      </div>
    </Layout>
  );
}
