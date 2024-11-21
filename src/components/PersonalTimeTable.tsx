import React, { useState } from 'react';
import { ArrowUpDown, ChevronDown, ChevronUp, Calendar, Plus, X, Pencil, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PersonalTime {
  PT_ID: number;
  Notations: string;
  Symbol: string;
}

const initialData: PersonalTime[] = [
  { PT_ID: 1, Notations: "Absent", Symbol: "X" },
  { PT_ID: 4, Notations: "Busy", Symbol: "Busy" },
  { PT_ID: 5, Notations: "Education", Symbol: "Edu" },
  { PT_ID: 6, Notations: "Low Census", Symbol: "Low" },
  { PT_ID: 7, Notations: "Misc", Symbol: "Misc" },
  { PT_ID: 8, Notations: "Notations", Symbol: "Symbol" },
  { PT_ID: 9, Notations: "Orientation", Symbol: "Orient" },
  { PT_ID: 10, Notations: "Request Off", Symbol: "R" },
  { PT_ID: 11, Notations: "Sick", Symbol: "Sick" }
];

type SortKey = keyof PersonalTime;

const getNotationColor = (notation: string) => {
  const colors: { [key: string]: string } = {
    Absent: "bg-red-100 text-red-800",
    Busy: "bg-yellow-100 text-yellow-800",
    Education: "bg-blue-100 text-blue-800",
    "Low Census": "bg-purple-100 text-purple-800",
    Misc: "bg-gray-100 text-gray-800",
    Orientation: "bg-green-100 text-green-800",
    "Request Off": "bg-orange-100 text-orange-800",
    Sick: "bg-pink-100 text-pink-800"
  };
  return colors[notation] || "bg-indigo-100 text-indigo-800";
};

export default function PersonalTimeTable() {
  const [data, setData] = useState<PersonalTime[]>(initialData);
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<PersonalTime>>({});
  const [error, setError] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: 'asc' | 'desc' | null;
  }>({ key: 'PT_ID', direction: null });

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

  const handleEdit = (item: PersonalTime) => {
    setNewEntry(item);
    setEditingId(item.PT_ID);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setData(data.filter(item => item.PT_ID !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEntry.Notations || !newEntry.Symbol) {
      setError("All fields are required");
      return;
    }

    const isDuplicate = data.some(item => 
      (item.Notations.toLowerCase() === newEntry.Notations?.toLowerCase() ||
      item.Symbol.toLowerCase() === newEntry.Symbol?.toLowerCase()) &&
      item.PT_ID !== editingId
    );

    if (isDuplicate) {
      setError("This notation or symbol already exists");
      return;
    }

    if (editingId) {
      setData(data.map(item => 
        item.PT_ID === editingId 
          ? { ...item, Notations: newEntry.Notations!, Symbol: newEntry.Symbol! }
          : item
      ));
    } else {
      const newId = Math.max(...data.map(item => item.PT_ID)) + 1;
      const entryToAdd: PersonalTime = {
        PT_ID: newId,
        Notations: newEntry.Notations,
        Symbol: newEntry.Symbol
      };
      setData([...data, entryToAdd]);
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
              Add Personal Time
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
                {editingId ? 'Edit Personal Time Entry' : 'Add New Personal Time Entry'}
              </h3>
              
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md mb-4">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notation</label>
                  <input
                    type="text"
                    placeholder="e.g., Vacation"
                    value={newEntry.Notations || ''}
                    onChange={(e) => setNewEntry({ ...newEntry, Notations: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Full description of the personal time type
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Symbol</label>
                  <input
                    type="text"
                    placeholder="e.g., VAC"
                    value={newEntry.Symbol || ''}
                    onChange={(e) => setNewEntry({ ...newEntry, Symbol: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Short code for the notation (1-4 characters)
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
                  {editingId ? 'Update Entry' : 'Add Entry'}
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
              {data.map((item) => (
                <motion.tr
                  key={item.PT_ID}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.PT_ID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-indigo-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {item.Notations}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getNotationColor(item.Notations)}`}>
                      {item.Symbol}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.PT_ID)}
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