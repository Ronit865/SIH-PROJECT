import React, { useState } from "react";
import { Download, FileText, BarChart3, PieChart, TrendingUp, Calendar, Users, Heart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";

const analyticsData = {
  alumni: [
    { month: "Jan", count: 45, active: 32 },
    { month: "Feb", count: 52, active: 38 },
    { month: "Mar", count: 48, active: 35 },
    { month: "Apr", count: 61, active: 42 },
    { month: "May", count: 55, active: 39 },
    { month: "Jun", count: 67, active: 48 },
  ],
  events: [
    { month: "Jan", events: 3, attendance: 245 },
    { month: "Feb", events: 2, attendance: 180 },
    { month: "Mar", events: 4, attendance: 320 },
    { month: "Apr", events: 3, attendance: 275 },
    { month: "May", events: 5, attendance: 410 },
    { month: "Jun", events: 2, attendance: 165 },
  ],
  donations: [
    { month: "Jan", amount: 195000, donors: 15 },
    { month: "Feb", amount: 145000, donors: 12 },
    { month: "Mar", amount: 225000, donors: 18 },
    { month: "Apr", amount: 180000, donors: 14 },
    { month: "May", amount: 210000, donors: 16 },
    { month: "Jun", amount: 165000, donors: 11 },
  ]
};

const reportTypes = [
  {
    id: "alumni",
    title: "Alumni Report",
    description: "Comprehensive alumni database with contact information, employment status, and engagement metrics",
    icon: Users,
    color: "blue",
    size: "1.2 MB",
    lastGenerated: "2024-01-15"
  },
  {
    id: "events",
    title: "Events Analytics",
    description: "Event attendance, feedback scores, and engagement analysis",
    icon: Calendar,
    color: "green",
    size: "850 KB",
    lastGenerated: "2024-01-14"
  },
  {
    id: "donations",
    title: "Financial Report",
    description: "Donation trends, donor analysis, and financial summaries",
    icon: Heart,
    color: "purple",
    size: "640 KB",
    lastGenerated: "2024-01-13"
  },
  {
    id: "engagement",
    title: "Engagement Metrics",
    description: "Alumni engagement scores, participation rates, and activity trends",
    icon: TrendingUp,
    color: "orange",
    size: "920 KB",
    lastGenerated: "2024-01-12"
  }
];

const ReportsPage = ({ darkMode }) => {
  const [selectedChart, setSelectedChart] = useState("alumni");
  const [dateRange, setDateRange] = useState("6months");

  const handleDownload = (reportType) => {
    // Simulate download
    console.log(`Downloading ${reportType} report...`);
    // In a real app, this would trigger a file download
  };

  const renderChart = () => {
    switch (selectedChart) {
      case "alumni":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.alumni}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="count" 
                stackId="1"
                stroke="#3B82F6" 
                fill="#3B82F6"
                fillOpacity={0.6}
                name="Total Alumni"
              />
              <Area 
                type="monotone" 
                dataKey="active" 
                stackId="2"
                stroke="#10B981" 
                fill="#10B981"
                fillOpacity={0.6}
                name="Active Alumni"
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "events":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.events}>
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="events" fill="#10B981" name="Events Count" />
              <Bar yAxisId="right" dataKey="attendance" fill="#3B82F6" name="Total Attendance" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "donations":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.donations}>
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'amount' ? `₹${value.toLocaleString()}` : value,
                  name === 'amount' ? 'Donation Amount' : 'Number of Donors'
                ]}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="amount" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                name="amount"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="donors" 
                stroke="#F59E0B" 
                strokeWidth={2}
                name="donors"
              />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      orange: "from-orange-500 to-orange-600"
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold transition-colors ${
          darkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          Reports & Analytics
        </h1>
        <div className="flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-100' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Downloads</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
            <Download className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Data Sources</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
            <div className="flex space-x-2">
              {[
                { key: "alumni", label: "Alumni" },
                { key: "events", label: "Events" },
                { key: "donations", label: "Donations" }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedChart(tab.key)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedChart === tab.key
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6">
          {renderChart()}
        </div>
      </div>

      {/* Available Reports */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Available Reports</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <div key={report.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${getColorClasses(report.color)}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                        <p className="text-sm text-gray-500">Size: {report.size}</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{report.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Last generated: {new Date(report.lastGenerated).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDownload(report.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Custom Report Builder */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Custom Report Builder</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                <option>Alumni Analysis</option>
                <option>Event Summary</option>
                <option>Financial Report</option>
                <option>Engagement Metrics</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last 6 months</option>
                <option>Last year</option>
                <option>Custom range</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
              </select>
            </div>
          </div>
          <div className="mt-6">
            <button className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <FileText className="h-4 w-4" />
              <span>Generate Custom Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
