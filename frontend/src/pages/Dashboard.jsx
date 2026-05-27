import { useState } from "react";
import HabitCard from "../components/HabitCard";
import AddHabitForm from "../components/AddHabitForm";

function Dashboard() {
  const [habits, setHabits] = useState([
    {
      title: "Morning Workout",
      streak: 12,
      status: "Completed",
    },
    {
      title: "Reading Books",
      streak: 8,
      status: "In Progress",
    },
    {
      title: "Meditation",
      streak: 20,
      status: "Completed",
    },
  ]);

  const addHabit = (title) => {
    const newHabit = {
      title,
      streak: 0,
      status: "In Progress",
    };

    setHabits([...habits, newHabit]);
  };

  return (
    <div className="text-white px-8 md:px-16 py-20">
      <div className="max-w-5xl">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Track Your Daily Habits
        </h1>

        <p className="text-zinc-400 text-lg md:text-2xl mt-6 leading-relaxed">
          Build consistency, improve productivity,
          and achieve your goals with your personal
          habit planner.
        </p>

        <button className="mt-10 bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold transition duration-300">
          Get Started
        </button>

        <AddHabitForm addHabit={addHabit} />
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-20">
        {habits.map((habit, index) => (
          <HabitCard
            key={index}
            title={habit.title}
            streak={habit.streak}
            status={habit.status}
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;