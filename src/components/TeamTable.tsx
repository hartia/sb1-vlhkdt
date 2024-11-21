import React, { useState } from 'react';
import { ArrowUpDown, ChevronDown, ChevronUp, CheckCircle2, UserCircle2, XCircle, Phone, Circle, Plus, X, DollarSign, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TeamMember {
  Rowid: number;
  UserID: string;
  Team_Member: string;
  Email: string;
  Phone: string;
  Title: string;
  Status: string;
  IsActive: number;
  HourlyPay: number | null;
}

const initialData: TeamMember[] = [
  { Rowid: 1, UserID: 'GQO9252', Team_Member: 'Beagle, Billy', Email: 'Beagle.Billy@example.com', Phone: '(555) 123-4567', Title: 'CNA', Status: 'FT', IsActive: 1, HourlyPay: 18.50 },
  { Rowid: 2, UserID: 'ZIE5928', Team_Member: 'Carson, Ann', Email: 'Carson.Ann@example.com', Phone: '(555) 234-5678', Title: 'UC', Status: 'PT', IsActive: 1, HourlyPay: 16.75 },
  { Rowid: 3, UserID: 'GMP6183', Team_Member: 'Carson, David', Email: 'Carson.David@example.com', Phone: '(555) 345-6789', Title: 'RN', Status: 'FT', IsActive: 1, HourlyPay: 35.00 },
  { Rowid: 4, UserID: 'QVT9636', Team_Member: 'Carson, Fred', Email: 'Carson.Fred@example.com', Phone: '(555) 456-7890', Title: 'RN', Status: 'PRN', IsActive: 1, HourlyPay: 42.00 },
  { Rowid: 5, UserID: 'UEG5441', Team_Member: 'Carson, Jane', Email: 'Carson.Jane@example.com', Phone: '(555) 567-8901', Title: 'LPN', Status: 'AGENCY', IsActive: 1, HourlyPay: 28.50 },
  { Rowid: 6, UserID: 'CTI8974', Team_Member: 'Carson, Jessica', Email: 'Carson.Jessica@example.com', Phone: '(555) 678-9012', Title: 'UC', Status: 'PT', IsActive: 1, HourlyPay: 16.75 },
  { Rowid: 7, UserID: 'DUA8552', Team_Member: 'Carson, Jim', Email: 'Carson.Jim@example.com', Phone: '(555) 789-0123', Title: 'LPN', Status: 'FT', IsActive: 1, HourlyPay: 25.50 },
  { Rowid: 8, UserID: 'XUL2451', Team_Member: 'Carson, John', Email: 'Carson.John@example.com', Phone: '(555) 890-1234', Title: 'RN', Status: 'PRN', IsActive: 1, HourlyPay: 42.00 },
  { Rowid: 9, UserID: 'HYP4783', Team_Member: 'Carson, Lisa', Email: 'Carson.Lisa@example.com', Phone: '(555) 901-2345', Title: 'UC', Status: 'AGENCY', IsActive: 1, HourlyPay: 19.25 },
  { Rowid: 10, UserID: 'FER4167', Team_Member: 'Carson, Lou', Email: 'Carson.Lou@example.com', Phone: '(555) 012-3456', Title: 'LPN', Status: 'FT', IsActive: 1, HourlyPay: 25.50 }
];

type SortKey = keyof TeamMember;

const getStatusColor = (status: string) => {
  const colors = {
    FT: "text-emerald-600",
    PT: "text-sky-600",
    PRN: "text-violet-600",
    AGENCY: "text-amber-600"
  };
  return colors[status as keyof typeof colors] || "text-gray-600";
};

const getTitleColor = (title: string) => {
  const colors = {
    RN: "bg-blue-100 text-blue-800",
    LPN: "bg-green-100 text-green-800",
    CNA: "bg-purple-100 text-purple-800",
    UC: "bg-orange-100 text-orange-800"
  };
  return colors[title as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

export default function TeamTable() {
  const [data, setData] = useState<TeamMember[]>(initialData);
  const [showForm, setShowForm] = useState(false);
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    IsActive: 1
  });
  const [error, setError] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: 'asc' | 'desc' | null;
  }>({ key: 'Rowid', direction: null });

  const filteredData = data.filter(member => {
    if (activeFilter === 'active') return member.IsActive === 1;
    if (activeFilter === 'inactive') return member.IsActive === 0;
    return true;
  });

  const handleSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }

    setSortConfig({ key, direction });

    if (direction === null) {
      setData(initialData);
      return;
    }

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setData(sortedData);
  };

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="h-4 w-4" />;
    if (sortConfig.direction === 'asc') return <ChevronUp className="h-4 w-4" />;
    if (sortConfig.direction === 'desc') return <ChevronDown className="h-4 w-4" />;
    return <ArrowUpDown className="h-4 w-4" />;
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^\(\d{3}\) \d{3}-\d{4}$/.test(phone);
  };

  const toggleActive = (rowId: number) => {
    setData(data.map(member => 
      member.Rowid === rowId 
        ? { ...member, IsActive: member.IsActive === 1 ? 0 : 1 }
        : member
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMember.Team_Member || !newMember.Email || !newMember.Phone || !newMember.Title || !newMember.Status || !newMember.HourlyPay) {
      setError("All fields are required");
      return;
    }

    if (!validateEmail(newMember.Email)) {
      setError("Invalid email format");
      return;
    }

    if (!validatePhone(newMember.Phone)) {
      setError("Phone format should be (XXX) XXX-XXXX");
      return;
    }

    if (isNaN(Number(newMember.HourlyPay)) || Number(newMember.HourlyPay) <= 0) {
      setError("Hourly pay must be a positive number");
      return;
    }

    const userId = Math.random().toString(36).substring(2, 9).toUpperCase();
    const newId = Math.max(...data.map(m => m.Rowid)) + 1;

    const memberToAdd: TeamMember = {
      Rowid: newId,
      UserID: userId,
      Team_Member: newMember.Team_Member,
      Email: newMember.Email,
      Phone: newMember.Phone,
      Title: newMember.Title,
      Status: newMember.Status,
      IsActive: 1,
      HourlyPay: Number(newMember.HourlyPay)
    };

    setData([...data, memberToAdd]);
    setNewMember({ IsActive: 1 });
    setShowForm(false);
    setError("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Members</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {showForm ? (
            <>
              <X className="h-5 w-5 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 mr-2" />
              Add Team Member
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Team Member</h3>
              
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    placeholder="Last, First"
                    value={newMember.Team_Member || ''}
                    onChange={(e) => setNewMember({ ...newMember, Team_Member: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={newMember.Email || ''}
                    onChange={(e) => setNewMember({ ...newMember, Email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    placeholder="(XXX) XXX-XXXX"
                    value={newMember.Phone || ''}
                    onChange={(e) => setNewMember({ ...newMember, Phone: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <select
                    value={newMember.Title || ''}
                    onChange={(e) => setNewMember({ ...newMember, Title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Select Title</option>
                    <option value="RN">RN</option>
                    <option value="LPN">LPN</option>
                    <option value="CNA">CNA</option>
                    <option value="UC">UC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={newMember.Status || ''}
                    onChange={(e) => setNewMember({ ...newMember, Status: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Select Status</option>
                    <option value="FT">Full Time</option>
                    <option value="PT">Part Time</option>
                    <option value="PRN">PRN</option>
                    <option value="AGENCY">Agency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Hourly Pay</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={newMember.HourlyPay || ''}
                      onChange={(e) => setNewMember({ ...newMember, HourlyPay: parseFloat(e.target.value) })}
                      className="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">/hr</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setNewMember({ IsActive: 1 });
                    setError("");
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add Member
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(initialData[0]).map((key) => (
                  <th
                    key={key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort(key as SortKey)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{key.replace(/_/g, ' ')}</span>
                      {getSortIcon(key as SortKey)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((member) => (
                <motion.tr
                  key={member.Rowid}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.Rowid}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.UserID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <UserCircle2 className="h-5 w-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {member.Team_Member}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.Email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{member.Phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTitleColor(member.Title)}`}>
                      {member.Title}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Circle className={`h-3 w-3 ${getStatusColor(member.Status)}`} fill="currentColor" />
                      <span className={`text-sm font-medium ${getStatusColor(member.Status)}`}>
                        {member.Status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleActive(member.Rowid)}
                      className="focus:outline-none transition-transform hover:scale-110"
                      title={member.IsActive ? "Click to deactivate" : "Click to activate"}
                    >
                      {member.IsActive ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {member.HourlyPay?.toFixed(2)}
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}