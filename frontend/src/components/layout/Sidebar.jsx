import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuraLogo from "../AuraLogo";
import {
    LayoutDashboard,
    Target,
    Timer,
    Calendar,
    Apple,
    Dumbbell,
    BarChart3,
    User,
    Settings,
    Sparkles,
    LogOut
} from "lucide-react";

const menuItems = [
    {
        name: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Habits",
        path: "/habits",
        icon: Target,
    },
    {
        name: "Focus & Pomodoro",
        path: "/focus",
        icon: Timer,
    },
    {
        name: "Calendar",
        path: "/calendar",
        icon: Calendar,
    },
    {
        name: "Food",
        path: "/food",
        icon: Apple,
    },
    {
        name: "Physical Fitness",
        path: "/fitness",
        icon: Dumbbell,
    },
    {
        name: "Analytics",
        path: "/progress",
        icon: BarChart3,
    },
    {
        name: "Profile",
        path: "/profile",
        icon: User,
    },
    {
        name: "Settings",
        path: "/settings",
        icon: Settings,
    },
];

export function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <aside
            className="
            fixed
            top-0
            left-0
            h-screen
            w-16
            hover:w-64
            bg-[#09090b]/90
            backdrop-blur-xl
            border-r
            border-zinc-800/80
            transition-all
            duration-300
            ease-in-out
            group
            overflow-hidden
            z-40
            flex
            flex-col
            justify-between
            select-none
            shadow-2xl
            "
        >
            <div>
                {/* Logo Header */}
                <div className="h-16 flex items-center px-3.5 border-b border-zinc-800/60 overflow-hidden">
                    <AuraLogo size="sm" />
                    <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
                        <h1 className="font-extrabold text-base tracking-wider bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                            AURA
                        </h1>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Growth System</p>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="p-2 space-y-1.5 mt-3">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center h-11 px-3.5 rounded-xl transition-all duration-200 group/item relative ${
                                        isActive
                                            ? "bg-indigo-600/15 text-indigo-400 font-semibold border border-indigo-500/30 shadow-lg shadow-indigo-500/10"
                                            : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover/item:scale-110 ${isActive ? "text-indigo-400" : ""}`} />
                                        <span className="ml-3 text-sm tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
                                            {item.name}
                                        </span>

                                        {/* Tooltip on Collapsed Hover */}
                                        <div className="absolute left-16 bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs font-medium px-2.5 py-1 rounded-md shadow-xl opacity-0 group-hover/item:opacity-100 group-hover:opacity-0 pointer-events-none transition-opacity duration-150 z-50 whitespace-nowrap">
                                            {item.name}
                                        </div>

                                        {/* Active Indicator Bar */}
                                        {isActive && (
                                            <div className="absolute right-0 top-2 bottom-2 w-1 bg-indigo-500 rounded-l-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            {/* User Profile & Logout Footer */}
            <div className="p-3 border-t border-zinc-800/60 flex items-center justify-between">
                <div className="flex items-center min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 p-0.5 shrink-0 shadow-md">
                        <img
                            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                            alt={user?.name || "User"}
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>
                    <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
                        <div className="text-xs font-semibold text-zinc-200 truncate">{user?.name || "Aura Member"}</div>
                        <div className="text-[10px] text-indigo-400 font-mono">{user?.email || "PRO MEMBER"}</div>
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    title="Log Out"
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
