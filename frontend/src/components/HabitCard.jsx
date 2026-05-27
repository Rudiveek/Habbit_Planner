function HabitCard({ title, streak, status }) {
  return (
    <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 hover:border-blue-500 hover:-translate-y-1 transition duration-300 shadow-lg">
      <h2 className="text-2xl font-semibold text-white">
        {title}
      </h2>

      <p className="text-zinc-400 mt-3">
        Current Streak:
        <span className="text-white font-medium">
          {" "} {streak} days
        </span>
      </p>

      <button
        className={`mt-5 px-4 py-2 rounded-lg text-sm font-medium ${
          status === "Completed"
            ? "bg-green-600"
            : "bg-yellow-500 text-black"
        }`}
      >
        {status}
      </button>
    </div>
  );
}

export default HabitCard;