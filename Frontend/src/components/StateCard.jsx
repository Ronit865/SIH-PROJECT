import React from 'react';

const StateCard = ({ title, value, icon, color = "blue", trend = null, darkMode = false }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
    red: "from-red-500 to-red-600",
    indigo: "from-indigo-500 to-indigo-600"
  };

  return (
    <div className={`rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${
      darkMode 
        ? 'bg-gray-800 border border-gray-700' 
        : 'bg-white border border-gray-100'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium uppercase tracking-wide transition-colors ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {title}
          </p>
          <p className={`text-3xl font-bold mt-2 transition-colors ${
            darkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            {value}
          </p>
          {trend && (
            <p className={`text-sm mt-2 flex items-center ${
              trend.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              <span className="mr-1">
                {trend.positive ? '↗' : '↘'}
              </span>
              {trend.value}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-gradient-to-r ${colorClasses[color]} text-white shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StateCard;