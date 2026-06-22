import mongoose, { Schema, Document, model } from 'mongoose';

export interface ISiteVisit extends Document {
  projectId: mongoose.Types.ObjectId;
  engineerId: string;
  timestamp: Date;
  location: {
    type: string;
    coordinates: number[]; // [longitude, latitude]
  };
  photoUrls: string[];
  milestoneReached: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteVisitSchema = new Schema<ISiteVisit>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    engineerId: { type: String, required: true },
    timestamp: { type: Date, required: true, default: Date.now },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    photoUrls: { type: [String], default: [] },
    milestoneReached: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    notes: { type: String },
  },
  { timestamps: true }
);

// Index for geospatial queries
SiteVisitSchema.index({ location: '2dsphere' });

export default mongoose.models.SiteVisit || model<ISiteVisit>('SiteVisit', SiteVisitSchema);
