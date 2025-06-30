import React, { useEffect, useState } from 'react';
import { Medication, getMedications } from '../../services/medicationService';

const MedicationList = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const data = await getMedications();
        setMedications(data);
      } catch (error) {
        console.error('Failed to fetch medications:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMedications();
  }, []);

  if (isLoading) {
    return <div>Loading medications...</div>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-2">Your Medications</h3>
      {medications.length === 0 ? (
        <p className="text-gray-500">No medications added yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {medications.map(med => (
            <li key={med.id} className="py-3">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium">{med.name}</h4>
                  <p className="text-sm text-gray-500">{med.dosage} · {med.frequency}</p>
                </div>
                <button className="text-red-500 hover:text-red-700">Remove</button>
              </div>
              {med.instructions && (
                <p className="mt-1 text-sm text-gray-600">{med.instructions}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MedicationList;
