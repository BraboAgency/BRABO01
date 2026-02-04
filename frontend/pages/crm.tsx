import Layout from '../components/Layout';

export default function CRM() {
  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">CRM de clientes y vehículos</h1>
        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-slate-600">
            Desde aquí recepción y gerencia pueden buscar por nombre, teléfono o placa y
            revisar el historial de servicios.
          </p>
        </div>
      </div>
    </Layout>
  );
}
