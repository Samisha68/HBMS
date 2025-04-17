import { ObjectId } from 'mongodb';

export interface Bed {
  _id?: ObjectId;
  bedNumber: string;
  bedType: 'ICU' | 'General Ward' | 'Special Care';
  status: 'Available' | 'Occupied' | 'Under Maintenance';
  patient?: {
    name?: string;
    age?: number;
    contact?: string;
    medicalReason?: string;
  };
  lastUpdated?: Date;
}

export const bedSchema = {
  bedNumber: { type: 'string', required: true },
  bedType: { 
    type: 'string', 
    enum: ['ICU', 'General Ward', 'Special Care'],
    required: true 
  },
  status: { 
    type: 'string', 
    enum: ['Available', 'Occupied', 'Under Maintenance'],
    default: 'Available'
  },
  patient: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      age: { type: 'number' },
      contact: { type: 'string' },
      medicalReason: { type: 'string' }
    }
  },
  lastUpdated: { type: 'date', default: () => new Date() }
}; 