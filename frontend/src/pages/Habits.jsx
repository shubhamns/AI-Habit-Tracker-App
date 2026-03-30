import { useEffect, useMemo, useState } from "react";

import api from "../axios/client";
import HabitGrid from "../components/HabitGrid";
import { useAppStore } from "../store/useAppStore";

const emptyForm = { name: "", frequency: "daily" };

export default function Habits() {
  const { search } = useAppStore();
  const [habits, setHabits] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const loadHabits = async () => {
    const { data } = await api.get("/habits");
    setHabits(data);
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const filteredHabits = useMemo(
    () => habits.filter((habit) => habit.name.toLowerCase().includes(search.toLowerCase())),
    [habits, search],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (editingId) {
      await api.put(`/habits/${editingId}`, form);
    } else {
      await api.post("/habits", form);
    }
    setForm(emptyForm);
    setEditingId(null);
    await loadHabits();
  };

  const handleEdit = (habit) => {
    setEditingId(habit.id);
    setForm({ name: habit.name, frequency: habit.frequency });
  };

  const handleDelete = async (habitId) => {
    await api.delete(`/habits/${habitId}`);
    if (editingId === habitId) {
      setEditingId(null);
      setForm(emptyForm);
    }
    await loadHabits();
  };

  const handleToggle = async (habitId, date, completed) => {
    await api.post("/track", { habit_id: habitId, date, completed });
    await loadHabits();
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-card p-6">
          <h2 className="text-2xl font-extrabold">{editingId ? "Edit habit" : "Create habit"}</h2>
          <p className="mt-2 text-sm text-ink/60 dark:text-slate-400">
            Capture one behavior at a time and keep the frequency simple.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Morning workout"
              className="w-full rounded-2xl border border-black/5 bg-white/80 px-4 py-3 outline-none focus:border-coral dark:border-white/10 dark:bg-slate-800"
            />
            <select
              value={form.frequency}
              onChange={(event) => setForm({ ...form, frequency: event.target.value })}
              className="w-full rounded-2xl border border-black/5 bg-white/80 px-4 py-3 outline-none focus:border-coral dark:border-white/10 dark:bg-slate-800"
            >
              <option value="daily">Daily</option>
              <option value="weekdays">Weekdays</option>
              <option value="3x per week">3x per week</option>
              <option value="custom">Custom</option>
            </select>
            <div className="flex gap-3">
              <button className="rounded-2xl bg-coral px-4 py-3 font-semibold text-white">
                {editingId ? "Save changes" : "Add habit"}
              </button>
              {editingId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                  className="rounded-2xl border border-black/10 px-4 py-3 font-semibold dark:border-white/10"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-2xl font-extrabold">Habit library</h2>
          <div className="mt-6 space-y-3">
            {filteredHabits.map((habit) => (
              <div
                key={habit.id}
                className="flex flex-col gap-4 rounded-3xl border border-black/5 bg-white/60 p-5 dark:border-white/10 dark:bg-slate-800/70 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold">{habit.name}</p>
                  <p className="text-sm text-ink/60 dark:text-slate-400">
                    {habit.frequency} • {habit.streak} day streak
                  </p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleEdit(habit)} className="rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-white dark:bg-teal">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(habit.id)}
                    className="rounded-2xl bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <HabitGrid habits={filteredHabits} onToggle={handleToggle} />
    </div>
  );
}
