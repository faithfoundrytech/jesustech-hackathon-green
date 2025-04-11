import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
  start: { type: String, required: true },
  end: { type: String, required: true }
});

const availabilitySchema = new mongoose.Schema({
  days: [{ type: String, required: true }],
  timeSlots: [timeSlotSchema]
});

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  phone: { type: String },
  occupation: { type: String },
  church: { type: String },
  maritalStatus: { type: String },
  marriageDuration: { type: String },
  concerns: { type: String, required: true },
  email: { type: String, unique: true },
  preferredDays: { type: availabilitySchema, required: true },
  embedding: { type: [Number] }
}, {
  timestamps: true
});

export default mongoose.models.Patient || mongoose.model('Patient', patientSchema); 