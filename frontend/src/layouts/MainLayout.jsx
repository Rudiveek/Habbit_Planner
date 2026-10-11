import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import { Topbar } from "../components/Topbar";
import { MotivationModal } from "../components/MotivationModal";
import { FloatingTimerWidget } from "../components/FloatingTimerWidget";
import { useApp } from "../context/AppContext";

function MainLayout() {
    const { theme } = useApp();

    return (
        <div className={`flex min-h-screen transition-colors duration-200 ${
            theme === 'light'
                ? 'bg-transparent text-[#0c1a20] selection:bg-[#d9531e]/20 selection:text-[#d9531e]'
                : 'bg-[#09090b] text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200'
        }`}>
            {/* Collapsed Hover Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 ml-16 min-w-0 transition-all duration-300 flex flex-col">
                <Topbar />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>

            {/* Persistent Floating Focus Timer across pages */}
            <FloatingTimerWidget />

            {/* Thought of the Day Popup */}
            <MotivationModal />
        </div>
    );
}

export default MainLayout;
