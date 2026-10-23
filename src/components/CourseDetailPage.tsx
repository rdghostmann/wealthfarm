import React, { useState, useEffect } from 'react';
import type { Course, CourseEnrollment } from '../types/index.js';
import { formatNaira } from '../lib/utils.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { apiRequest } from '../lib/api.js';
import { Button } from './ui/Button.js';
import { Breadcrumbs } from './ui/Breadcrumbs.js';
import { PaystackCheckoutModal } from './ui/PaystackCheckoutModal.js';
import {
  PlayCircle,
  CheckCircle2,
  Lock,
  Clock,
  BookOpen,
  UserCheck,
  Award,
  ArrowRight
} from 'lucide-react';

interface CourseDetailPageProps {
  course: Course;
  navigate: (path: string) => void;
}

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ course, navigate }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [enrollment, setEnrollment] = useState<CourseEnrollment | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState<boolean>(false);
  const [updatingLesson, setUpdatingLesson] = useState<boolean>(false);

  useEffect(() => {
    async function checkEnrollment() {
      if (!user) return;
      try {
        const res = await apiRequest<{ enrollments: CourseEnrollment[] }>('/api/enrollments');
        const match = res.enrollments.find((e) => e.courseId === course.id);
        if (match) setEnrollment(match);
      } catch (err) {
        console.error('Failed to load enrollment:', err);
      }
    }
    checkEnrollment();
  }, [user, course.id]);

  const activeLesson = course.lessons[activeLessonIndex] || course.lessons[0];
  const isEnrolled = Boolean(enrollment);
  const isLessonCompleted = enrollment?.completedLessonIds.includes(activeLesson?.id);
  const canAccessLesson = isEnrolled || activeLesson?.isPreviewFree;

  const handleEnrollFree = async () => {
    if (!user) {
      toast.info('Please sign in to enroll.');
      navigate('/login');
      return;
    }
    try {
      const res = await apiRequest<{ enrollment: CourseEnrollment }>(`/api/courses/${course.id}/enroll`, {
        method: 'POST',
      });
      setEnrollment(res.enrollment);
      toast.success('Successfully enrolled in masterclass!');
    } catch (err: any) {
      toast.error(err.message || 'Enrollment failed');
    }
  };

  const handleToggleLessonComplete = async () => {
    if (!user || !enrollment || !activeLesson) return;
    setUpdatingLesson(true);
    try {
      const newStatus = !isLessonCompleted;
      const res = await apiRequest<{ enrollment: CourseEnrollment }>(
        `/api/courses/${course.id}/lessons/${activeLesson.id}/progress`,
        {
          method: 'POST',
          body: JSON.stringify({ completed: newStatus }),
        }
      );
      setEnrollment(res.enrollment);
      toast.success(newStatus ? 'Lesson marked as completed!' : 'Lesson marked as incomplete.');
    } catch (err: any) {
      toast.error(err.message || 'Progress update failed');
    } finally {
      setUpdatingLesson(false);
    }
  };

  const breadcrumbs = [
    { label: 'Home', onClick: () => navigate('/') },
    { label: 'Academy', onClick: () => navigate('/learning') },
    { label: course.title },
  ];

  return (
    <div className="bg-[#F8FAF9] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero Banner */}
        <div className="bg-white rounded-2xl border border-[#DCE8DF] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xs">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#176B3A] uppercase tracking-wider">
              <span>Executive Masterclass & Certification</span>
              <span>·</span>
              <span>{course.lessonsCount} Modules</span>
              <span>·</span>
              <span>{course.totalDurationHours} Hours</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17231C] tracking-tight">
              {course.title}
            </h1>

            <p className="text-sm text-neutral-600 leading-relaxed">
              {course.summary}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="w-9 h-9 rounded-full bg-[#EEF7F0] text-[#176B3A] flex items-center justify-center font-bold text-xs">
                {course.instructorName.charAt(0)}
              </div>
              <div className="text-xs">
                <div className="font-bold text-[#17231C]">{course.instructorName}</div>
                <div className="text-neutral-500">{course.instructorTitle}</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#F8FAF9] border border-[#DCE8DF] rounded-xl p-6 text-center space-y-4">
            <div>
              <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Tuition Fee</div>
              <div className="text-3xl font-extrabold text-[#17231C] tabular-nums mt-1">
                {course.price === 0 ? 'Free Institutional' : formatNaira(course.price)}
              </div>
            </div>

            {isEnrolled ? (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-800 flex items-center justify-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  <span>Enrolled · {enrollment?.progressPercent || 0}% Completed</span>
                </div>
                <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#176B3A] h-full transition-all duration-300"
                    style={{ width: `${enrollment?.progressPercent || 0}%` }}
                  />
                </div>
              </div>
            ) : course.price === 0 ? (
              <Button variant="primary" size="md" className="w-full" onClick={handleEnrollFree}>
                Enroll for Free
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => {
                  if (!user) {
                    toast.info('Please sign in to proceed to tuition checkout.');
                    navigate('/login');
                  } else {
                    setCheckoutModalOpen(true);
                  }
                }}
              >
                Enroll via Paystack ({formatNaira(course.price)})
              </Button>
            )}
          </div>
        </div>

        {/* Video Player & Syllabus Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Player Area */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-black rounded-2xl overflow-hidden aspect-16/9 relative flex items-center justify-center shadow-lg">
              {canAccessLesson ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-white p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors mb-3">
                    <PlayCircle className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="text-base font-bold mb-1">{activeLesson.title}</h3>
                  <p className="text-xs text-neutral-400 max-w-md">
                    High-definition educational stream · {activeLesson.durationMinutes} minutes duration
                  </p>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-950 text-neutral-300 p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-base font-bold text-white">Protected Module</h3>
                  <p className="text-xs text-neutral-400 max-w-sm">
                    This advanced module is reserved for enrolled participants of the executive wealth creation curriculum.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      if (!user) navigate('/login');
                      else setCheckoutModalOpen(true);
                    }}
                  >
                    Unlock Full Curriculum
                  </Button>
                </div>
              )}
            </div>

            {/* Lesson Info & Progress Toggle */}
            <div className="bg-white rounded-2xl border border-[#DCE8DF] p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#DCE8DF]">
                <div>
                  <div className="text-xs font-semibold text-[#176B3A] uppercase tracking-wider mb-1">
                    Current Module ({activeLessonIndex + 1} of {course.lessons.length})
                  </div>
                  <h2 className="text-lg font-bold text-[#17231C]">{activeLesson.title}</h2>
                </div>

                {isEnrolled && (
                  <Button
                    variant={isLessonCompleted ? 'secondary' : 'primary'}
                    size="sm"
                    loading={updatingLesson}
                    onClick={handleToggleLessonComplete}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    {isLessonCompleted ? 'Completed (Click to Reopen)' : 'Mark as Completed'}
                  </Button>
                )}
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {activeLesson.description}
              </p>
            </div>
          </div>

          {/* Syllabus Playlist Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-[#DCE8DF] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE8DF]">
              <h3 className="font-bold text-sm text-[#17231C]">Curriculum Syllabus</h3>
              <span className="text-xs text-neutral-500">{course.lessons.length} Modules</span>
            </div>

            <div className="space-y-2">
              {course.lessons.map((lesson, idx) => {
                const isSelected = idx === activeLessonIndex;
                const isCompleted = enrollment?.completedLessonIds.includes(lesson.id);
                const isLocked = !isEnrolled && !lesson.isPreviewFree;

                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => setActiveLessonIndex(idx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-[#176B3A] bg-[#EEF7F0] shadow-xs'
                        : 'border-[#DCE8DF] hover:bg-neutral-50'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isLocked ? (
                        <Lock className="w-4 h-4 text-neutral-400" />
                      ) : (
                        <PlayCircle className={`w-4 h-4 ${isSelected ? 'text-[#176B3A]' : 'text-neutral-400'}`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-[#17231C] line-clamp-2">
                        {idx + 1}. {lesson.title}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-1">
                        <span>{lesson.durationMinutes} mins</span>
                        {lesson.isPreviewFree && (
                          <>
                            <span>·</span>
                            <span className="text-emerald-700 font-semibold">Free Preview</span>
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Paystack Enrollment Modal */}
      <PaystackCheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        courseId={course.id}
        itemTitle={course.title}
        amount={course.price}
        onPaymentSuccess={() => {
          setEnrollment({
            id: `enr_${Date.now()}`,
            courseId: course.id,
            userId: user?.id || '',
            enrolledAt: new Date().toISOString(),
            completedLessonIds: [],
            progressPercent: 0,
            status: 'ACTIVE',
          });
        }}
      />
    </div>
  );
};
