import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Heart, 
  FileText, 
  Settings,
  GraduationCap,
  Menu,
  X
} from "lucide-react";

const Sidebar = ({ darkMode }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { path: "/", name: "Dashboard", icon: LayoutDashboard },
    { path: "/alumni", name: "Alumni", icon: Users },
    { path: "/events", name: "Events", icon: Calendar },
    { path: "/donations", name: "Donations", icon: Heart },
    { path: "/reports", name: "Reports", icon: FileText },
    { path: "/settings", name: "Settings", icon: Settings },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className={`p-2 rounded-lg shadow-md transition-colors ${
            darkMode 
              ? 'bg-gray-800 text-gray-300 hover:text-gray-100 hover:bg-gray-700' 
              : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative lg:translate-x-0 z-50 lg:z-auto
        w-64 shadow-lg h-full transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${darkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
        }
      `}>
        <div className={`p-6 border-b transition-colors ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className={`font-bold text-xl transition-colors ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Alumni Admin
              </h1>
              <p className={`text-sm transition-colors ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Management System
              </p>
            </div>
          </div>
        </div>
        
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? darkMode
                      ? "bg-indigo-900 text-indigo-300 border-r-2 border-indigo-400 shadow-lg" 
                      : "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700 shadow-sm"
                    : darkMode
                      ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className={`h-5 w-5 transition-colors ${
                  isActive 
                    ? darkMode ? "text-indigo-400" : "text-indigo-700"
                    : darkMode ? "text-gray-400 group-hover:text-gray-300" : "text-gray-400 group-hover:text-gray-600"
                }`} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`absolute bottom-4 left-4 right-4 p-3 rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              darkMode ? 'bg-green-400' : 'bg-green-500'
            }`}></div>
            <span className={`text-xs ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              System Online
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
