import React, { useState } from 'react';
import { ArrowUpDown, ChevronDown, ChevronUp, Clock, Timer, Sun, Moon, Plus, X, Pencil, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Shift {
  Shift_ID: number;
  Shift_Description: string;
  Shift_Symbol: string;
  Hours: number;
  Shift_Hours: string;
  Hours_Symbol: string;
}

const initialData: Shift[] = [
  { Shift_ID: 1, Shift_Description: "Day Shift", Shift_Symbol: "DS", Hours: 12, Shift_Hours: "1:00 PM - 1:00 AM", Hours_Symbol: "1p" },
  { Shift_ID: 2, Shift_Description: "Night Shift", Shift_Symbol: "NS", Hours: 12, Shift_Hours: "3:00 PM - 3:00 AM", Hours_Symbol: "3p" },
  { Shift_ID: 3, Shift_Description: "Morning Shift", Shift_Symbol: "MS", Hours: 8, Shift_Hours: "8:00 AM - 4:00 PM", Hours_Symbol: "8a" },
  { Shift_ID: 4, Shift_Description: "Weekend Day", Shift_Symbol: "WD", Hours: 12, Shift_Hours: "7:00 AM - 7:00 PM", Hours_Symbol: "7a" },
  { Shift_ID: 5, Shift_Description: "Weekend Night", Shift_Symbol: "WN", Hours: 12, Shift_Hours: "7:00 PM - 7:00 AM", Hours_Symbol: "7p" },
  { Shift_ID: 6, Shift_Description: "Day Shift", Shift_Symbol: "DS", Hours: 12, Shift_Hours: "9:00 AM - 9:00 PM", Hours_Symbol: "9a" }
];

type SortKey = keyof Shift;

export default function ShiftTable() {
  const [data, setData] = useState<Shift[]>(initialData);
  const [showForm, setShowForm] = useState(false);
  const [newShift, setNewShift] = useState<Partial<Shift>>({});
  const [error, setError] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: 'asc' | 'desc' | null;
  }>({ key: 'Shift_ID', direction: null });

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

  const getShiftTiming = (hours: number) => {
    return hours === 12 ? 'Full Shift' : 'Regular Shift';
  };

  const getShiftIcon = (description: string) => {
    return description.toLowerCase().includes('night') ? (
      <Moon className="h-4 w-4 text-indigo-600" />
    ) : (
      <Sun className="h-4 w-4 text-indigo-600" />
    );
  };

  const handleEdit = (shift: Shift) => {
    setNewShift(shift);
    setEditingId(shift.Shift_ID);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this shift?')) {
      setData(data.filter(shift => shift.Shift_ID !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newShift.Shift_Description || !newShift.Shift_Symbol || !newShift.Hours || !newShift.Shift_Hours || !newShift.Hours_Symbol) {
      setError("All fields are required");
      return;
    }

    const isDuplicate = data.some(shift => 
      shift.Shift_ID !== editingId && (
        shift.Shift_Symbol === newShift.Shift_Symbol ||
        (shift.Shift_Hours === newShift.Shift_Hours && shift.Hours_Symbol === newShift.Hours_Symbol)
      )
    );

    if (isDuplicate) {
      setError("A shift with these details already exists");
      return;
    }

    if (editingId) {
      setData(data.map(shift => 
        shift.Shift_ID === editingId 
          ? { ...shift, ...newShift as Shift }
          : shift
      ));
    } else {
      const newId = Math.max(...data.map(shift => shift.Shift_ID)) + 1;
      setData([...data, { ...newShift as Shift, Shift_ID: newId }]);
    }

    setNewShift({});
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
            setNewShift({});
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
              Add Shift
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
                {editingId ? 'Edit Shift' : 'Add New Shift'}
              </h3>
              
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md mb-4">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    value={newShift.Shift_Description || ''}
                    onChange={(e) => setNewShift({ ...newShift, Shift_Description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., Day Shift"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Symbol</label>
                  <input
                    type="text"
                    value={newShift.Shift_Symbol || ''}
                    onChange={(e) => setNewShift({ ...newShift, Shift_Symbol: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., DS"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Hours</label>
                  <input
                    type="number"
                    value={newShift.Hours || ''}
                    onChange={(e) => setNewShift({ ...newShift, Hours: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    min="1"
                    max="24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Shift Hours</label>
                  <input
                    type="text"
                    value={newShift.Shift_Hours || ''}
                    onChange={(e) => setNewShift({ ...newShift, Shift_Hours: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., 9:00 AM - 9:00 PM"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Hours Symbol</label>
                  <input
                    type="text"
                    value={newShift.Hours_Symbol || ''}
                    onChange={(e) => setNewShift({ ...newShift, Hours_Symbol: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., 9a"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setNewShift({});
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
                  {editingId ? 'Update Shift' : 'Add Shift'}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((shift) => (
                <motion.tr
                  key={shift.Shift_ID}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {shift.Shift_ID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-indigo-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {shift.Shift_Description}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {shift.Shift_Symbol}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Timer className="h-5 w-5 text-indigo-600" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {shift.Hours} hours
                        </span>
                        <span className="text-xs text-gray-500">
                          {getShiftTiming(shift.Hours)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getShiftIcon(shift.Shift_Description)}
                      <span className="text-sm text-gray-900">
                        {shift.Shift_Hours}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {shift.Hours_Symbol}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleEdit(shift)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(shift.Shift_ID)}
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