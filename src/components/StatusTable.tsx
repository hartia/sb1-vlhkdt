import React, { useState } from 'react';
import { ArrowUpDown, ChevronDown, ChevronUp, Circle, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StatusRecord {
  Rowid: number;
  Status: string;
}

const initialData: StatusRecord[] = [
  { Rowid: 1, Status: "FT" },
  { Rowid: 2, Status: "PT" },
  { Rowid: 3, Status: "PRN" },
  { Rowid: 4, Status: "AGENCY" },
];

type SortKey = keyof StatusRecord;

const getStatusColor = (status: string) => {
  const colors = {
    FT: "text-emerald-600",    // Full-time: Strong, stable color
    PT: "text-sky-600",        // Part-time: Professional, flexible color
    PRN: "text-violet-600",    // PRN: Distinct, professional color
    AGENCY: "text-amber-600",  // Agency: Warm, engaging color
  };
  return colors[status as keyof typeof colors] || "text-gray-600";
};

const getStatusDescription = (status: string) => {
  const descriptions = {
    FT: "Full Time",
    PT: "Part Time",
    PRN: "As Needed",
    AGENCY: "Agency Staff",
  };
  return descriptions[status as keyof typeof descriptions] || status;
};

export default function StatusTable() {
  const [data, setData] = useState<StatusRecord[]>(initialData);
  const [showForm, setShowForm] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: 'asc' | 'desc' | null;
  }>({ key: 'Rowid', direction: null });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newStatus.trim()) {
      setError("Status is required");
      return;
    }

    if (data.some(item => item.Status.toLowerCase() === newStatus.trim().toLowerCase())) {
      setError("This status already exists");
      return;
    }

    const newId = Math.max(...data.map(item => item.Rowid)) + 1;
    const statusToAdd: StatusRecord = {
      Rowid: newId,
      Status: newStatus.trim().toUpperCase()
    };

    setData([...data, statusToAdd]);
    setNewStatus('');
    setShowForm(false);
    setError('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6 flex justify-end">
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
              Add Status
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
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Status</h3>
              
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status Code</label>
                  <input
                    type="text"
                    placeholder="Enter status code (e.g., FT, PT)"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Use short codes like FT (Full Time), PT (Part Time), etc.
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setNewStatus('');
                      setError('');
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add Status
                  </button>
                </div>
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
                      <span>{key}</span>
                      {getSortIcon(key as SortKey)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((record) => (
                <motion.tr
                  key={record.Rowid}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.Rowid}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <Circle className={`h-3 w-3 ${getStatusColor(record.Status)}`} fill="currentColor" />
                      <span className={`font-medium ${getStatusColor(record.Status)}`}>
                        {record.Status}
                      </span>
                      <span className="text-gray-500 text-xs">
                        ({getStatusDescription(record.Status)})
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