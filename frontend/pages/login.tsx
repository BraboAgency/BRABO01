import { useState } from 'react';
import Layout from '../components/Layout';

export default function Login() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.get('email'),
          password: form.get('password')
        })
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }
      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      window.location.href = '/dashboard';
    } catch (err) {
      setError('No se pudo iniciar sesión');
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow">
        <h1 className="text-xl font-semibold">Acceso interno</h1>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input name="email" type="email" placeholder="Email" className="input" required />
          <input name="password" type="password" placeholder="Contraseña" className="input" required />
          <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white">Ingresar</button>
        </form>
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </div>
    </Layout>
  );
}
