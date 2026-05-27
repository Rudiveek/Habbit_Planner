function Navbar() {
  return (
    <nav className="bg-zinc-900 text-white px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-500">
        Habit Planner
      </h1>

      <ul className="flex gap-6 text-sm">
        <li className="cursor-pointer hover:text-blue-400">
          Dashboard
        </li>

        <li className="cursor-pointer hover:text-blue-400">
          Habits
        </li>

        <li className="cursor-pointer hover:text-blue-400">
          Progress
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;