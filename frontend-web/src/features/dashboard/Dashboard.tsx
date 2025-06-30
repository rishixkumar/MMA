import React from 'react';
import Navbar from '../../components/Navbar';
import MedicationForm from './MedicationForm';
import MedicationList from './MedicationList';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-blue/10 via-white to-medical-teal/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto p-6">
        {/* Medication Management Panel */}
        <div className="lg:col-span-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-400">
            My Medications
          </h2>
          <MedicationForm />
          <MedicationList />
        </div>

        {/* Adherence Visualization */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">
            Weekly Adherence
          </h2>
          {/* Placeholder for Chart.js */}
          <div className="bg-gray-200 dark:bg-gray-600 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">Chart Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
}
