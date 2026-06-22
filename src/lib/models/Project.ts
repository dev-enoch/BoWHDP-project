import mongoose, { Schema, Document, model } from 'mongoose';

export interface IProject extends Document {
  name: string;
  lga: string;
  sector: string;
  contractSum: number;
  status: 'Green' | 'Amber' | 'Red';
  progress: number;
  contractorId?: mongoose.Types.ObjectId;
  location: {
    type: string;
    coordinates: number[]; // [longitude, latitude]
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    lga: { type: String, required: true },
    sector: { type: String, required: true },
    contractSum: { type: Number, required: true },
    status: { type: String, enum: ['Green', 'Amber', 'Red'], default: 'Green' },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    contractorId: { type: Schema.Types.ObjectId, ref: 'Contractor' },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
  },
  { timestamps: true }
);

// Index for geospatial queries
ProjectSchema.index({ location: '2dsphere' });

export default mongoose.models.Project || model<IProject>('Project', ProjectSchema);
