import mongoose, { Schema, Document, Types } from 'mongoose';
import { generateShortId } from '@/lib/idGenerator';

export interface IProject extends Document {
  projectId: string;
  title: string;
  lga: string;
  sector: 'Road' | 'Housing' | 'Bridge' | 'Public Building';
  contractorId: Types.ObjectId | string | any;
  status: 'On Track' | 'Delayed' | 'At Risk' | 'Completed';
  coordinates: [number, number]; // [lat, lng]
  budgetAllocated: number;
  progressPercentage: number;
  startDate: Date;
  estimatedCompletion: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema({
  projectId: { 
    type: String, 
    unique: true, 
    default: () => generateShortId('BO-PRJ') 
  },
  title: { type: String, required: true },
  lga: { type: String, required: true },
  sector: { type: String, enum: ['Road', 'Housing', 'Bridge', 'Public Building'], required: true },
  contractorId: { type: Schema.Types.ObjectId, ref: 'Contractor', required: true },
  status: { type: String, enum: ['On Track', 'Delayed', 'At Risk', 'Completed'], default: 'On Track' },
  coordinates: { type: [Number], required: true }, // [lat, lng]
  budgetAllocated: { type: Number, required: true },
  progressPercentage: { type: Number, default: 0 },
  startDate: { type: Date, required: true },
  estimatedCompletion: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
