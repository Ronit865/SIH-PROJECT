import React, { useState } from "react";
import { Search, Bell, User, Moon, Sun } from "lucide-react";

const Topbar = ({ darkMode, setDarkMode }) => {
  const [notifications] = useState(3); // Mock notification count

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <header className={`flex justify-between items-center px-4 lg:px-6 py-4 shadow-sm border-b transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Search Bar */}
      <div className="flex items-center flex-1 max-w-md ml-12 lg:ml-0">
        <div className="relative w-full">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${
            darkMode ? 'text-gray-400' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder="Search..."
            className={`w-full pl-10 pr-4 py-2 border rounded-lg outline-none transition-all duration-200 text-sm lg:text-base ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-2 lg:space-x-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-lg transition-all duration-200 ${
            darkMode 
              ? 'text-yellow-400 hover:text-yellow-300 hover:bg-gray-700' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
        >
          {darkMode ? <Sun className="h-4 w-4 lg:h-5 lg:w-5" /> : <Moon className="h-4 w-4 lg:h-5 lg:w-5" />}
        </button>

        {/* Notifications */}
        <button className={`relative p-2 rounded-lg transition-all duration-200 ${
          darkMode 
            ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
        }`}>
          <Bell className="h-4 w-4 lg:h-5 lg:w-5" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center text-xs animate-pulse">
              {notifications}
            </span>
          )}
        </button>

        {/* Profile */}
        <div className="flex items-center space-x-2 lg:space-x-3">
          <div className="text-right hidden lg:block">
            <p className={`text-sm font-medium transition-colors ${
              darkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>
              Admin User
            </p>
            <p className={`text-xs transition-colors ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Super Admin
            </p>
          </div>
          <div className="relative group">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Admin Profile"
              className="w-7 h-7 lg:w-8 lg:h-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 transition-all duration-200 group-hover:scale-105"
            />
            <div className="absolute bottom-0 right-0 h-2 w-2 lg:h-3 lg:w-3 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
