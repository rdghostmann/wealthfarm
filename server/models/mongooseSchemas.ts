/**
 * Production Mongoose Schemas for MongoDB Atlas
 * Use in Next.js App Router or Node/Express with MONGODB_URI
 */

export const MongooseModelDefinitions = `
import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. User Schema
export interface IUserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  company?: string;
  state?: string;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, trim: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER', index: true },
  company: { type: String, trim: true },
  state: { type: String, trim: true },
  status: { type: String, enum: ['ACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
}, { timestamps: true });

UserSchema.index({ email: 1, role: 1 });

// 2. Product Schema
export interface IProductDocument extends Document {
  slug: string;
  name: string;
  category: 'property' | 'vehicle' | 'infrastructure' | 'programme';
  description: string;
  detailedSpecs?: Record<string, string>;
  location?: string;
  price: number;
  availability: 'AVAILABLE' | 'RESERVED' | 'SOLD_OUT';
  featured: boolean;
  status: 'PUBLISHED' | 'DRAFT';
  imageUrl: string;
  galleryImages?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProductDocument>({
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, enum: ['property', 'vehicle', 'infrastructure', 'programme'], required: true, index: true },
  description: { type: String, required: true },
  detailedSpecs: { type: Map, of: String },
  location: { type: String },
  price: { type: Number, required: true, min: 0 },
  availability: { type: String, enum: ['AVAILABLE', 'RESERVED', 'SOLD_OUT'], default: 'AVAILABLE', index: true },
  featured: { type: Boolean, default: false, index: true },
  status: { type: String, enum: ['PUBLISHED', 'DRAFT'], default: 'PUBLISHED', index: true },
  imageUrl: { type: String, required: true },
  galleryImages: [{ type: String }],
}, { timestamps: true });

ProductSchema.index({ category: 1, status: 1, price: 1 });

// 3. Order Schema
export interface IOrderDocument extends Document {
  orderNumber: string;
  userId: Schema.Types.ObjectId;
  userName: string;
  userEmail: string;
  items: Array<{
    productId: Schema.Types.ObjectId;
    name: string;
    category: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  status: 'PENDING_PAYMENT' | 'PAID' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  paymentRef?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrderDocument>({
  orderNumber: { type: String, required: true, unique: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1, min: 1 },
  }],
  totalAmount: { type: Number, required: true, min: 0 },
  status: { 
    type: String, 
    enum: ['PENDING_PAYMENT', 'PAID', 'PROCESSING', 'COMPLETED', 'CANCELLED'], 
    default: 'PENDING_PAYMENT',
    index: true 
  },
  paymentRef: { type: String, index: true },
  notes: { type: String },
}, { timestamps: true });

OrderSchema.index({ userId: 1, status: 1, createdAt: -1 });

// 4. PaymentTransaction Schema
const PaymentTransactionSchema = new Schema({
  reference: { type: String, required: true, unique: true, index: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  userEmail: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'NGN' },
  channel: { type: String, default: 'card' },
  status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING', index: true },
  gateway: { type: String, default: 'PAYSTACK' },
  paidAt: { type: Date },
}, { timestamps: true });

// 5. Task & Submission Schemas
const TaskSchema = new Schema({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  instructions: { type: String, required: true },
  requirements: [{ type: String }],
  submissionType: { type: String, enum: ['FILE', 'URL', 'TEXT', 'ALL'], default: 'ALL' },
  deadline: { type: String, required: true },
  status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'CLOSED'], default: 'PUBLISHED', index: true },
  priority: { type: String, enum: ['NORMAL', 'HIGH', 'CRITICAL'], default: 'NORMAL' },
}, { timestamps: true });

const TaskSubmissionSchema = new Schema({
  taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true, index: true },
  taskTitle: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  submissionType: { type: String, required: true },
  contentText: { type: String },
  evidenceUrl: { type: String },
  fileName: { type: String },
  fileSize: { type: String },
  status: { 
    type: String, 
    enum: ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'RESUBMISSION_REQUIRED'], 
    default: 'SUBMITTED',
    index: true 
  },
  reviewerFeedback: { type: String },
  reviewedBy: { type: String },
  reviewedAt: { type: Date },
}, { timestamps: true });

TaskSubmissionSchema.index({ taskId: 1, userId: 1 });

// 6. Course, Lesson & Enrollment Schemas
const LessonSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  durationMinutes: { type: Number, default: 15 },
  order: { type: Number, required: true },
  videoUrl: { type: String },
  isPreviewFree: { type: Boolean, default: false },
});

const CourseSchema = new Schema({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  description: { type: String, required: true },
  instructorName: { type: String, required: true },
  instructorTitle: { type: String, required: true },
  coverImage: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['PUBLISHED', 'DRAFT'], default: 'PUBLISHED', index: true },
  lessonsCount: { type: Number, default: 0 },
  totalDurationHours: { type: Number, default: 1 },
  lessons: [LessonSchema],
}, { timestamps: true });

const CourseEnrollmentSchema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  enrolledAt: { type: Date, default: Date.now },
  completedLessonIds: [{ type: String }],
  progressPercent: { type: Number, default: 0 },
  status: { type: String, enum: ['ACTIVE', 'COMPLETED'], default: 'ACTIVE' },
}, { timestamps: true });

CourseEnrollmentSchema.index({ courseId: 1, userId: 1 }, { unique: true });

// 7. Support Ticket & Message Schemas
const SupportMessageSchema = new Schema({
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  senderRole: { type: String, enum: ['USER', 'ADMIN'], required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const SupportTicketSchema = new Schema({
  ticketNumber: { type: String, required: true, unique: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  subject: { type: String, required: true },
  category: { type: String, enum: ['BILLING', 'ASSET', 'TASK', 'ACCOUNT', 'TECHNICAL'], required: true, index: true },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' },
  status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], default: 'OPEN', index: true },
  assignedStaff: { type: String },
  messages: [SupportMessageSchema],
}, { timestamps: true });

// 8. Notification & Audit Log Schemas
const NotificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['INFO', 'SUCCESS', 'WARNING', 'ORDER', 'TASK'], default: 'INFO' },
  read: { type: Boolean, default: false, index: true },
  link: { type: String },
}, { timestamps: true });

const AuditLogSchema = new Schema({
  action: { type: String, required: true },
  actorId: { type: String, required: true },
  actorEmail: { type: String, required: true },
  actorRole: { type: String, required: true },
  entity: { type: String, required: true },
  entityId: { type: String, required: true },
  details: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
});
`;
