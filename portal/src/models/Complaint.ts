import mongoose, { Schema, Document, Types } from 'mongoose';
import { generateShortId } from '@/lib/idGenerator';

export interface IComplaint extends Document {
  complaintId: string;
  projectId: Types.ObjectId | string;
  citizenPhone: string;
  message: string;
  source: 'WhatsApp' | 'USSD' | 'Web';
  status: 'Open' | 'Investigating' | 'Resolved';
  assignedTo: string;
  slaDeadline: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema: Schema = new Schema({
  complaintId: { 
    type: String, 
    unique: true, 
    default: () => generateShortId('BO-CPL') 
  },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: false },
  citizenPhone: { type: String, required: true },
  message: { type: String, required: true },
  source: { type: String, enum: ['WhatsApp', 'USSD', 'Web'], required: true },
  status: { type: String, enum: ['Open', 'Investigating', 'Resolved'], default: 'Open' },
  assignedTo: { type: String, default: 'Unassigned' },
  slaDeadline: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.models.Complaint || mongoose.model<IComplaint>('Complaint', ComplaintSchema);
