import { useEffect, useState } from "react";
import HabitCard from "../components/HabitCard";
import AddHabitForm from "../components/AddHabitForm";

function Dashboard() {
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem("habits");

    return savedHabits
      ? JSON.parse(savedHabits)
      : [
          {
            id: 1,
            title: "Morning Workout",
            streak: 12,
            status: "Completed",
          },
          {
            id: 2,
            title: "Reading Books",
            streak: 8,
            status: "In Progress",
          },
          {
            id: 3,
            title: "Meditation",
            streak: 20,
            status: "Completed",
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const addHabit = (newHabit) => {
    const habit = {
      id: Date.now(),
      title: newHabit,
      streak: 0,
      status: "In Progress",
    };

    setHabits([...habits, habit]);
  };

  const deleteHabit = (id) => {
    const updatedHabits = habits.filter(
      (habit) => habit.id !== id
    );

    setHabits(updatedHabits);
  };

  const editHabit = (id, newTitle) => {
    const updatedHabits = habits.map((habit) =>
      habit.id === id
        ? { ...habit, title: newTitle }
        : habit
    );

    setHabits(updatedHabits);
  };

  const toggleStatus = (id) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === id) {
        return {
          ...habit,
          status:
            habit.status === "Completed"
              ? "In Progress"
              : "Completed",

          streak:
            habit.status === "Completed"
              ? Math.max(0, habit.streak - 1)
              : habit.streak + 1,
        };
      }

      return habit;
    });

    setHabits(updatedHabits);
  };

  const completedHabits = habits.filter(
    (habit) => habit.status === "Completed"
  ).length;

  const inProgressHabits = habits.filter(
    (habit) => habit.status === "In Progress"
  ).length;

  const completionRate =
    habits.length === 0
      ? 0
      : Math.round(
          (completedHabits / habits.length) * 100
        );

  return (
    <div className="p-10">

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <h3 className="text-zinc-400">Total Habits</h3>
          <p className="text-4xl text-white font-bold">
            {habits.length}
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <h3 className="text-zinc-400">Completed</h3>
          <p className="text-4xl text-green-500 font-bold">
            {completedHabits}
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <h3 className="text-zinc-400">In Progress</h3>
          <p className="text-4xl text-yellow-500 font-bold">
            {inProgressHabits}
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <h3 className="text-zinc-400 mb-3">
            Completion Rate
          </h3>

          <p className="text-4xl text-blue-500 font-bold mb-4">
            {completionRate}%
          </p>

          <div className="w-full bg-zinc-700 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${completionRate}%`,
              }}
            />
          </div>
        </div>

      </div>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-white text-7xl font-bold mb-6">
          Track Your Daily Habits
        </h1>

        <p className="text-gray-400 text-2xl mb-10">
          Build consistency, improve productivity,
          and achieve your goals.
        </p>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold mb-12">
          Get Started
        </button>

        <AddHabitForm addHabit={addHabit} />
      </div>

      {/* Habit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            id={habit.id}
            title={habit.title}
            streak={habit.streak}
            status={habit.status}
            deleteHabit={deleteHabit}
            toggleStatus={toggleStatus}
            editHabit={editHabit}
          />
        ))}
      </div>

    </div>
  );
}

export default Dashboard;