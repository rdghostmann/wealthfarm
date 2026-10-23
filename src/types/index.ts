/**
 * WEALTHFARM Shared Data Types
 * Enterprise Agribusiness & Commercial Asset Platform
 */

export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  company?: string;
  state?: string;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

export type ProductCategory = 'property' | 'vehicle' | 'infrastructure' | 'programme';
export type ProductAvailability = 'AVAILABLE' | 'RESERVED' | 'SOLD_OUT';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  detailedSpecs?: Record<string, string>;
  location?: string;
  price: number; // in NGN
  availability: ProductAvailability;
  featured: boolean;
  status: 'PUBLISHED' | 'DRAFT';
  imageUrl: string;
  galleryImages?: string[];
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

export interface OrderItem {
  productId: string;
  name: string;
  category: ProductCategory;
  price: number; // in NGN
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number; // authoritative server-calculated NGN
  status: OrderStatus;
  paymentRef?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface PaymentTransaction {
  id: string;
  reference: string;
  orderId?: string;
  courseId?: string;
  userId: string;
  userEmail: string;
  amount: number; // in NGN
  currency: 'NGN';
  channel: string;
  status: PaymentStatus;
  gateway: 'PAYSTACK';
  paidAt?: string;
  createdAt: string;
}

export type TaskStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED';
export type SubmissionType = 'FILE' | 'URL' | 'TEXT' | 'ALL';

export interface Task {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  instructions: string;
  requirements: string[];
  submissionType: SubmissionType;
  deadline: string;
  status: TaskStatus;
  priority: 'NORMAL' | 'HIGH' | 'CRITICAL';
  createdAt: string;
  submissionsCount?: number;
}

export type SubmissionStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'RESUBMISSION_REQUIRED';

export interface TaskSubmission {
  id: string;
  taskId: string;
  taskTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  submissionType: SubmissionType;
  contentText?: string;
  evidenceUrl?: string;
  fileName?: string;
  fileSize?: string;
  status: SubmissionStatus;
  reviewerFeedback?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  order: number;
  videoUrl?: string; // YouTube or direct MP4 educational stream
  isPreviewFree?: boolean;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  instructorName: string;
  instructorTitle: string;
  coverImage: string;
  price: number; // NGN (0 for free foundation)
  status: 'PUBLISHED' | 'DRAFT';
  lessonsCount: number;
  totalDurationHours: number;
  lessons: Lesson[];
  createdAt: string;
}

export interface CourseEnrollment {
  id: string;
  courseId: string;
  userId: string;
  enrolledAt: string;
  completedLessonIds: string[];
  progressPercent: number;
  status: 'ACTIVE' | 'COMPLETED';
}

export type TicketCategory = 'BILLING' | 'ASSET' | 'TASK' | 'ACCOUNT' | 'TECHNICAL';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface SupportMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assignedStaff?: string;
  messages: SupportMessage[];
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ORDER' | 'TASK';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actorId: string;
  actorEmail: string;
  actorRole: UserRole;
  entity: string;
  entityId: string;
  details: string;
  timestamp: string;
}

export interface SiteContent {
  key: string;
  headline: string;
  noticeText: string;
  updatedAt: string;
}
