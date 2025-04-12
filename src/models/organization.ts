import mongoose, { Document, Model } from 'mongoose';

// Define the interface for the Organization document
export interface IOrganization extends Document {
  organizationName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  role: string;
}

// Define Organization model schema
const OrganizationSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    required: [true, 'Organization name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  phone: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: 'organization',
  },
});

// Create or get the Organization model
const Organization: Model<IOrganization> = 
  mongoose.models.Organization || 
  mongoose.model<IOrganization>('Organization', OrganizationSchema);

export default Organization; 