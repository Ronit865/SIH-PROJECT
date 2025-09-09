import React, { useState } from "react";
import { Heart, TrendingUp, Download, Filter, Search, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import StateCard from "../components/StateCard";

const mockDonations = [
  {
    id: 1,
    donorName: "Rahul Mehta",
    amount: 15000,
    date: "2024-01-15",
    purpose: "Infrastructure Development",
    category: "infrastructure",
    status: "completed",
    method: "Online",
    alumni: true
  },
  {
    id: 2,
    donorName: "Priya Patel",
    amount: 25000,
    date: "2024-01-10",
    purpose: "Scholarship Fund",
    category: "scholarship",
    status: "completed",
    method: "Bank Transfer",
    alumni: true
  },
  {
    id: 3,
    donorName: "Tech Corp Ltd",
    amount: 50000,
    date: "2024-01-08",
    purpose: "Research Grant",
    category: "research",
    status: "completed",
    method: "Cheque",
    alumni: false
  },
  {
    id: 4,
    donorName: "Amit Sharma",
    amount: 10000,
    date: "2024-01-05",
    purpose: "Emergency Fund",
    category: "emergency",
    status: "pending",
    method: "Online",
    alumni: true
  },
  {
    id: 5,
    donorName: "Sneha Singh",
    amount: 20000,
    date: "2024-01-03",
    purpose: "Library Enhancement",
    category: "infrastructure",
    status: "completed",
    method: "Online",
    alumni: true
  },
  {
    id: 6,
    donorName: "Anonymous",
    amount: 75000,
    date: "2024-01-01",
    purpose: "General Fund",
    category: "general",
    status: "completed",
    method: "Bank Transfer",
    alumni: false
  },
];

const monthlyData = [
  { month: "Jan", amount: 195000 },
  { month: "Feb", amount: 145000 },
  { month: "Mar", amount: 225000 },
  { month: "Apr", amount: 180000 },
  { month: "May", amount: 210000 },
  { month: "Jun", amount: 165000 },
];

const categoryData = [
  { name: "Scholarship", value: 35, amount: 85000, color: "#3B82F6" },
  { name: "Infrastructure", value: 25, amount: 60000, color: "#10B981" },
  { name: "Research", value: 20, amount: 50000, color: "#F59E0B" },
  { name: "Emergency", value: 10, amount: 25000, color: "#EF4444" },
  { name: "General", value: 10, amount: 25000, color: "#8B5CF6" },
];

const DonationPage = ({ darkMode }) => {
  const [donations] = useState(mockDonations);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const completedDonations = donations.filter(d => d.status === "completed");
  const pendingDonations = donations.filter(d => d.status === "pending");
  const alumniDonations = donations.filter(d => d.alumni);

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || donation.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold transition-colors ${
          darkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          Donations Management
        </h1>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StateCard
          title="Total Donations"
          value={formatCurrency(totalDonations)}
          icon={<Heart className="h-6 w-6" />}
          color="green"
          trend={{ positive: true, value: "+15% from last month" }}
          darkMode={darkMode}
        />
        <StateCard
          title="Completed"
          value={completedDonations.length}
          icon={<DollarSign className="h-6 w-6" />}
          color="blue"
          trend={{ positive: true, value: `${formatCurrency(completedDonations.reduce((sum, d) => sum + d.amount, 0))}` }}
          darkMode={darkMode}
        />
        <StateCard
          title="Pending"
          value={pendingDonations.length}
          icon={<TrendingUp className="h-6 w-6" />}
          color="orange"
          trend={{ positive: false, value: `${formatCurrency(pendingDonations.reduce((sum, d) => sum + d.amount, 0))}` }}
        />
        <StateCard
          title="Alumni Donors"
          value={alumniDonations.length}
          icon={<Heart className="h-6 w-6" />}
          color="purple"
          trend={{ positive: true, value: `${((alumniDonations.length / donations.length) * 100).toFixed(0)}% of total` }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Donations Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Monthly Donations</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value), "Amount"]} />
              <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Donations by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-1 gap-2">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{category.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(category.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by donor name or purpose..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="flex space-x-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Donations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDonations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        {donation.donorName}
                        {donation.alumni && (
                          <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            Alumni
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(donation.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(donation.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{donation.purpose}</div>
                    <div className="text-sm text-gray-500 capitalize">{donation.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {donation.method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(donation.status)}`}>
                      {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredDonations.length === 0 && (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No donations found</h3>
          <p className="text-gray-500">
            No donations match your current search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default DonationPage;
