import { useState } from "react";

function AddHabitForm({ addHabit }) {
  const [habitTitle, setHabitTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!habitTitle.trim()) return;

    addHabit(habitTitle);

    setHabitTitle("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-16 flex gap-4 flex-wrap"
    >
      <input
        type="text"
        placeholder="Enter a new habit..."
        value={habitTitle}
        onChange={(e) => setHabitTitle(e.target.value)}
        className="bg-zinc-900 border border-zinc-700 text-white px-5 py-3 rounded-xl w-80 outline-none focus:border-blue-500"
      />

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-medium transition"
      >
        Add Habit
      </button>
    </form>
  );
}

export default AddHabitForm;