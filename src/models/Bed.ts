import { Schema, model, models } from 'mongoose';

const BedSchema = new Schema({
  number: {
    type: String,
    required: [true, 'Bed number is required'],
    unique: true,
  },
  ward: {
    type: String,
    required: [true, 'Ward is required'],
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE'],
    default: 'AVAILABLE',
  },
  patient: {
    name: String,
    age: Number,
    contact: String,
    medicalReason: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Bed = models.Bed || model('Bed', BedSchema);
export default Bed; 