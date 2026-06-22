import mongoose, { Schema, Document, Types } from 'mongoose';
import { generateShortId } from '@/lib/idGenerator';

export interface ISiteVisit extends Document {
  visitId: string;
  projectId: Types.ObjectId | string;
  engineerName: string;
  reportNotes: string;
  qualityRating: number; // 0-100
  coordinates: [number, number]; // GPS location of the user when taking the photo
  photoUrls: string[]; // URLs from S3/Cloudinary
  status: 'Pending Review' | 'Approved' | 'Rejected';
  createdAt: Date;
  updatedAt: Date;
}

const SiteVisitSchema: Schema = new Schema({
  visitId: { 
    type: String, 
    unique: true, 
    default: () => generateShortId('BO-VIS') 
  },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  engineerName: { type: String, required: true },
  reportNotes: { type: String, required: true },
  qualityRating: { type: Number, required: true, min: 0, max: 100 },
  coordinates: { type: [Number], required: true }, // [lat, lng]
  photoUrls: { type: [String], default: [] },
  status: { type: String, enum: ['Pending Review', 'Approved', 'Rejected'], default: 'Pending Review' },
}, { timestamps: true });

export default mongoose.models.SiteVisit || mongoose.model<ISiteVisit>('SiteVisit', SiteVisitSchema);
