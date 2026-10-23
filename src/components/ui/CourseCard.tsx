import React from 'react';
import type { Course } from '../../types/index.js';
import { formatNaira } from '../../lib/utils.js';
import { Clock, BookOpen, ArrowRight, UserCheck } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
  onSelect: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, isEnrolled, onSelect }) => {
  return (
    <div className="group bg-white border border-[#DCE8DF] rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col">
      <div className="relative aspect-16/10 w-full bg-neutral-100 overflow-hidden cursor-pointer" onClick={() => onSelect(course)}>
        <img
          src={course.coverImage}
          alt={course.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        {isEnrolled && (
          <div className="absolute top-3 left-3 bg-emerald-800 text-white text-[11px] font-medium px-2.5 py-1 rounded shadow-xs flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Enrolled Member</span>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-[#176B3A]" />
              {course.lessonsCount} Modules
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#176B3A]" />
              {course.totalDurationHours}h Practical
            </span>
          </div>

          <h3
            className="text-base font-bold text-[#17231C] group-hover:text-[#176B3A] transition-colors line-clamp-2 cursor-pointer mb-2"
            onClick={() => onSelect(course)}
          >
            {course.title}
          </h3>

          <p className="text-xs text-neutral-600 line-clamp-2 mb-3 leading-relaxed">
            {course.summary}
          </p>

          <p className="text-[11px] text-neutral-500 font-medium">
            Instructor: <span className="text-[#17231C]">{course.instructorName}</span>
          </p>
        </div>

        <div className="pt-4 mt-4 border-t border-[#DCE8DF] flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase font-semibold text-neutral-600 tracking-wider">Tuition</div>
            <div className="text-lg font-bold text-[#17231C] tabular-nums">
              {course.price === 0 ? 'Institutional Free' : formatNaira(course.price)}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelect(course)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#176B3A] hover:bg-[#0F4927] rounded-lg transition-colors"
          >
            <span>{isEnrolled ? 'Resume Study' : 'View Syllabus'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
