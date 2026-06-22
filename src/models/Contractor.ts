import mongoose, { Schema, Document } from 'mongoose';
import { generateShortId } from '@/lib/idGenerator';

export interface IContractor extends Document {
  contractorId: string;
  name: string;
  email: string;
  phone: string;
  overallScore: number;
  status: 'Active' | 'Warning' | 'Blacklisted';
  projectsCompleted: number;
  activeProjects: number;
  createdAt: Date;
  updatedAt: Date;
}

const ContractorSchema: Schema = new Schema({
  contractorId: { 
    type: String, 
    unique: true, 
    default: () => generateShortId('BO-CON') 
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  overallScore: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Warning', 'Blacklisted'], default: 'Active' },
  projectsCompleted: { type: Number, default: 0 },
  activeProjects: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Contractor || mongoose.model<IContractor>('Contractor', ContractorSchema);
