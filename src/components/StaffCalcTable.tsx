import React, { useState, useEffect } from 'react';
import { ArrowUpDown, ChevronDown, ChevronUp, Users, Calculator, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStaff } from '../context/StaffContext';

interface StaffCalc {
  STaffType_ID: number;
  Title: string;
  RatioStaffPatient: string;
  Census: number | null;
  Scheduled_Staff: number | null;
}

const defaultRatios: { [key: string]: string } = {
  CNA: '1:3',
  LPN: '1:2',
  RN: '1:1',
  UC: '1:50',
  MA: '1:4'
};

type SortKey = keyof StaffCalc;

const getTitleColor = (title: string) => {
  const colors = {
    RN: "bg-blue-100 text-blue-800",
    LPN: "bg-green-100 text-green-800",
    CNA: "bg-purple-100 text-purple-800",
    UC: "bg-orange-100 text-orange-800",
    MA: "bg-yellow-100 text-yellow-800"
  };
  return colors[title as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

export default function StaffCalcTable() {
  const { staffTypes } = useStaff();
  const [data, setData] = useState<StaffCalc[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<StaffCalc>>({});
  const [error, setError] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: 'asc' | 'desc' | null;
  }>({ key: 'STaffType_ID', direction: null });

  useEffect(() => {
    // Update StaffCalc table when staffTypes changes
    const updatedData = staffTypes.map(type => ({
      STaffType_ID: type.StaffType_ID,
      Title: type.Title_Code,
      RatioStaffPatient: defaultRatios[type.Title_Code] || '1:4',
      Census: null,
      Scheduled_Staff: null
    }));
    setData(updatedData);
  }, [staffTypes]);

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
      const updatedData = staffTypes.map(type => ({
        STaffType_ID: type.StaffType_ID,
        Title: type.Title_Code,
        RatioStaffPatient: defaultRatios[type.Title_Code] || '1:4',
        Census: null,
        Scheduled_Staff: null
      }));
      setData(updatedData);
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

  const handleCensusChange = (id: number, value: string) => {
    const numValue = value === '' ? null : parseInt(value, 10);
    setData(data.map(item => {
      if (item.STaffType_ID === id) {
        const ratio = parseInt(item.RatioStaffPatient.split(':')[1], 10);
        const calculatedStaff = numValue ? Math.ceil(numValue / ratio) : null;
        return {
          ...item,
          Census: numValue,
          Scheduled_Staff: calculatedStaff
        };
      }
      return item;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEntry.Title || !newEntry.RatioStaffPatient) {
      setError("Title and Ratio are required");
      return;
    }

    if (!newEntry.RatioStaffPatient.match(/^\d+:\d+$/)) {
      setError("Ratio must be in format 'number:number'");
      return;
    }

    if (data.some(item => item.Title.toLowerCase() === newEntry.Title?.toLowerCase())) {
      setError("This staff type already exists");
      return;
    }

    const newId = Math.max(...data.map(item => item.STaffType_ID)) + 1;
    const entryToAdd: StaffCalc = {
      STaffType_ID: newId,
      Title: newEntry.Title,
      RatioStaffPatient: newEntry.RatioStaffPatient,
      Census: null,
      Scheduled_Staff: null
    };

    setData([...data, entryToAdd]);
    setNewEntry({});
    setShowForm(false);
    setError('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                {Object.keys(data[0] || {}).map((key) => (
                  <th
                    key={key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort(key as SortKey)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      {getSortIcon(key as SortKey)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <motion.tr
                  key={item.STaffType_ID}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.STaffType_ID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTitleColor(item.Title)}`}>
                      {item.Title}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-indigo-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {item.RatioStaffPatient}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      value={item.Census === null ? '' : item.Census}
                      onChange={(e) => handleCensusChange(item.STaffType_ID, e.target.value)}
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Enter"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Calculator className="h-5 w-5 text-indigo-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {item.Scheduled_Staff === null ? '-' : item.Scheduled_Staff}
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