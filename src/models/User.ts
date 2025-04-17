import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const userSchema = {
  name: { type: 'string', required: true },
  email: { type: 'string', required: true, unique: true },
  password: { type: 'string' },
  image: { type: 'string' },
  createdAt: { type: 'date', default: () => new Date() },
  updatedAt: { type: 'date', default: () => new Date() }
}; 