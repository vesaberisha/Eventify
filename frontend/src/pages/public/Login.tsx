import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../../lib/apiBase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login deshtoi.");
      }

      localStorage.setItem("eventify_access_token", data.accessToken);
      localStorage.setItem("eventify_refresh_token", data.refreshToken);
      setMessage("Login me sukses.");
      setEmail("");
      setPassword("");
    } catch (submitError) {
      if (submitError instanceof TypeError) {
        setError(
          "Nuk u lidh me serverin. Nise backend-in dhe (nese proxy nuk perputhet) vendos VITE_DEV_PROXY_TARGET ne .env te frontend-it."
        );
      } else {
        setError(submitError instanceof Error ? submitError.message : "Gabim i papritur.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Hyr ne llogari</h1>
      <p className="text-gray-600 mb-6">Login me email dhe password.</p>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-70"
        >
          {loading ? "Duke bere login..." : "Login"}
        </button>
      </form>

      {message ? <p className="mt-4 text-green-700">{message}</p> : null}
      {error ? <p className="mt-4 text-red-600">{error}</p> : null}

      <p className="mt-6 text-sm text-gray-600">
        Nuk ke llogari?{" "}
        <Link to="/register" className="text-indigo-600 font-medium hover:underline">
          Register
        </Link>
      </p>
    </main>
  );
}
