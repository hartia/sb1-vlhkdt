import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList } from 'lucide-react';
import TeamTable from '../components/TeamTable';
import StatusTable from '../components/StatusTable';
import StaffTypeTable from '../components/StaffTypeTable';
import ShiftTable from '../components/ShiftTable';
import StaffCalcTable from '../components/StaffCalcTable';
import PersonalTimeTable from '../components/PersonalTimeTable';

export default function Administration() {
  return (
    <div id="administration" className="min-h-screen bg-gray-100 pt-16">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <ClipboardList className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Team Members</h2>
            <TeamTable />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Status Overview</h2>
            <StatusTable />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Staff Types</h2>
            <StaffTypeTable />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Staff Calculator</h2>
            <StaffCalcTable />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shift Schedule</h2>
            <ShiftTable />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Time</h2>
            <PersonalTimeTable />
          </motion.section>
        </div>
      </div>
    </div>
  );
}