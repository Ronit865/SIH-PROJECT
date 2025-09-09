import React, { useState } from "react";
import { Search, Filter, Download, Plus, Eye, Edit, Trash2 } from "lucide-react";

const mockAlumni = [
  { id: 1, name: "Rahul Mehta", batch: "2020", department: "Engineering", profession: "Software Engineer", company: "TCS", location: "Mumbai", email: "rahul@example.com", phone: "+91-9876543210" },
  { id: 2, name: "Priya Patel", batch: "2019", department: "Business", profession: "Product Manager", company: "Infosys", location: "Bangalore", email: "priya@example.com", phone: "+91-9876543211" },
  { id: 3, name: "Amit Sharma", batch: "2021", department: "Engineering", profession: "Data Scientist", company: "Google", location: "Hyderabad", email: "amit@example.com", phone: "+91-9876543212" },
  { id: 4, name: "Sneha Singh", batch: "2018", department: "Medicine", profession: "Doctor", company: "Apollo Hospital", location: "Delhi", email: "sneha@example.com", phone: "+91-9876543213" },
  { id: 5, name: "Ravi Kumar", batch: "2020", department: "Business", profession: "Consultant", company: "Deloitte", location: "Pune", email: "ravi@example.com", phone: "+91-9876543214" },
  { id: 6, name: "Anita Roy", batch: "2019", department: "Arts", profession: "Designer", company: "Adobe", location: "Chennai", email: "anita@example.com", phone: "+91-9876543215" },
  { id: 7, name: "Vikram Joshi", batch: "2022", department: "Engineering", profession: "DevOps Engineer", company: "Amazon", location: "Mumbai", email: "vikram@example.com", phone: "+91-9876543216" },
  { id: 8, name: "Kavya Reddy", batch: "2021", department: "Medicine", profession: "Surgeon", company: "Fortis Hospital", location: "Bangalore", email: "kavya@example.com", phone: "+91-9876543217" },
];

const AlumniPage = ({ darkMode }) => {
  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique values for filters
  const batches = [...new Set(mockAlumni.map(a => a.batch))].sort();
  const departments = [...new Set(mockAlumni.map(a => a.department))].sort();
  const locations = [...new Set(mockAlumni.map(a => a.location))].sort();

  // Filter alumni
  const filteredAlumni = mockAlumni.filter((alumni) => {
    const matchesSearch = alumni.name.toLowerCase().includes(search.toLowerCase()) ||
                         alumni.company.toLowerCase().includes(search.toLowerCase()) ||
                         alumni.profession.toLowerCase().includes(search.toLowerCase());
    const matchesBatch = !batchFilter || alumni.batch === batchFilter;
    const matchesDepartment = !departmentFilter || alumni.department === departmentFilter;
    const matchesLocation = !locationFilter || alumni.location === locationFilter;
    
    return matchesSearch && matchesBatch && matchesDepartment && matchesLocation;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAlumni.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAlumni = filteredAlumni.slice(startIndex, startIndex + itemsPerPage);

  const resetFilters = () => {
    setSearch("");
    setBatchFilter("");
    setDepartmentFilter("");
    setLocationFilter("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold transition-colors ${
          darkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          Alumni Management
        </h1>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add Alumni</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name, company, or profession..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <select
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option value="">All Batches</option>
              {batches.map(batch => (
                <option key={batch} value={batch}>{batch}</option>
              ))}
            </select>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            <button
              onClick={resetFilters}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAlumni.length)} of {filteredAlumni.length} alumni
      </div>

      {/* Alumni Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profession</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedAlumni.map((alumni) => (
                <tr key={alumni.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{alumni.name}</div>
                      <div className="text-sm text-gray-500">{alumni.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{alumni.batch}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{alumni.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{alumni.profession}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{alumni.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{alumni.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniPage;
