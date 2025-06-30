import { medicationAPI, Medication } from './api';

// Re-export the Medication interface
export type { Medication };

// Re-export medication functions with cleaner names
export const getMedications = medicationAPI.getAll;
export const createMedication = medicationAPI.create;
export const updateMedication = medicationAPI.update;
export const deleteMedication = medicationAPI.delete;
