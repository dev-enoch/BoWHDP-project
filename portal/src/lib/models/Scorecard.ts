import mongoose, { Schema, Document, model } from 'mongoose';

export interface IScorecard extends Document {
  contractorId: mongoose.Types.ObjectId;
  timeliness: number; // 0-100 (35% weight)
  quality: number; // 0-100 (35% weight)
  responsiveness: number; // 0-100 (15% weight)
  complaints: number; // 0-100 (15% weight)
  compositeScore: number;
  lastCalculatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ScorecardSchema = new Schema<IScorecard>(
  {
    contractorId: { type: Schema.Types.ObjectId, ref: 'Contractor', required: true },
    timeliness: { type: Number, default: 100, min: 0, max: 100 },
    quality: { type: Number, default: 100, min: 0, max: 100 },
    responsiveness: { type: Number, default: 100, min: 0, max: 100 },
    complaints: { type: Number, default: 100, min: 0, max: 100 },
    compositeScore: { type: Number, default: 100 },
    lastCalculatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Pre-save hook to calculate composite score
ScorecardSchema.pre('save', function (next) {
  this.compositeScore =
    this.timeliness * 0.35 +
    this.quality * 0.35 +
    this.responsiveness * 0.15 +
    this.complaints * 0.15;
  this.lastCalculatedAt = new Date();
  next();
});

export default mongoose.models.Scorecard || model<IScorecard>('Scorecard', ScorecardSchema);
