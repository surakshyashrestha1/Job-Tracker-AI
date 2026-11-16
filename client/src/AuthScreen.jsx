import { useState } from "react";

function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = isRegister
        ? "/api/auth/register"
        : "/api/auth/login";

      const body = isRegister
        ? form
        : {
            email: form.email,
            password: form.password,
          };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Authentication failed"
        );
      }

      onAuthenticated(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-center text-3xl font-bold text-slate-900">
          JobTracker AI
        </h1>

        <p className="mt-2 text-center text-slate-500">
          {isRegister
            ? "Create your account"
            : "Welcome back! Log in to continue."}
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4"
        >
          {isRegister && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={80}
                className="mt-2 w-full rounded-lg border border-slate-300 p-3"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="mt-2 w-full rounded-lg border border-slate-300 p-3"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={isRegister ? 10 : 1}
              autoComplete={
                isRegister
                  ? "new-password"
                  : "current-password"
              }
              className="mt-2 w-full rounded-lg border border-slate-300 p-3"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isRegister
              ? "Create Account"
              : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}
          <button
            type="button"
            onClick={() => {
              setMode(isRegister ? "login" : "register");
              setError("");
            }}
            className="ml-2 font-semibold text-blue-600"
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthScreen;