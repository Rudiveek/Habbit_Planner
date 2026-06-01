import { useParams } from "react-router-dom";

function HabitDetails() {
  const { id } = useParams();

  const habits = JSON.parse(localStorage.getItem("habits")) || [];

  const habit = habits.find(
    (habit) => habit.id === Number(id)
  );

  if (!habit) {
    return (
      <div className="p-10 text-white">
        <h1 className="text-4xl font-bold">
          Habit Not Found
        </h1>
      </div>
    );
  }

  return (
    <div className="p-10 text-white">
      <h1 className="text-5xl font-bold mb-8">
        {habit.title}
      </h1>

      <div className="bg-zinc-900 p-8 rounded-2xl">

        <h2 className="text-3xl font-semibold mb-6">
          Habit ID: {habit.id}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-zinc-800 p-6 rounded-xl">
            <h3 className="text-zinc-400 mb-2">
              Current Streak
            </h3>

            <p className="text-4xl font-bold text-orange-500">
              🔥 {habit.streak}
            </p>
          </div>

          <div className="bg-zinc-800 p-6 rounded-xl">
            <h3 className="text-zinc-400 mb-2">
              Current Status
            </h3>

            <p
              className={`text-3xl font-bold ${
                habit.status === "Completed"
                  ? "text-green-500"
                  : "text-yellow-500"
              }`}
            >
              {habit.status}
            </p>
          </div>

          <div className="bg-zinc-800 p-6 rounded-xl">
            <h3 className="text-zinc-400 mb-2">
              Best Streak
            </h3>

            <p className="text-4xl font-bold text-green-500">
              {habit.streak}
            </p>
          </div>

        </div>

        <div className="mt-8 bg-zinc-800 p-6 rounded-xl">
          <h3 className="text-2xl font-bold mb-4">
            Heatmap (Coming Soon)
          </h3>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, index) => (
              <div
                key={index}
                className="h-8 w-8 rounded bg-blue-600"
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default HabitDetails;