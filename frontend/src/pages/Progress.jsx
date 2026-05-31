function Progress() {
  const stats = {
    totalHabits: 12,
    completedHabits: 8,
    inProgressHabits: 4,
    completionRate: 67,
    longestStreak: 24,
    bestHabit: "Morning Workout",
  };

  return (
    <div className="p-10 text-white">

      <h1 className="text-5xl font-bold mb-8">
        Progress Analytics 📊
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <h3 className="text-zinc-400 mb-2">
            Total Habits
          </h3>

          <p className="text-4xl font-bold">
            {stats.totalHabits}
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <h3 className="text-zinc-400 mb-2">
            Completed Habits
          </h3>

          <p className="text-4xl font-bold text-green-500">
            {stats.completedHabits}
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <h3 className="text-zinc-400 mb-2">
            In Progress
          </h3>

          <p className="text-4xl font-bold text-yellow-500">
            {stats.inProgressHabits}
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <h3 className="text-zinc-400 mb-2">
            Completion Rate
          </h3>

          <p className="text-4xl font-bold text-blue-500">
            {stats.completionRate}%
          </p>

          <div className="w-full bg-zinc-700 rounded-full h-3 mt-4">
            <div
              className="bg-blue-500 h-3 rounded-full"
              style={{
                width: `${stats.completionRate}%`,
              }}
            />
          </div>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <h3 className="text-zinc-400 mb-2">
            Longest Streak
          </h3>

          <p className="text-4xl font-bold text-orange-500">
            🔥 {stats.longestStreak}
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <h3 className="text-zinc-400 mb-2">
            Best Habit
          </h3>

          <p className="text-2xl font-semibold">
            {stats.bestHabit}
          </p>
        </div>

      </div>

      <div className="bg-zinc-900 p-6 rounded-2xl mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Weekly Progress
        </h2>

        <div className="flex items-end gap-4 h-48">

          <div className="bg-blue-500 w-10 h-24 rounded-t-lg"></div>
          <div className="bg-blue-500 w-10 h-36 rounded-t-lg"></div>
          <div className="bg-blue-500 w-10 h-20 rounded-t-lg"></div>
          <div className="bg-blue-500 w-10 h-40 rounded-t-lg"></div>
          <div className="bg-blue-500 w-10 h-32 rounded-t-lg"></div>
          <div className="bg-blue-500 w-10 h-44 rounded-t-lg"></div>
          <div className="bg-blue-500 w-10 h-28 rounded-t-lg"></div>

        </div>

        <div className="flex gap-5 mt-3 text-zinc-400">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>

    </div>
  );
}

export default Progress;