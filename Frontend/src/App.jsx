import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import DashboardPage from "./pages/DashboardPage";
import AlumniPage from "./pages/AlumniPage";
import EventPage from "./pages/EventPage";
import DonationPage from "./pages/DonationPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`flex h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Sidebar darkMode={darkMode} />
      <div className="flex flex-col flex-1 overflow-hidden lg:ml-0 ml-0">
        <Topbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className={`flex-1 overflow-y-auto p-4 lg:p-6 transition-colors duration-300 ${
          darkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          <Routes>
            <Route path="/" element={<DashboardPage darkMode={darkMode} />} />
            <Route path="/alumni" element={<AlumniPage darkMode={darkMode} />} />
            <Route path="/events" element={<EventPage darkMode={darkMode} />} />
            <Route path="/donations" element={<DonationPage darkMode={darkMode} />} />
            <Route path="/reports" element={<ReportsPage darkMode={darkMode} />} />
            <Route path="/settings" element={<SettingsPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
