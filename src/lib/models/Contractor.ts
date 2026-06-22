import mongoose, { Schema, Document, model } from 'mongoose';

export interface IContractor extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  isBlacklisted: boolean;
  scorecardId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ContractorSchema = new Schema<IContractor>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String },
    isBlacklisted: { type: Boolean, default: false },
    scorecardId: { type: Schema.Types.ObjectId, ref: 'Scorecard' },
  },
  { timestamps: true }
);

export default mongoose.models.Contractor || model<IContractor>('Contractor', ContractorSchema);
