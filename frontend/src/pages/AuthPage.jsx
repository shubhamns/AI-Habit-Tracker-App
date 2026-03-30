import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function AuthPage({ mode }) {
  const navigate = useNavigate();
  const { isAuthenticated, login, register, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const action = mode === "register" ? register : login;
      await action(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] bg-ink p-10 text-white shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sand">Habit OS</p>
          <h1 className="mt-6 text-5xl font-extrabold leading-tight">
            Win the week with clearer routines and smarter insights.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-white/80">
            Track habits, visualize progress, and get AI-powered coaching from your real behavior patterns.
          </p>
        </div>

        <div className="glass-card p-8 md:p-10">
          <h2 className="text-3xl font-extrabold">
            {mode === "register" ? "Create your account" : "Welcome back"}
          </h2>
          <p className="mt-2 text-sm text-ink/60 dark:text-slate-400">
            {mode === "register"
              ? "Start building consistency in a few seconds."
              : "Sign in to continue your tracking flow."}
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="w-full rounded-2xl border border-black/5 bg-white/80 px-4 py-3 outline-none focus:border-coral dark:border-white/10 dark:bg-slate-800"
            />
            <input
              type="password"
              placeholder="Minimum 8 characters"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              className="w-full rounded-2xl border border-black/5 bg-white/80 px-4 py-3 outline-none focus:border-coral dark:border-white/10 dark:bg-slate-800"
            />
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
            <button
              disabled={loading}
              className="w-full rounded-2xl bg-coral px-4 py-3 font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Please wait..." : mode === "register" ? "Create account" : "Login"}
            </button>
          </form>

          <button
            onClick={() => navigate(mode === "register" ? "/login" : "/register")}
            className="mt-4 text-sm font-semibold text-teal"
          >
            {mode === "register" ? "Already have an account? Login" : "Need an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
