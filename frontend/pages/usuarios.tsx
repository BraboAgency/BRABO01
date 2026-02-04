import Layout from '../components/Layout';

export default function Usuarios() {
  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Usuarios y roles</h1>
        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-slate-600">
            Gestión de gerente, técnicos y recepción con permisos RBAC.
          </p>
        </div>
      </div>
    </Layout>
  );
}
