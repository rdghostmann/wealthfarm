import React, { useState, useEffect } from 'react';
import type {
  Order,
  PaymentTransaction,
  Task,
  TaskSubmission,
  Course,
  CourseEnrollment,
  SupportTicket,
  Notification
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
import { EmptyState } from './ui/EmptyState.js';
import { PageHeader } from './ui/PageHeader.js';
import { PaystackCheckoutModal } from './ui/PaystackCheckoutModal.js';
import {
  ShoppingBag,
  CreditCard,
  CheckSquare,
  GraduationCap,
  LifeBuoy,
  Bell,
  User,
  ArrowRight,
  Upload,
  Calendar,
  MessageSquare,
  ShieldCheck,
  ExternalLink,
  Plus
} from 'lucide-react';

interface UserDashboardProps {
  currentSubroute: string;
  navigate: (path: string) => void;
  subrouteParams?: {
    taskId?: string;
    ticketId?: string;
    courseId?: string;
  };
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentSubroute,
  navigate,
  subrouteParams,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Selected item for payment
  const [payOrder, setPayOrder] = useState<Order | null>(null);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const [ordRes, payRes, tskRes, subRes, enrRes, crsRes, tktRes, ntfRes] = await Promise.all([
        apiRequest<{ orders: Order[] }>('/api/orders'),
        apiRequest<{ payments: PaymentTransaction[] }>('/api/payments'),
        apiRequest<{ tasks: Task[] }>('/api/tasks'),
        apiRequest<{ submissions: TaskSubmission[] }>('/api/submissions'),
        apiRequest<{ enrollments: CourseEnrollment[] }>('/api/enrollments'),
        apiRequest<{ courses: Course[] }>('/api/courses'),
        apiRequest<{ tickets: SupportTicket[] }>('/api/support/tickets'),
        apiRequest<{ notifications: Notification[] }>('/api/notifications'),
      ]);

      setOrders(ordRes.orders);
      setTransactions(payRes.payments);
      setTasks(tskRes.tasks);
      setSubmissions(subRes.submissions);
      setEnrollments(enrRes.enrollments);
      setCourses(crsRes.courses);
      setTickets(tktRes.tickets);
      setNotifications(ntfRes.notifications);
    } catch (err: any) {
      console.error('Failed to load user dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [user]);

  // --- Sub-View: Overview ---
  const renderOverview = () => {
    const totalOrderValue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const completedTasks = submissions.filter((s) => s.status === 'APPROVED').length;

    return (
      <div className="space-y-8">
        <PageHeader
          title={`Welcome back, ${user?.name}`}
          description="Your verified commercial asset allocations, field operational tasks, and executive masterclasses."
        />

        {/* Real Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            label="Active Orders"
            value={orders.length}
            subtext="Commercial asset orders"
            icon={<ShoppingBag className="w-5 h-5" />}
          />
          <StatCard
            label="Settled Payments"
            value={formatNaira(transactions.filter(t => t.status === 'SUCCESS').reduce((s, t) => s + t.amount, 0))}
            subtext="Verified Paystack transactions"
            icon={<CreditCard className="w-5 h-5" />}
          />
          <StatCard
            label="Operational Tasks"
            value={submissions.length}
            subtext={`${completedTasks} approved field logs`}
            icon={<CheckSquare className="w-5 h-5" />}
          />
          <StatCard
            label="Academy Enrolled"
            value={enrollments.length}
            subtext="Executive masterclasses"
            icon={<GraduationCap className="w-5 h-5" />}
          />
        </div>

        {/* Two-Column Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Recent Orders */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#DCE8DF] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE8DF]">
              <h3 className="font-bold text-sm text-[#17231C]">Recent Asset Orders</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/orders')}>
                View All
              </Button>
            </div>

            {orders.length === 0 ? (
              <EmptyState
                icon={<ShoppingBag className="w-5 h-5" />}
                title="No Orders Placed Yet"
                description="Browse approved commercial real estate, logistics trucks, and enterprise infrastructure in our marketplace."
                actionLabel="Inspect Marketplace"
                onAction={() => navigate('/products')}
              />
            ) : (
              <div className="divide-y divide-[#DCE8DF] text-xs">
                {orders.slice(0, 3).map((ord) => (
                  <div key={ord.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-[#17231C]">{ord.items[0]?.name || 'Commercial Asset'}</div>
                      <div className="text-neutral-500 mt-0.5">
                        Order #{ord.orderNumber} · {formatDate(ord.createdAt)}
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
            )}
          </div>

          {/* Quick Tasks & Learning Progress */}
          <div className="lg:col-span-5 space-y-6">
            {/* Field Tasks Strip */}
            <div className="bg-white rounded-2xl border border-[#DCE8DF] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#DCE8DF]">
                <h3 className="font-bold text-sm text-[#17231C]">Operational Tasks</h3>
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/tasks')}>
                  All Tasks
                </Button>
              </div>

              {tasks.length === 0 ? (
                <p className="text-xs text-neutral-500">No operational tasks currently assigned.</p>
              ) : (
                <div className="space-y-3">
                  {tasks.slice(0, 2).map((tsk) => (
                    <div key={tsk.id} className="p-3 rounded-xl bg-[#F8FAF9] border border-[#DCE8DF] text-xs space-y-1.5">
                      <div className="font-bold text-[#17231C] line-clamp-1">{tsk.title}</div>
                      <div className="text-neutral-500 flex items-center gap-2">
                        <span>Due: {formatDate(tsk.deadline)}</span>
                        <span>·</span>
                        <span className="text-[#176B3A] font-semibold">{tsk.category}</span>
                      </div>
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => navigate(`/dashboard/tasks/${tsk.id}/submit`)}
                          className="text-[#176B3A] font-semibold hover:underline flex items-center gap-1"
                        >
                          <span>Submit Field Evidence</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Support Desk Status */}
            <div className="bg-white rounded-2xl border border-[#DCE8DF] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#DCE8DF]">
                <h3 className="font-bold text-sm text-[#17231C]">Institutional Support</h3>
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/support')}>
                  Open Desk
                </Button>
              </div>
              <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
                Direct access to title surveyors, mechanical inspectors, and financial reconciliation officers.
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-center"
                onClick={() => navigate('/dashboard/support/new')}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Submit New Support Inquiry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- Sub-View: Orders ---
  const renderOrders = () => (
    <div className="space-y-6">
      <PageHeader
        title="My Asset Orders & Invoices"
        description="Authoritative purchase records for commercial real estate, haulage fleets, and enterprise infrastructure."
        actions={
          <Button variant="primary" size="sm" onClick={() => navigate('/products')}>
            Browse Catalog
          </Button>
        }
      />

      {orders.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="w-6 h-6" />}
          title="No Orders Found"
          description="You have not initiated any asset orders yet."
          actionLabel="Explore Marketplace"
          onAction={() => navigate('/products')}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-2xl border border-[#DCE8DF] p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#DCE8DF]">
                <div>
                  <div className="text-xs font-semibold text-[#176B3A] uppercase tracking-wider">
                    Purchase Order #{ord.orderNumber}
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    Placed on {formatDateTime(ord.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={ord.status} type="order" />
                  {ord.status === 'PENDING_PAYMENT' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setPayOrder(ord)}
                    >
                      <CreditCard className="w-3.5 h-3.5 mr-1" />
                      Pay via Paystack
                    </Button>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {ord.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-sm text-[#17231C]">{item.name}</div>
                      <div className="text-neutral-500 capitalize">{item.category} · Qty: {item.quantity}</div>
                    </div>
                    <div className="text-sm font-bold text-[#17231C] tabular-nums">
                      {formatNaira(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes & Summary */}
              <div className="pt-3 border-t border-[#DCE8DF] flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-neutral-500 gap-2">
                <div>
                  {ord.notes && <span>Delivery notes: {ord.notes}</span>}
                  {ord.paymentRef && <span className="ml-2 font-mono">Ref: {ord.paymentRef}</span>}
                </div>
                <div className="text-base font-bold text-[#176B3A] tabular-nums">
                  Total: {formatNaira(ord.totalAmount)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // --- Sub-View: Transactions (Paystack) ---
  const renderTransactions = () => (
    <div className="space-y-6">
      <PageHeader
        title="Paystack Transaction Ledger"
        description="Audited payment settlements, payment channel verification, and tamper-evident transaction references."
      />

      {transactions.length === 0 ? (
        <EmptyState
          icon={<CreditCard className="w-6 h-6" />}
          title="No Transactions Recorded"
          description="Completed or pending Paystack payments will appear here with instant verification logs."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-[#DCE8DF] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAF9] text-neutral-600 font-semibold uppercase tracking-wider border-b border-[#DCE8DF]">
                <tr>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Channel</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE8DF]">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-neutral-50">
                    <td className="p-4 font-mono font-semibold text-[#17231C]">{tx.reference}</td>
                    <td className="p-4 capitalize text-neutral-600">{tx.channel.replace(/_/g, ' ')}</td>
                    <td className="p-4 font-bold text-[#17231C] tabular-nums">{formatNaira(tx.amount)}</td>
                    <td className="p-4 text-neutral-500">{formatDateTime(tx.createdAt)}</td>
                    <td className="p-4">
                      <StatusBadge status={tx.status} type="payment" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  // --- Sub-View: Tasks & Evidence Submission ---
  const renderTasks = () => {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Field Operational Tasks & Evidence"
          description="Operational enterprise checklists: cadastral survey mapping, fleet roadworthiness audits, and equipment calibration."
        />

        {/* Published Tasks */}
        <div>
          <h3 className="text-base font-bold text-[#17231C] mb-4">Available Field Tasks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white rounded-2xl border border-[#DCE8DF] p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#176B3A]">{task.category}</span>
                    <StatusBadge status={task.status} type="task" />
                  </div>
                  <h4 className="font-bold text-sm text-[#17231C] mb-2">{task.title}</h4>
                  <p className="text-xs text-neutral-600 mb-4 leading-relaxed">{task.description}</p>

                  <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                    Requirements:
                  </div>
                  <ul className="text-xs text-neutral-600 pl-4 list-disc space-y-1 mb-4">
                    {task.requirements.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#DCE8DF] flex items-center justify-between text-xs">
                  <span className="text-neutral-500">Due: {formatDate(task.deadline)}</span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/dashboard/tasks/${task.id}/submit`)}
                  >
                    <Upload className="w-3.5 h-3.5 mr-1" />
                    Submit Evidence
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Submissions */}
        <div className="pt-4 border-t border-[#DCE8DF]">
          <h3 className="text-base font-bold text-[#17231C] mb-4">My Submitted Evidence Logs</h3>
          {submissions.length === 0 ? (
            <p className="text-xs text-neutral-500">You have not submitted evidence for any field tasks yet.</p>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub) => (
                <div key={sub.id} className="bg-white rounded-2xl border border-[#DCE8DF] p-6 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-[#DCE8DF]">
                    <div>
                      <h4 className="font-bold text-sm text-[#17231C]">{sub.taskTitle}</h4>
                      <div className="text-xs text-neutral-500 mt-0.5">
                        Submitted: {formatDateTime(sub.createdAt)}
                      </div>
                    </div>
                    <StatusBadge status={sub.status} type="task" />
                  </div>

                  {sub.contentText && (
                    <div className="text-xs text-neutral-700 bg-[#F8FAF9] p-3 rounded-xl border border-[#DCE8DF]">
                      <div className="font-semibold text-neutral-500 mb-1">Field Report Notes:</div>
                      {sub.contentText}
                    </div>
                  )}

                  {sub.evidenceUrl && (
                    <div className="text-xs text-neutral-600 flex items-center gap-1.5">
                      <span className="font-semibold">Evidence Link:</span>
                      <a href={sub.evidenceUrl} target="_blank" rel="noreferrer" className="text-[#176B3A] underline flex items-center gap-1">
                        <span>{sub.evidenceUrl}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {sub.reviewerFeedback && (
                    <div className="text-xs p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                      <div className="font-bold mb-1">
                        Agronomy Directorate Feedback ({sub.reviewedBy || 'Technical Reviewer'}):
                      </div>
                      <p>{sub.reviewerFeedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // --- Sub-View: Task Submit Form ---
  const renderTaskSubmit = () => {
    const targetTask = tasks.find((t) => t.id === subrouteParams?.taskId) || tasks[0];
    const [reportText, setReportText] = useState('');
    const [proofUrl, setProofUrl] = useState('');
    const [fileName, setFileName] = useState('Field_Survey_Audit_Report.pdf');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmitTask = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!targetTask) return;
      if (!reportText && !proofUrl) {
        toast.error('Please provide field notes or an evidence URL.');
        return;
      }
      setSubmitting(true);
      try {
        await apiRequest(`/api/tasks/${targetTask.id}/submit`, {
          method: 'POST',
          body: JSON.stringify({
            submissionType: 'ALL',
            contentText: reportText,
            evidenceUrl: proofUrl,
            fileName,
            fileSize: '3.1 MB',
          }),
        });
        toast.success('Field task evidence submitted successfully for Directorate review.');
        await loadUserData();
        navigate('/dashboard/tasks');
      } catch (err: any) {
        toast.error(err.message || 'Submission failed');
      } finally {
        setSubmitting(false);
      }
    };

    if (!targetTask) {
      return (
        <EmptyState
          title="Task Not Found"
          description="The requested task could not be located in the operational registry."
          actionLabel="Back to Tasks"
          onAction={() => navigate('/dashboard/tasks')}
        />
      );
    }

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <PageHeader
          title="Submit Field Task Evidence"
          description={`Task: ${targetTask.title}`}
          actions={
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/tasks')}>
              Back
            </Button>
          }
        />

        <div className="bg-white rounded-2xl border border-[#DCE8DF] p-6 sm:p-8 shadow-xs space-y-5">
          <div className="p-4 rounded-xl bg-[#EEF7F0] border border-[#DCE8DF] text-xs space-y-2">
            <div className="font-bold text-[#176B3A] uppercase tracking-wider">Instructions:</div>
            <p className="text-neutral-700 leading-relaxed">{targetTask.instructions}</p>
          </div>

          <form onSubmit={handleSubmitTask} className="space-y-4">
            <Textarea
              label="Field Observations & Methodology Report"
              required
              rows={5}
              placeholder="Detail your sampling methodology, GPS coordinates, equipment readings, or crop inspection remarks..."
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
            />

            <Input
              label="External Evidence URL (Cloud Drive / GPS Map / Laboratory Manifest)"
              placeholder="https://drive.google.com/..."
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              helperText="Provide a secure link to your geotagged field imagery or raw survey files."
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#17231C] mb-1.5">
                Attached Field Document
              </label>
              <div className="p-4 border border-dashed border-[#DCE8DF] rounded-xl bg-[#F8FAF9] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-neutral-700">
                  <Upload className="w-4 h-4 text-[#176B3A]" />
                  <span className="font-medium">{fileName}</span>
                  <span className="text-neutral-400">(Simulated 3.1 MB)</span>
                </div>
                <span className="text-[#176B3A] font-semibold">Attached</span>
              </div>
            </div>

            <Button variant="primary" size="lg" className="w-full" loading={submitting}>
              Submit Evidence for Administrative Review
            </Button>
          </form>
        </div>
      </div>
    );
  };

  // --- Sub-View: Learning ---
  const renderLearning = () => {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Executive Academy Enrolments"
          description="Access your executive masterclass syllabi, video lectures, and lesson progress records."
          actions={
            <Button variant="outline" size="sm" onClick={() => navigate('/learning')}>
              Course Catalog
            </Button>
          }
        />

        {enrollments.length === 0 ? (
          <EmptyState
            icon={<GraduationCap className="w-6 h-6" />}
            title="No Active Masterclasses"
            description="Enroll in certified commercial asset ownership, enterprise scaling, and wealth creation courses."
            actionLabel="Discover Courses"
            onAction={() => navigate('/learning')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrollments.map((enr) => {
              const course = courses.find((c) => c.id === enr.courseId);
              if (!course) return null;
              return (
                <div key={enr.id} className="bg-white rounded-2xl border border-[#DCE8DF] p-6 shadow-xs space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold text-[#176B3A] uppercase tracking-wider">
                        Executive Curriculum
                      </div>
                      <h4 className="font-bold text-base text-[#17231C] mt-1 line-clamp-1">{course.title}</h4>
                      <p className="text-xs text-neutral-500 mt-0.5">Instructor: {course.instructorName}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs text-neutral-600">
                      <span>Curriculum Progress</span>
                      <span className="font-bold text-[#176B3A] tabular-nums">{enr.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#176B3A] h-full transition-all duration-300"
                        style={{ width: `${enr.progressPercent}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      {enr.completedLessonIds.length} of {course.lessons.length} modules completed
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#DCE8DF]">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full justify-center"
                      onClick={() => navigate(`/learning/${course.id}`)}
                    >
                      <span>Resume Masterclass</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // --- Sub-View: Support Tickets ---
  const renderSupport = () => {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Institutional Resolution Desk"
          description="Lodge formal queries regarding deed documentation, asset orders, field audits, and Paystack receipts."
          actions={
            <Button variant="primary" size="sm" onClick={() => navigate('/dashboard/support/new')}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              New Support Ticket
            </Button>
          }
        />

        {tickets.length === 0 ? (
          <EmptyState
            icon={<LifeBuoy className="w-6 h-6" />}
            title="No Active Tickets"
            description="You have no open tickets. Need assistance with a title deed or order? Submit a request to the Directorate."
            actionLabel="Open Support Ticket"
            onAction={() => navigate('/dashboard/support/new')}
          />
        ) : (
          <div className="space-y-4">
            {tickets.map((tkt) => (
              <div
                key={tkt.id}
                onClick={() => navigate(`/dashboard/support/${tkt.id}`)}
                className="bg-white rounded-2xl border border-[#DCE8DF] p-6 shadow-xs hover:border-[#176B3A] transition-colors cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#DCE8DF]">
                  <div>
                    <span className="text-xs font-semibold text-[#176B3A] uppercase tracking-wider">
                      Ticket #{tkt.ticketNumber} · {tkt.category}
                    </span>
                    <h4 className="font-bold text-base text-[#17231C] mt-1">{tkt.subject}</h4>
                  </div>
                  <StatusBadge status={tkt.status} type="ticket" />
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-[#176B3A]" />
                    <span>{tkt.messages.length} Messages</span>
                    {tkt.assignedStaff && <span>· Staff: {tkt.assignedStaff}</span>}
                  </div>
                  <span>Last Updated: {formatDateTime(tkt.updatedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // --- Sub-View: New Support Ticket Form ---
  const renderNewTicket = () => {
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState<SupportTicket['category']>('ASSET');
    const [priority, setPriority] = useState<SupportTicket['priority']>('MEDIUM');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleCreateTicket = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!subject || !message) {
        toast.error('Subject and message are required.');
        return;
      }
      setSubmitting(true);
      try {
        const res = await apiRequest<{ ticket: SupportTicket }>('/api/support/tickets', {
          method: 'POST',
          body: JSON.stringify({ subject, category, priority, initialMessage: message }),
        });
        toast.success(`Support ticket ${res.ticket.ticketNumber} lodged successfully.`);
        await loadUserData();
        navigate(`/dashboard/support/${res.ticket.id}`);
      } catch (err: any) {
        toast.error(err.message || 'Ticket creation failed');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <PageHeader
          title="Lodge an Institutional Inquiry"
          description="A designated Agricultural Directorate officer will be assigned to resolve your request."
          actions={
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/support')}>
              Cancel
            </Button>
          }
        />

        <div className="bg-white rounded-2xl border border-[#DCE8DF] p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <Input
              label="Ticket Subject"
              required
              placeholder="e.g., Title deed delivery schedule for Epe Agribusiness cluster"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Inquiry Department / Category"
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                options={[
                  { label: 'Asset Title & Conveyance', value: 'ASSET' },
                  { label: 'Billing & Paystack Settlement', value: 'BILLING' },
                  { label: 'Operational Field Tasks', value: 'TASK' },
                  { label: 'Account & Directorate Verification', value: 'ACCOUNT' },
                  { label: 'Technical Platform Support', value: 'TECHNICAL' },
                ]}
              />
              <Select
                label="Priority Level"
                value={priority}
                onChange={(e: any) => setPriority(e.target.value)}
                options={[
                  { label: 'Normal (Standard SLA)', value: 'MEDIUM' },
                  { label: 'High Priority', value: 'HIGH' },
                  { label: 'Urgent Dispatch', value: 'URGENT' },
                  { label: 'Low', value: 'LOW' },
                ]}
              />
            </div>

            <Textarea
              label="Detailed Request Information"
              required
              rows={5}
              placeholder="Provide exact details, relevant order numbers, asset coordinates, or context..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <Button variant="primary" size="lg" className="w-full" loading={submitting}>
              Submit Ticket to Directorate
            </Button>
          </form>
        </div>
      </div>
    );
  };

  // --- Sub-View: Ticket Thread ---
  const renderTicketThread = () => {
    const ticket = tickets.find((t) => t.id === subrouteParams?.ticketId);
    const [reply, setReply] = useState('');
    const [sending, setSending] = useState(false);

    const handleSendReply = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!ticket || !reply.trim()) return;
      setSending(true);
      try {
        await apiRequest(`/api/support/tickets/${ticket.id}/messages`, {
          method: 'POST',
          body: JSON.stringify({ message: reply }),
        });
        setReply('');
        toast.success('Reply submitted.');
        await loadUserData();
      } catch (err: any) {
        toast.error(err.message || 'Failed to send reply');
      } finally {
        setSending(false);
      }
    };

    if (!ticket) {
      return (
        <EmptyState
          title="Ticket Not Found"
          description="The requested support ticket could not be found."
          actionLabel="Back to Support"
          onAction={() => navigate('/dashboard/support')}
        />
      );
    }

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <PageHeader
          title={`Ticket #${ticket.ticketNumber}`}
          description={ticket.subject}
          actions={
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/support')}>
              Back
            </Button>
          }
        />

        <div className="bg-white rounded-2xl border border-[#DCE8DF] p-6 shadow-xs flex items-center justify-between text-xs">
          <div>
            <span className="font-semibold text-neutral-500 uppercase">Category: </span>
            <span className="text-[#17231C] font-bold">{ticket.category}</span>
            <span className="mx-2">·</span>
            <span className="font-semibold text-neutral-500 uppercase">Staff Assigned: </span>
            <span className="text-[#17231C] font-bold">{ticket.assignedStaff || 'Queue Dispatch'}</span>
          </div>
          <StatusBadge status={ticket.status} type="ticket" />
        </div>

        {/* Message Thread */}
        <div className="space-y-4">
          {ticket.messages.map((m) => {
            const isMe = m.senderId === user?.id;
            return (
              <div
                key={m.id}
                className={`p-5 rounded-2xl border text-xs sm:text-sm space-y-1.5 ${
                  isMe
                    ? 'bg-[#EEF7F0] border-[#DCE8DF] ml-6'
                    : 'bg-white border-[#DCE8DF] mr-6'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span className="font-bold text-[#17231C]">
                    {m.senderName} ({m.senderRole === 'ADMIN' ? 'WealthFarm Directorate' : 'You'})
                  </span>
                  <span>{formatDateTime(m.createdAt)}</span>
                </div>
                <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">{m.message}</p>
              </div>
            );
          })}
        </div>

        {/* Reply Box */}
        {ticket.status !== 'CLOSED' && (
          <div className="bg-white rounded-2xl border border-[#DCE8DF] p-6 shadow-xs">
            <form onSubmit={handleSendReply} className="space-y-3">
              <Textarea
                label="Reply to Ticket"
                required
                rows={3}
                placeholder="Type your response..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
              <div className="flex justify-end">
                <Button variant="primary" size="sm" loading={sending}>
                  Send Reply
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  };

  // --- Sub-View: Notifications ---
  const renderNotifications = () => {
    const handleMarkRead = async (id: string) => {
      try {
        await apiRequest(`/api/notifications/${id}/read`, { method: 'PATCH' });
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      } catch (err) {
        console.error(err);
      }
    };

    return (
      <div className="space-y-6">
        <PageHeader
          title="Notification Center"
          description="Real-time alerts regarding order status updates, field task reviews, and masterclass enrollments."
        />

        {notifications.length === 0 ? (
          <EmptyState
            icon={<Bell className="w-6 h-6" />}
            title="No Notifications"
            description="You are fully up to date."
          />
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-5 rounded-2xl border text-xs flex items-start justify-between gap-4 transition-colors ${
                  n.read
                    ? 'bg-white border-[#DCE8DF]'
                    : 'bg-[#EEF7F0] border-[#176B3A]/30 shadow-xs'
                }`}
              >
                <div className="space-y-1">
                  <div className="font-bold text-[#17231C] text-sm">{n.title}</div>
                  <p className="text-neutral-600 leading-relaxed">{n.message}</p>
                  <div className="text-[11px] text-neutral-400 mt-1">
                    {formatDateTime(n.createdAt)}
                  </div>
                </div>

                {!n.read && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkRead(n.id)}
                  >
                    Mark Read
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // --- Sub-View: Profile ---
  const renderProfile = () => {
    return (
      <div className="max-w-3xl space-y-8">
        <PageHeader
          title="Member Profile & Governance"
          description="Manage institutional corporate information, contact details, and account security credentials."
        />

        <div className="bg-white rounded-2xl border border-[#DCE8DF] p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="font-bold text-base text-[#17231C]">Institutional Identity</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <span className="font-semibold text-neutral-500 uppercase tracking-wider">Full Legal Name</span>
              <div className="text-sm font-bold text-[#17231C] mt-1">{user?.name}</div>
            </div>
            <div>
              <span className="font-semibold text-neutral-500 uppercase tracking-wider">Corporate Email</span>
              <div className="text-sm font-bold text-[#17231C] mt-1">{user?.email}</div>
            </div>
            <div>
              <span className="font-semibold text-neutral-500 uppercase tracking-wider">Phone Number</span>
              <div className="text-sm font-bold text-[#17231C] mt-1">{user?.phone || 'Not provided'}</div>
            </div>
            <div>
              <span className="font-semibold text-neutral-500 uppercase tracking-wider">Registered Entity</span>
              <div className="text-sm font-bold text-[#17231C] mt-1">{user?.company || 'Individual Enterprise / Corporate Asset Owner'}</div>
            </div>
            <div>
              <span className="font-semibold text-neutral-500 uppercase tracking-wider">Primary State</span>
              <div className="text-sm font-bold text-[#17231C] mt-1">{user?.state || 'Lagos State'}</div>
            </div>
            <div>
              <span className="font-semibold text-neutral-500 uppercase tracking-wider">Platform Role</span>
              <div className="text-sm font-bold text-[#176B3A] mt-1">{user?.role}</div>
            </div>
          </div>
        </div>

        <div className="bg-[#17231C] text-white rounded-2xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Title Conveyance KYC Verification</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed max-w-xl">
            To register land titles or acquire commercial farmland tracts with Governor’s Consent, our legal team will request physical deed verification documents upon order placement.
          </p>
        </div>
      </div>
    );
  };

  // Subroute selector
  let content = renderOverview();
  if (currentSubroute === '/dashboard/orders') content = renderOrders();
  else if (currentSubroute === '/dashboard/transactions') content = renderTransactions();
  else if (currentSubroute === '/dashboard/tasks') content = renderTasks();
  else if (currentSubroute === '/dashboard/tasks/submit') content = renderTaskSubmit();
  else if (currentSubroute === '/dashboard/learning') content = renderLearning();
  else if (currentSubroute === '/dashboard/support') content = renderSupport();
  else if (currentSubroute === '/dashboard/support/new') content = renderNewTicket();
  else if (currentSubroute === '/dashboard/support/ticket') content = renderTicketThread();
  else if (currentSubroute === '/dashboard/notifications') content = renderNotifications();
  else if (currentSubroute === '/dashboard/profile') content = renderProfile();

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto w-full">
      {content}

      {/* Pay Order Modal */}
      {payOrder && (
        <PaystackCheckoutModal
          isOpen={Boolean(payOrder)}
          onClose={() => setPayOrder(null)}
          orderId={payOrder.id}
          itemTitle={payOrder.items[0]?.name || 'Commercial Asset Order'}
          amount={payOrder.totalAmount}
          onPaymentSuccess={() => {
            loadUserData();
            setPayOrder(null);
          }}
        />
      )}
    </div>
  );
};
