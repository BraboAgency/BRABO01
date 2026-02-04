import Layout from '../components/Layout';

export default function Facturas() {
  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Bandeja de solicitudes de factura</h1>
        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-slate-600">
            Aquí se muestran las solicitudes pendientes con opción de adjuntar PDF o URL.
          </p>
        </div>
      </div>
    </Layout>
  );
}
