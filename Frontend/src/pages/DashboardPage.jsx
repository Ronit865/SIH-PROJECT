import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts";
import { Users, Calendar, Heart, Award } from "lucide-react";
import StateCard from "../components/StateCard";

const alumniGrowthData = [
  { name: "Jan", alumni: 45, donations: 12000 },
  { name: "Feb", alumni: 52, donations: 15000 },
  { name: "Mar", alumni: 48, donations: 18000 },
  { name: "Apr", alumni: 61, donations: 22000 },
  { name: "May", alumni: 55, donations: 19000 },
  { name: "Jun", alumni: 67, donations: 25000 },
];

const departmentData = [
  { name: "Engineering", value: 45, color: "#3B82F6" },
  { name: "Business", value: 25, color: "#10B981" },
  { name: "Medicine", value: 20, color: "#F59E0B" },
  { name: "Arts", value: 10, color: "#EF4444" },
];

const recentEvents = [
  { id: 1, title: "Annual Alumni Meet", date: "2024-01-15", attendees: 120 },
  { id: 2, title: "Tech Workshop", date: "2024-01-10", attendees: 85 },
  { id: 3, title: "Career Fair", date: "2024-01-05", attendees: 200 },
];

const DashboardPage = ({ darkMode }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold transition-colors ${
          darkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          Dashboard
        </h1>
        <div className={`text-sm transition-colors ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StateCard
          title="Total Alumni"
          value="1,247"
          icon={<Users className="h-6 w-6" />}
          color="blue"
          trend={{ positive: true, value: "+12% from last month" }}
          darkMode={darkMode}
        />
        <StateCard
          title="Events Organized"
          value="24"
          icon={<Calendar className="h-6 w-6" />}
          color="green"
          trend={{ positive: true, value: "+3 this month" }}
          darkMode={darkMode}
        />
        <StateCard
          title="Donations Collected"
          value="$67,890"
          icon={<Heart className="h-6 w-6" />}
          color="purple"
          trend={{ positive: true, value: "+18% from last month" }}
          darkMode={darkMode}
        />
        <StateCard
          title="Active Mentors"
          value="156"
          icon={<Award className="h-6 w-6" />}
          color="orange"
          trend={{ positive: false, value: "-2% from last month" }}
          darkMode={darkMode}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alumni Growth Chart */}
        <div className={`p-6 rounded-lg shadow-md transition-colors ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
        }`}>
          <h2 className={`text-xl font-semibold mb-4 transition-colors ${
            darkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Alumni Growth & Donations
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={alumniGrowthData}>
              <XAxis 
                dataKey="name" 
                tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280' }}
                axisLine={{ stroke: darkMode ? '#374151' : '#E5E7EB' }}
              />
              <YAxis 
                yAxisId="left" 
                tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280' }}
                axisLine={{ stroke: darkMode ? '#374151' : '#E5E7EB' }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280' }}
                axisLine={{ stroke: darkMode ? '#374151' : '#E5E7EB' }}
              />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'alumni' ? `${value} Alumni` : `$${value.toLocaleString()}`,
                  name === 'alumni' ? 'New Alumni' : 'Donations'
                ]}
                contentStyle={{
                  backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                  border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                  borderRadius: '8px',
                  color: darkMode ? '#F3F4F6' : '#1F2937'
                }}
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="alumni" 
                stackId="1"
                stroke="#3B82F6" 
                fill="#3B82F6"
                fillOpacity={0.6}
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="donations" 
                stackId="2"
                stroke="#10B981" 
                fill="#10B981"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className={`p-6 rounded-lg shadow-md transition-colors ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
        }`}>
          <h2 className={`text-xl font-semibold mb-4 transition-colors ${
            darkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Alumni by Department
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Percentage']} 
                contentStyle={{
                  backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                  border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                  borderRadius: '8px',
                  color: darkMode ? '#F3F4F6' : '#1F2937'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {departmentData.map((dept, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: dept.color }}
                ></div>
                <span className={`text-sm transition-colors ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {dept.name} ({dept.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className={`rounded-lg shadow-md transition-colors ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
      }`}>
        <div className={`p-6 border-b transition-colors ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-xl font-semibold transition-colors ${
            darkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Recent Events
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentEvents.map((event) => (
              <div 
                key={event.id} 
                className={`flex items-center justify-between p-4 border rounded-lg transition-all duration-200 hover:scale-102 ${
                  darkMode 
                    ? 'border-gray-700 hover:bg-gray-700 hover:border-gray-600' 
                    : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div>
                  <h3 className={`font-medium transition-colors ${
                    darkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {event.title}
                  </h3>
                  <p className={`text-sm transition-colors ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {event.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium transition-colors ${
                    darkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {event.attendees} attendees
                  </p>
                  <p className={`text-xs transition-colors ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Registered
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
