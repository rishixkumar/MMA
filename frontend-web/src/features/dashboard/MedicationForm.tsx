import React, { useState } from 'react';
import { createMedication, Medication } from '../../services/medicationService';

const MedicationForm = () => {
  const [medication, setMedication] = useState({
    name: '',
    dosage: '',
    frequency: 'Once daily',
    instructions: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const createdMed = await createMedication(medication);
      console.log('Medication created:', createdMed);
      // Reset form
      setMedication({
        name: '',
        dosage: '',
        frequency: 'Once daily',
        instructions: ''
      });
    } catch (error) {
      console.error('Failed to create medication:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Medication Name
        </label>
        <input
          type="text"
          value={medication.name}
          onChange={(e) => setMedication({...medication, name: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Dosage
          </label>
          <input
            type="text"
            value={medication.dosage}
            onChange={(e) => setMedication({...medication, dosage: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Frequency
          </label>
          <select
            value={medication.frequency}
            onChange={(e) => setMedication({...medication, frequency: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option>Once daily</option>
            <option>Twice daily</option>
            <option>Three times daily</option>
            <option>As needed</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Special Instructions
        </label>
        <textarea
          value={medication.instructions}
          onChange={(e) => setMedication({...medication, instructions: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isLoading ? 'Adding...' : 'Add Medication'}
      </button>
    </form>
  );
};

export default MedicationForm;
