import React from 'react';
import type { Task } from '../../types/index.js';
import { formatDate } from '../../lib/utils.js';
import { StatusBadge } from './StatusBadge.js';
import { Calendar, CheckSquare, ArrowRight, AlertCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onSelect: (task: Task) => void;
  onSubmitEvidence?: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onSelect, onSubmitEvidence }) => {
  return (
    <div className="bg-white border border-[#DCE8DF] rounded-xl p-5 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-xs font-semibold text-[#176B3A]">{task.category}</span>
          <StatusBadge status={task.status} type="task" />
        </div>

        <h3
          className="text-base font-bold text-[#17231C] hover:text-[#176B3A] transition-colors cursor-pointer mb-2 line-clamp-1"
          onClick={() => onSelect(task)}
        >
          {task.title}
        </h3>

        <p className="text-xs text-neutral-600 line-clamp-2 mb-4 leading-relaxed">
          {task.description}
        </p>

        {/* Requirements preview */}
        <div className="space-y-1.5 mb-4">
          <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
            <CheckSquare className="w-3 h-3 text-[#176B3A]" />
            Evidence Requirements ({task.requirements.length})
          </div>
          <ul className="text-xs text-neutral-600 space-y-1 pl-4 list-disc marker:text-[#176B3A]">
            {task.requirements.slice(0, 2).map((req, idx) => (
              <li key={idx} className="line-clamp-1">
                {req}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-3 border-t border-[#DCE8DF] flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-neutral-500">
          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
          <span>Due: {formatDate(task.deadline)}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelect(task)}
            className="text-neutral-600 hover:text-[#17231C] font-medium"
          >
            Guidelines
          </button>
          {onSubmitEvidence && task.status === 'PUBLISHED' && (
            <button
              type="button"
              onClick={() => onSubmitEvidence(task)}
              className="inline-flex items-center gap-1 px-3 py-1.5 font-semibold text-white bg-[#176B3A] hover:bg-[#0F4927] rounded-lg transition-colors"
            >
              <span>Submit</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
