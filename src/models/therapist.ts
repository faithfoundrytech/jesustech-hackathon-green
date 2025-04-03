import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
  start: { type: String, required: true },
  end: { type: String, required: true }
});

const availabilitySchema = new mongoose.Schema({
  days: [{ type: String, required: true }],
  timeSlots: [timeSlotSchema]
});

const therapistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  maritalStatus: { type: String, required: true },
  gender: { type: String, required: true },
  specialty: { type: String, required: true },
  experience: { type: String, required: true },
  education: { type: String, required: true },
  languages: [{ type: String, required: true }],
  bio: { type: String, required: true },
  availability: { type: availabilitySchema, required: true },
  rating: { type: Number, default: 0 },
  avatar: { type: String, default: '/placeholder.svg?height=40&width=40' },
  embedding: { type: [Number] }
}, {
  timestamps: true
});

export default mongoose.models.Therapist || mongoose.model('Therapist', therapistSchema); 