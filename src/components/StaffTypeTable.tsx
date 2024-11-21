import React, { useState } from 'react';
import { ArrowUpDown, ChevronDown, ChevronUp, Briefcase, Plus, X, Pencil, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStaff } from '../context/StaffContext';

interface StaffType {
  StaffType_ID: number;
  Title: string;
  Title_Code: string;
}

type SortKey = keyof StaffType;

export default function StaffTypeTable() {
  const { staffTypes, addStaffType } = useStaff();
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<StaffType>>({});
  const [error, setError] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: 'asc' | 'desc' | null;
  }>({ key: 'StaffType_ID', direction: null });
  const [data, setData] = useState<StaffType[]>(staffTypes);

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
      setData(staffTypes);
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

  const handleEdit = (staffType: StaffType) => {
    setNewEntry(staffType);
    setEditingId(staffType.StaffType_ID);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this staff type?')) {
      setData(data.filter(item => item.StaffType_ID !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEntry.Title || !newEntry.Title_Code) {
      setError("Title and Code are required");
      return;
    }

    const isDuplicate = data.some(item => 
      item.StaffType_ID !== editingId && (
        item.Title_Code.toLowerCase() === newEntry.Title_Code?.toLowerCase() ||
        item.Title.toLowerCase() === newEntry.Title?.toLowerCase()
      )
    );

    if (isDuplicate) {
      setError("This staff type or code already exists");
      return;
    }

    if (editingId) {
      const updatedData = data.map(item => 
        item.StaffType_ID === editingId 
          ? { ...item, Title: newEntry.Title!, Title_Code: newEntry.Title_Code!.toUpperCase() }
          : item
      );
      setData(updatedData);
      // Update context
      updatedData.forEach(item => {
        if (item.StaffType_ID === editingId) {
          addStaffType(item);
        }
      });
    } else {
      const newId = Math.max(...data.map(item => item.StaffType_ID)) + 1;
      const staffTypeToAdd: StaffType = {
        StaffType_ID: newId,
        Title: newEntry.Title,
        Title_Code: newEntry.Title_Code.toUpperCase()
      };
      setData([...data, staffTypeToAdd]);
      addStaffType(staffTypeToAdd);
    }

    setNewEntry({});
    setShowForm(false);
    setError('');
    setEditingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setNewEntry({});
            setError('');
          }}
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
              Add Staff Type
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingId ? 'Edit Staff Type' : 'Add New Staff Type'}
              </h3>
              
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md mb-4">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Registered Nurse"
                    value={newEntry.Title || ''}
                    onChange={(e) => setNewEntry({ ...newEntry, Title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Title Code</label>
                  <input
                    type="text"
                    placeholder="e.g., RN"
                    value={newEntry.Title_Code || ''}
                    onChange={(e) => setNewEntry({ ...newEntry, Title_Code: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Short code for the title (2-4 characters)
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setNewEntry({});
                    setError('');
                    setEditingId(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingId ? 'Update Staff Type' : 'Add Staff Type'}
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
                {Object.keys(staffTypes[0]).map((key) => (
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((staffType) => (
                <motion.tr
                  key={staffType.StaffType_ID}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {staffType.StaffType_ID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-5 w-5 text-indigo-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {staffType.Title}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {staffType.Title_Code}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleEdit(staffType)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(staffType.StaffType_ID)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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