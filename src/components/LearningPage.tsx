import React, { useState, useEffect } from 'react';
import type { Course, CourseEnrollment } from '../types/index.js';
import { apiRequest } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.js';
import { CourseCard } from './ui/CourseCard.js';
import { EmptyState } from './ui/EmptyState.js';
import { GraduationCap, BookOpen, Award, CheckCircle2 } from 'lucide-react';

interface LearningPageProps {
  navigate: (path: string) => void;
  onSelectCourse: (course: Course) => void;
}

export const LearningPage: React.FC<LearningPageProps> = ({ navigate, onSelectCourse }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [crsRes, enrRes] = await Promise.all([
          apiRequest<{ courses: Course[] }>('/api/courses'),
          user ? apiRequest<{ enrollments: CourseEnrollment[] }>('/api/enrollments').catch(() => ({ enrollments: [] })) : Promise.resolve({ enrollments: [] }),
        ]);
        setCourses(crsRes.courses);
        setEnrollments(enrRes.enrollments || []);
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));

  return (
    <div className="bg-[#F8FAF9] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-semibold text-[#176B3A] uppercase tracking-wider mb-1">
            Executive Capacity & Wealth Creation
          </div>
          <h1 className="text-3xl font-extrabold text-[#17231C] tracking-tight">
            WealthFarm Executive Academy
          </h1>
          <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
            Standardized professional curriculum designed to equip Nigerian business executives, estate developers, commercial operators, and entrepreneurs with verifiable financial and operational frameworks.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#DCE8DF] flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#EEF7F0] text-[#176B3A] flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#17231C]">Structured Professional Syllabi</h3>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Step-by-step video modules covering commercial asset ownership, financial modeling, operational logistics, and scalable enterprise systems.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#DCE8DF] flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#EEF7F0] text-[#176B3A] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#17231C]">Industry Veteran Instructors</h3>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Taught directly by practicing corporate executives, chartered financial analysts, real estate surveyors, and commercial directors.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#DCE8DF] flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#EEF7F0] text-[#176B3A] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#17231C]">Lesson Progress Tracking</h3>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Track personal module completion and access notes directly in your member dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Course Catalog */}
        <div>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#DCE8DF]">
            <h2 className="text-xl font-bold text-[#17231C]">Curriculum Masterclasses</h2>
            <span className="text-xs text-neutral-500 font-medium">
              {courses.length} Certified Programmes Available
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
              {[1, 2].map((n) => (
                <div key={n} className="bg-white border border-[#DCE8DF] rounded-xl p-4 h-72 animate-pulse">
                  <div className="w-full h-40 bg-neutral-200 rounded-lg mb-4" />
                  <div className="w-3/4 h-4 bg-neutral-200 rounded mb-2" />
                  <div className="w-1/2 h-4 bg-neutral-200 rounded" />
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <EmptyState
              icon={<GraduationCap className="w-6 h-6" />}
              title="No Courses Listed"
              description="New executive masterclasses are currently being scheduled by the Academic Directorate."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isEnrolled={enrolledCourseIds.has(course.id)}
                  onSelect={(c) => {
                    onSelectCourse(c);
                    navigate(`/learning/${c.id}`);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
