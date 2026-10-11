import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import MobileNav from "../components/layout/MobileNav";
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
            {/* Desktop Left Sidebar (hidden on phones) */}
            <Sidebar />

            {/* Main Content Area (ml-0 on mobile, ml-16 on desktop) */}
            <div className="flex-1 ml-0 md:ml-16 min-w-0 transition-all duration-300 flex flex-col">
                <Topbar />
                <main className="flex-1 p-3 sm:p-6 lg:p-8 pb-28 md:pb-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Bottom Navigation Bar (visible only on mobile) */}
            <MobileNav />

            {/* Persistent Floating Focus Timer across pages */}
            <FloatingTimerWidget />

            {/* Thought of the Day Popup */}
            <MotivationModal />
        </div>
    );
}

export default MainLayout;
