import React, { useRef, useMemo, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./kanbanConfig";
import {
  Paperclip,
  MessageSquare,
  Calendar,
  GripVertical,
  Tag,
} from "lucide-react";
import TaskDetailModal from "../modals/taskModal/TaskDetailModal";
import Avatar from "../common/Avatar";

import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedTask,
  setSelectedTaskId,
} from "../../Redux_Config/Slices/tasksSlice";
import { priorityConfig } from "../../config/priorityConfig";
import TaskPriorityBadge from "./TaskPriorityBadge";
import TaskMetaInfo from "./TaskMetaInfo";
import { formatDueDate } from "../../utils/formatDueDate";

export default function KanbanTaskCard({
  task,
  index,
  columnId,
  moveTask,
  onClick,
  isObserver = false,
}) {
  const ref = useRef(null);
  const [openTaskDetailesModal, setOpenTaskDetailesModal] = useState(false);

  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    canDrop: () => !isObserver,
    hover(item) {
      if (isObserver) return;
      if (!ref.current) return;
      if (item.columnId !== columnId) return;
      if (item.index === index) return;

      moveTask(columnId, item.id, item.index, index);
      item.index = index;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    canDrag: () => !isObserver,
    item: () => ({
      id: task._id,
      index,
      columnId,
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const cardConfig = priorityConfig[task.priority] || priorityConfig.low;
  const formattedDate = useMemo(
    () => formatDueDate(task.dueDate),
    [task.dueDate],
  );

  const dispatch = useDispatch();

  return (
    <>
      <div
        ref={ref}
        onClick={() => {
          setOpenTaskDetailesModal(true);
          dispatch(setSelectedTaskId(task._id));
          dispatch(setSelectedTask(task));
        }}
        className={`
          group relative bg-white rounded-xl shadow-md border-t-4 ${
            cardConfig.border
          }
          p-4 mb-3 cursor-pointer 
          transition-all duration-300 transform
          hover:shadow-xl hover:scale-[1.01]
          ${isDragging ? "opacity-30 rotate-1 scale-95" : ""}
        `}
      >
        {!isObserver && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 p-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200 cursor-grab">
            <GripVertical size={18} className="text-gray-400" />
          </div>
        )}

        <div className="flex items-center justify-between mb-2">
          <TaskPriorityBadge priority={task.priority} />
        </div>

        <h4 className="text-base font-bold text-gray-900 mb-3 leading-snug">
          {task.title}
        </h4>

        {task.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {(task.attachments > 0 || task.comments > 0) && (
          <TaskMetaInfo
            attachments={task.attachments}
            comments={task.comments}
          />
        )}

        <div className="my-3 border-t border-gray-100" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {task.assignees?.map((assignee, i) => (
              <Avatar
                key={i}
                user={assignee}
                className="w-7 h-7 text-xs ring-2 ring-white"
              />
            ))}
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-gray-500">
            <Calendar size={14} className="text-gray-400" />
            <span className={task.isOverdue ? "text-red-500" : ""}>
              {formattedDate}
            </span>
          </div>
        </div>
      </div>

      {openTaskDetailesModal && (
        <TaskDetailModal
          task={task}
          onClose={() => setOpenTaskDetailesModal(false)}
        />
      )}
    </>
  );
}
