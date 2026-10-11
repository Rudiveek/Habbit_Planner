import { NavLink } from "react-router-dom";
import {
    House,
    Target,
    Calendar,
    Apple,
    Dumbbell,
    ChartColumn,
    User,
    Settings,
} from "lucide-react";

function Navbar() {
    const menuItems = [
        {
            name: "Dashboard",
            path: "/",
            icon: <House size={22} />,
        },
        {
            name: "Habits",
            path: "/habits",
            icon: <Target size={22} />,
        },
        {
            name: "Calendar",
            path: "/calendar",
            icon: <Calendar size={22} />,
        },
        {
            name: "Food",
            path: "/food",
            icon: <Apple size={22} />,
        },
        {
            name: "Physical Fitness",
            path: "/fitness",
            icon: <Dumbbell size={22} />,
        },
        {
            name: "Analytics",
            path: "/progress",
            icon: <ChartColumn size={22} />,
        },
        {
            name: "Profile",
            path: "/profile",
            icon: <User size={22} />,
        },
        {
            name: "Settings",
            path: "/settings",
            icon: <Settings size={22} />,
        },
    ];

    return (
        <aside
            className="
      group
      fixed
      left-0
      top-0
      h-screen
      bg-zinc-950
      border-r
      border-zinc-800
      transition-all
      duration-300
      w-20
      hover:w-72
      overflow-hidden
      z-50
    "
        >
            <div className="flex items-center h-20 px-6">
                <span className="text-4xl">🌿</span>

                <h1
                    className="
          ml-4
          text-xl
          font-bold
          whitespace-nowrap
          opacity-0
          group-hover:opacity-100
          transition-all
          duration-300
        "
                >
                    Habit Planner
                </h1>
            </div>

            <nav className="mt-6">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-7 py-4 transition-all
              ${
                  isActive
                      ? "bg-blue-600 text-white"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`
                        }
                    >
                        {item.icon}

                        <span
                            className="
              whitespace-nowrap
              opacity-0
              group-hover:opacity-100
              transition-all
              duration-300
            "
                        >
                            {item.name}
                        </span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}

export default Navbar;
