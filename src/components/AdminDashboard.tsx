import React, { useState, useEffect } from 'react';
import type {
  User,
  Product,
  Order,
  PaymentTransaction,
  Task,
  TaskSubmission,
  Course,
  SupportTicket,
  AuditLog,
  SiteContent
} from '../types/index.js';
import { formatNaira, formatDate, formatDateTime } from '../lib/utils.js';
import { apiRequest } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { StatCard } from './ui/StatCard.js';
import { StatusBadge } from './ui/StatusBadge.js';
import { Button } from './ui/Button.js';
import { Input } from './ui/Input.js';
import { Textarea } from './ui/Textarea.js';
import { Select } from './ui/Select.js';
import { Modal } from './ui/Modal.js';
import { EmptyState } from './ui/EmptyState.js';
import { PageHeader } from './ui/PageHeader.js';
import {
  ShieldCheck,
  Users,
  Package,
  ShoppingBag,
  CreditCard,
  CheckSquare,
  FileCheck,
  GraduationCap,
  LifeBuoy,
  FileText,
  Settings,
  Plus,
  RefreshCw,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface AdminDashboardProps {
  currentSubroute: string;
  navigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentSubroute, navigate }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState<boolean>(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);

  // Modals state
  const [newProductModal, setNewProductModal] = useState(false);
  const [newTaskModal, setNewTaskModal] = useState(false);
  const [reviewModalSubmission, setReviewModalSubmission] = useState<TaskSubmission | null>(null);
  const [reviewStatus, setReviewStatus] = useState<TaskSubmission['status']>('APPROVED');
  const [reviewFeedback, setReviewFeedback] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [
        metRes,
        usrRes,
        prdRes,
        ordRes,
        payRes,
        tskRes,
        subRes,
        crsRes,
        tktRes,
        audRes,
        cntRes,
      ] = await Promise.all([
        apiRequest<{ metrics: any }>('/api/admin/metrics'),
        apiRequest<{ users: User[] }>('/api/admin/users'),
        apiRequest<{ products: Product[] }>('/api/products?status=all'),
        apiRequest<{ orders: Order[] }>('/api/orders'),
        apiRequest<{ payments: PaymentTransaction[] }>('/api/payments'),
        apiRequest<{ tasks: Task[] }>('/api/tasks'),
        apiRequest<{ submissions: TaskSubmission[] }>('/api/submissions'),
        apiRequest<{ courses: Course[] }>('/api/courses'),
        apiRequest<{ tickets: SupportTicket[] }>('/api/support/tickets'),
        apiRequest<{ auditLogs: AuditLog[] }>('/api/admin/audit-logs'),
        apiRequest<{ content: SiteContent[] }>('/api/site-content'),
      ]);

      setMetrics(metRes.metrics);
      setUsersList(usrRes.users);
      setProducts(prdRes.products);
      setOrders(ordRes.orders);
      setPayments(payRes.payments);
      setTasks(tskRes.tasks);
      setSubmissions(subRes.submissions);
      setCourses(crsRes.courses);
      setTickets(tktRes.tickets);
      setAuditLogs(audRes.auditLogs);
      setSiteContent(cntRes.content);
    } catch (err: any) {
      toast.error('Failed to load admin telemetry: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // --- Sub-View: Overview ---
  const renderOverview = () => (
    <div className="space-y-8">
      <PageHeader
        title="Administrative Control Centre"
        description="Authoritative platform oversight: commercial asset allocations, Paystack settlement ledgers, and operational task verification."
        actions={
          <Button variant="outline" size="sm" onClick={loadAdminData}>
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Sync Metrics
          </Button>
        }
      />

      {/* 60-30-10 Disciplined Metrics Grid with tabular figures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Registered Users"
          value={metrics?.totalUsers || usersList.length}
          subtext="Institutional accounts"
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          label="Settled Payments"
          value={formatNaira(metrics?.verifiedPayments || 0)}
          subtext="Authoritative Paystack ledger"
          icon={<CreditCard className="w-5 h-5" />}
        />
        <StatCard
          label="Pending Evidence Reviews"
          value={metrics?.tasksAwaitingReview || 0}
          subtext="Field logs requiring sign-off"
          icon={<FileCheck className="w-5 h-5 text-amber-600" />}
        />
        <StatCard
          label="Open Support Tickets"
          value={metrics?.openTickets || 0}
          subtext="Awaiting response"
          icon={<LifeBuoy className="w-5 h-5" />}
        />
      </div>

      {/* Two-Column Oversight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders Queue */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#DCE8DF] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCE8DF]">
            <h3 className="font-bold text-sm text-[#17231C]">Recent Commercial Orders</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/orders')}>
              View All Orders ({orders.length})
            </Button>
          </div>

          <div className="divide-y divide-[#DCE8DF] text-xs">
            {orders.slice(0, 4).map((ord) => (
              <div key={ord.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-[#17231C]">{ord.items[0]?.name}</div>
                  <div className="text-neutral-500 mt-0.5">
                    Order #{ord.orderNumber} · Customer: {ord.userName}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-[#17231C] tabular-nums mb-1">
                    {formatNaira(ord.totalAmount)}
                  </div>
                  <StatusBadge status={ord.status} type="order" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#DCE8DF] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCE8DF]">
            <h3 className="font-bold text-sm text-[#17231C]">Audited Directorate Actions</h3>
            <span className="text-xs text-neutral-400 font-mono">Immutable</span>
          </div>

          <div className="space-y-3 text-xs">
            {auditLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-[#F8FAF9] border border-[#DCE8DF] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#176B3A]">{log.action}</span>
                  <span className="text-[10px] text-neutral-400">{formatDate(log.timestamp)}</span>
                </div>
                <p className="text-neutral-600 line-clamp-2">{log.details}</p>
                <div className="text-[10px] text-neutral-400 font-mono">Actor: {log.actorEmail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // --- Sub-View: Users ---
  const renderUsers = () => {
    const handleRoleChange = async (userId: string, newRole: 'USER' | 'ADMIN') => {
      try {
        await apiRequest(`/api/admin/users/${userId}/role`, {
          method: 'PATCH',
          body: JSON.stringify({ role: newRole }),
        });
        toast.success(`User role updated to ${newRole}`);
        loadAdminData();
      } catch (err: any) {
        toast.error(err.message || 'Role change failed');
      }
    };

    return (
      <div className="space-y-6">
        <PageHeader
          title="User & Directorate Directory"
          description="Manage institutional account roles, corporate verification, and platform access tiers."
        />

        <div className="bg-white rounded-2xl border border-[#DCE8DF] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAF9] text-neutral-600 font-semibold uppercase tracking-wider border-b border-[#DCE8DF]">
                <tr>
                  <th className="p-4">Name & Email</th>
                  <th className="p-4">Company / Entity</th>
                  <th className="p-4">State</th>
                  <th className="p-4">Registered</th>
                  <th className="p-4">Role Tier</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE8DF]">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-50">
                    <td className="p-4">
                      <div className="font-bold text-[#17231C]">{u.name}</div>
                      <div className="text-neutral-500">{u.email}</div>
                    </td>
                    <td className="p-4 text-neutral-600">{u.company || '—'}</td>
                    <td className="p-4 text-neutral-600">{u.state || 'Lagos State'}</td>
                    <td className="p-4 text-neutral-500">{formatDate(u.createdAt)}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          u.role === 'ADMIN'
                            ? 'bg-[#176B3A] text-white'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleRoleChange(u.id, u.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                        className="text-xs font-semibold text-[#176B3A] hover:underline"
                      >
                        Set as {u.role === 'ADMIN' ? 'USER' : 'ADMIN'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // --- Sub-View: Products Management ---
  const renderProducts = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState<Product['category']>('property');
    const [price, setPrice] = useState<number>(25000000);
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleCreateProduct = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      try {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        await apiRequest('/api/products', {
          method: 'POST',
          body: JSON.stringify({
            slug,
            name,
            category,
            price: Number(price),
            location,
            description,
            availability: 'AVAILABLE',
            featured: true,
            status: 'PUBLISHED',
            imageUrl: '/src/assets/images/product_agri_land_1792745952212.jpg',
            detailedSpecs: {
              'Title Status': 'Governor’s Consent & Cadastral Mapping',
              'Access': 'Highway Corridor',
            },
          }),
        });

        toast.success('New commercial asset published to catalog.');
        setNewProductModal(false);
        loadAdminData();
      } catch (err: any) {
        toast.error(err.message || 'Creation failed');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="space-y-6">
        <PageHeader
          title="Manage Commercial Assets"
          description="Catalogue commercial real estate, haulage fleets, and enterprise infrastructure with verified pricing."
          actions={
            <Button variant="primary" size="sm" onClick={() => setNewProductModal(true)}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Commercial Asset
            </Button>
          }
        />

        <div className="bg-white rounded-2xl border border-[#DCE8DF] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAF9] text-neutral-600 font-semibold uppercase tracking-wider border-b border-[#DCE8DF]">
                <tr>
                  <th className="p-4">Asset Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Valuation (NGN)</th>
                  <th className="p-4">Availability</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE8DF]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50">
                    <td className="p-4 font-bold text-[#17231C]">{p.name}</td>
                    <td className="p-4 capitalize text-neutral-600">{p.category}</td>
                    <td className="p-4 text-neutral-600">{p.location || 'National'}</td>
                    <td className="p-4 font-bold text-[#17231C] tabular-nums">{formatNaira(p.price)}</td>
                    <td className="p-4">
                      <StatusBadge status={p.availability} type="availability" />
                    </td>
                    <td className="p-4 text-right">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: New Product */}
        <Modal
          isOpen={newProductModal}
          onClose={() => setNewProductModal(false)}
          title="Add New Commercial Asset"
          maxWidth="lg"
        >
          <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
            <Input
              label="Asset Name"
              required
              placeholder="e.g., Epe Commercial Enterprise Park (20 Hectares)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Asset Category"
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                options={[
                  { label: 'Commercial Real Estate & Land (property)', value: 'property' },
                  { label: 'Logistics & Transport Fleet (vehicle)', value: 'vehicle' },
                  { label: 'Enterprise Infrastructure & Facilities', value: 'infrastructure' },
                  { label: 'Business & Incubation Programme', value: 'programme' },
                ]}
              />
              <Input
                label="Valuation Price in NGN"
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>

            <Input
              label="Location / Operating Corridor"
              required
              placeholder="e.g., Epe Agribusiness Corridor, Lagos State"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <Textarea
              label="Forensic Asset Description"
              required
              rows={4}
              placeholder="Detail title documents, soil characteristics, perimeter coordinates, and road access..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-[#DCE8DF]">
              <Button variant="outline" size="sm" onClick={() => setNewProductModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" loading={submitting}>
                Publish Asset
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    );
  };

  // --- Sub-View: Orders Management ---
  const renderOrders = () => {
    const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
      try {
        await apiRequest(`/api/orders/${orderId}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status: newStatus }),
        });
        toast.success(`Order updated to ${newStatus}`);
        loadAdminData();
      } catch (err: any) {
        toast.error(err.message || 'Status update failed');
      }
    };

    return (
      <div className="space-y-6">
        <PageHeader
          title="Commercial Order Processing"
          description="Inspect buyer allocations, verify Paystack references, and transition order fulfillment states."
        />

        <div className="bg-white rounded-2xl border border-[#DCE8DF] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAF9] text-neutral-600 font-semibold uppercase tracking-wider border-b border-[#DCE8DF]">
                <tr>
                  <th className="p-4">Order #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Item</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4 text-right">Transition State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE8DF]">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-neutral-50">
                    <td className="p-4 font-mono font-bold text-[#17231C]">{ord.orderNumber}</td>
                    <td className="p-4">
                      <div className="font-semibold text-[#17231C]">{ord.userName}</div>
                      <div className="text-neutral-500">{ord.userEmail}</div>
                    </td>
                    <td className="p-4 font-medium text-neutral-800">{ord.items[0]?.name}</td>
                    <td className="p-4 font-bold text-[#17231C] tabular-nums">{formatNaira(ord.totalAmount)}</td>
                    <td className="p-4">
                      <StatusBadge status={ord.status} type="order" />
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value as any)}
                        className="py-1 px-2.5 text-xs bg-white border border-[#DCE8DF] rounded-lg text-neutral-700"
                      >
                        <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
                        <option value="PAID">PAID</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // --- Sub-View: Submissions Review ---
  const renderSubmissions = () => {
    const handleSaveReview = async () => {
      if (!reviewModalSubmission) return;
      if (!reviewFeedback.trim()) {
        toast.error('Reviewer feedback comments are required.');
        return;
      }

      try {
        await apiRequest(`/api/submissions/${reviewModalSubmission.id}/review`, {
          method: 'POST',
          body: JSON.stringify({
            status: reviewStatus,
            feedback: reviewFeedback,
          }),
        });

        toast.success(`Task evidence marked as ${reviewStatus}. User notified.`);
        setReviewModalSubmission(null);
        setReviewFeedback('');
        loadAdminData();
      } catch (err: any) {
        toast.error(err.message || 'Review submission failed');
      }
    };

    return (
      <div className="space-y-6">
        <PageHeader
          title="Review Operational Field Submissions"
          description="Inspect cadastral surveys, GPS waypoints, fleet roadworthiness certificates, and provide operational sign-offs."
        />

        {submissions.length === 0 ? (
          <EmptyState
            icon={<FileCheck className="w-6 h-6" />}
            title="No Evidence Submissions in Queue"
            description="Field task submissions will appear here for administrative inspection."
          />
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => (
              <div key={sub.id} className="bg-white rounded-2xl border border-[#DCE8DF] p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#DCE8DF]">
                  <div>
                    <h4 className="font-bold text-base text-[#17231C]">{sub.taskTitle}</h4>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      Submitted by: <strong className="text-[#17231C]">{sub.userName}</strong> ({sub.userEmail}) · {formatDateTime(sub.createdAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={sub.status} type="task" />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setReviewModalSubmission(sub);
                        setReviewStatus(sub.status === 'SUBMITTED' ? 'APPROVED' : sub.status);
                        setReviewFeedback(sub.reviewerFeedback || '');
                      }}
                    >
                      Audit & Provide Feedback
                    </Button>
                  </div>
                </div>

                {sub.contentText && (
                  <div className="p-4 rounded-xl bg-[#F8FAF9] border border-[#DCE8DF] text-xs">
                    <div className="font-bold text-[#176B3A] uppercase tracking-wider mb-1">
                      Submitted Observations:
                    </div>
                    <p className="text-neutral-700 leading-relaxed whitespace-pre-line">{sub.contentText}</p>
                  </div>
                )}

                {sub.evidenceUrl && (
                  <div className="text-xs text-neutral-600 flex items-center gap-2">
                    <span className="font-bold">Evidence Link:</span>
                    <a
                      href={sub.evidenceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#176B3A] underline flex items-center gap-1 font-medium"
                    >
                      <span>{sub.evidenceUrl}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {sub.reviewerFeedback && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    <div className="font-bold">Current Directorate Feedback ({sub.reviewedBy || 'Admin'}):</div>
                    <p className="mt-0.5">{sub.reviewerFeedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal: Review Evidence */}
        {reviewModalSubmission && (
          <Modal
            isOpen={Boolean(reviewModalSubmission)}
            onClose={() => setReviewModalSubmission(null)}
            title="Operational Evidence Audit & Decision"
            maxWidth="lg"
          >
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#DCE8DF]">
                <div className="font-bold text-[#17231C]">{reviewModalSubmission.taskTitle}</div>
                <div className="text-neutral-500 mt-0.5">Submitter: {reviewModalSubmission.userName}</div>
              </div>

              <Select
                label="Review Decision State"
                value={reviewStatus}
                onChange={(e: any) => setReviewStatus(e.target.value)}
                options={[
                  { label: 'APPROVED (Evidence verified & compliant)', value: 'APPROVED' },
                  { label: 'UNDER_REVIEW (Additional analysis needed)', value: 'UNDER_REVIEW' },
                  { label: 'RESUBMISSION_REQUIRED (Deficient data or missing coordinates)', value: 'RESUBMISSION_REQUIRED' },
                  { label: 'REJECTED (Non-compliant evidence)', value: 'REJECTED' },
                ]}
              />

              <Textarea
                label="Directorate Audit Notes & Feedback"
                required
                rows={4}
                placeholder="Detail technical remarks, surveyor observations, or specific reasons for approval/resubmission..."
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-[#DCE8DF]">
                <Button variant="outline" size="sm" onClick={() => setReviewModalSubmission(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" onClick={handleSaveReview}>
                  Commit Official Review
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  };

  // --- Sub-View: Support Queue ---
  const renderSupportQueue = () => {
    const handleUpdateTicket = async (ticketId: string, status: SupportTicket['status']) => {
      try {
        await apiRequest(`/api/support/tickets/${ticketId}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        });
        toast.success(`Ticket status set to ${status}`);
        loadAdminData();
      } catch (err: any) {
        toast.error(err.message || 'Status update failed');
      }
    };

    return (
      <div className="space-y-6">
        <PageHeader
          title="Support Dispatch & Resolution Queue"
          description="Review member inquiries, assign legal/survey officers, and respond to title requests."
        />

        <div className="space-y-4">
          {tickets.map((tkt) => (
            <div key={tkt.id} className="bg-white rounded-2xl border border-[#DCE8DF] p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#DCE8DF]">
                <div>
                  <span className="text-xs font-semibold text-[#176B3A] uppercase tracking-wider">
                    Ticket #{tkt.ticketNumber} · {tkt.category}
                  </span>
                  <h4 className="font-bold text-base text-[#17231C] mt-1">{tkt.subject}</h4>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    Requester: <strong className="text-[#17231C]">{tkt.userName}</strong> ({tkt.userEmail})
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={tkt.status} type="ticket" />
                  <select
                    value={tkt.status}
                    onChange={(e) => handleUpdateTicket(tkt.id, e.target.value as any)}
                    className="py-1 px-2.5 text-xs bg-white border border-[#DCE8DF] rounded-lg text-neutral-700"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>

              {/* Messages count */}
              <div className="text-xs text-neutral-600 flex items-center justify-between">
                <span>{tkt.messages.length} Correspondence entries</span>
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/support/${tkt.id}`)}
                  className="font-bold text-[#176B3A] hover:underline"
                >
                  View & Reply to Thread
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- Sub-View: Platform Settings ---
  const renderSettings = () => (
    <div className="max-w-3xl space-y-8">
      <PageHeader
        title="Platform & Environment Settings"
        description="Verify security, Paystack API credentials, and database persistence status."
      />

      <div className="bg-white rounded-2xl border border-[#DCE8DF] p-6 sm:p-8 shadow-xs space-y-6 text-xs">
        <h3 className="font-bold text-base text-[#17231C]">Payment Gateway & Webhook Inspection</h3>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#F8FAF9] border border-[#DCE8DF] space-y-2">
            <div className="font-bold text-neutral-800">Paystack Operational Mode:</div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-semibold text-emerald-800">
                Authoritative Test Sandbox & Webhook Simulator Active
              </span>
            </div>
            <p className="text-neutral-500 leading-relaxed text-[11px]">
              Transactions calculate exact NGN amounts on the server. If `PAYSTACK_SECRET_KEY` is provided in environment variables, requests dispatch to live Paystack API (`https://api.paystack.co`).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAF9] border border-[#DCE8DF] space-y-2">
            <div className="font-bold text-neutral-800">Data Persistence Layer:</div>
            <p className="text-neutral-600 text-[11px] leading-relaxed">
              Storage Engine: <strong className="text-[#17231C]">Unified Dual-Mode Engine (Mongoose Atlas + Local JSON Mirror)</strong>.
              All orders, payments, submissions, and tickets persist across restarts.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#DCE8DF] flex items-center justify-between">
          <span className="text-neutral-500">WealthFarm Version: 1.0.0-MVP (Target Budget: ₦400,000)</span>
          <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard')}>
            Exit to Member View
          </Button>
        </div>
      </div>
    </div>
  );

  let content = renderOverview();
  if (currentSubroute === '/admin/users') content = renderUsers();
  else if (currentSubroute === '/admin/products') content = renderProducts();
  else if (currentSubroute === '/admin/orders') content = renderOrders();
  else if (currentSubroute === '/admin/submissions') content = renderSubmissions();
  else if (currentSubroute === '/admin/support') content = renderSupportQueue();
  else if (currentSubroute === '/admin/settings') content = renderSettings();

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto w-full">
      {content}
    </div>
  );
};
