import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { FocusProvider } from "./context/FocusContext";
import ProtectedRoute from "./components/ProtectedRoute";

import MainLayout from "./layouts/MainLayout";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Habits from "./pages/Habits";
import Progress from "./pages/Progress";
import HabitDetails from "./pages/HabitDetails";
import Calendar from "./pages/Calendar";
import Food from "./pages/Food";
import Fitness from "./pages/Fitness";
import FocusTimer from "./pages/FocusTimer";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// Habitify-style Smart Root Route:
// Unauthenticated visitors see the public SaaS landing page;
// Authenticated members are routed directly into their dashboard.
function RootRoute() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-zinc-400 gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 animate-pulse">
                    <span className="text-xl font-bold">A</span>
                </div>
                <p className="text-sm font-medium tracking-wide">Loading Aura Habit Engine...</p>
            </div>
        );
    }

    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />;
}

function App() {
    return (
        <AuthProvider>
            <AppProvider>
                <FocusProvider>
                    <Routes>
                        {/* 1. Habitify-style Public Landing & Marketing */}
                        <Route path="/" element={<RootRoute />} />
                        <Route path="/welcome" element={<LandingPage />} />
                        <Route path="/landing" element={<LandingPage />} />

                        {/* 2. Public Authentication Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />

                        {/* 3. Protected Member Dashboard & Features */}
                        <Route element={<ProtectedRoute />}>
                            <Route element={<MainLayout />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/habits" element={<Habits />} />
                                <Route path="/progress" element={<Progress />} />
                                <Route path="/habit/:id" element={<HabitDetails />} />
                                <Route path="/calendar" element={<Calendar />} />
                                <Route path="/food" element={<Food />} />
                                <Route path="/fitness" element={<Fitness />} />
                                <Route path="/focus" element={<FocusTimer />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/settings" element={<Settings />} />
                            </Route>
                        </Route>

                        {/* 4. Catch-all fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </FocusProvider>
            </AppProvider>
        </AuthProvider>
    );
}

export default App;
