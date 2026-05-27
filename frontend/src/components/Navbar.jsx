import { Link } from 'react-router-dom'
function Navbar() {
  return (
    <nav className="bg-zinc-900 text-white px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-500">
        Habit Planner
      </h1>

        <div className="flex gap-8 text-white">
            <Link to="/">Dashboard</Link>
            <Link to="/habits">Habits</Link>
            <Link to="/progress">Progress</Link>
        </div>
    </nav>
  );
}

export default Navbar;