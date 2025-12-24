import React from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Plus,
  MoreHorizontal,
  Paperclip,
  MessageSquare,
} from "lucide-react";

/* ===================== CONFIG ===================== */

const ItemTypes = { TASK: "TASK" };

const COLUMNS = [
  { id: "todo", title: "To Do", icon: "📋" },
  { id: "in_progress", title: "In Progress", icon: "🔄" },
  { id: "review", title: "Review", icon: "👀" },
  { id: "done", title: "Done", icon: "✅" },
];

/* ===================== TASK CARD ===================== */

function TaskCard({ task, onClick }) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const priorityColor =
    task.priority === "high"
      ? "bg-red-500"
      : task.priority === "medium"
      ? "bg-orange-400"
      : "bg-green-500";

  return (
    <div
      ref={drag}
      onClick={() => onClick(task)}
      className={`relative bg-white rounded-xl border border-gray-200 p-4 mb-4 cursor-pointer
        transition-all
        ${isDragging ? "opacity-60 scale-[0.98] shadow-xl" : "hover:shadow-md"}
      `}
    >
      {/* Priority strip */}
      <span
        className={`absolute left-0 top-0 h-full w-1 rounded-l-xl ${priorityColor}`}
      />

      {/* Title */}
      <h4 className="text-sm font-medium text-gray-900 mb-3 line-clamp-2">
        {task.title}
      </h4>

      {/* Meta icons */}
      <div className="flex items-center gap-4 text-gray-500 text-xs mb-3">
        {task.attachments > 0 && (
          <div className="flex items-center gap-1">
            <Paperclip size={14} />
            {task.attachments}
          </div>
        )}
        {task.comments > 0 && (
          <div className="flex items-center gap-1">
            <MessageSquare size={14} />
            {task.comments}
          </div>
        )}
      </div>

      {/* Tags */}
      {/* <div className="flex flex-wrap gap-2 mb-3">
        {task.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div> */}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <img
          src={task.assignee.avatar}
          alt={task.assignee.name}
          className="w-7 h-7 rounded-full"
        />
        <span
          className={`text-xs ${
            task.overdue ? "text-red-500" : "text-gray-500"
          }`}
        >
          {task.dueDate}
        </span>
      </div>
    </div>
  );
}

/* ===================== COLUMN ===================== */

function Column({ column, tasks, onDropTask, onAddTask, onTaskClick }) {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item) => {
      if (item.status !== column.id) {
        onDropTask(item.id, column.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`shrink-0 w-[300px] bg-gray-50 rounded-2xl p-4 transition
        ${
          isOver
            ? "border-2 border-dashed border-blue-400 bg-blue-50"
            : "border border-transparent"
        }
      `}
    >
      {/* Column header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span>{column.icon}</span>
          <h3 className="text-sm font-semibold text-gray-900">
            {column.title}
          </h3>
          <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddTask(column.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Plus size={16} />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Tasks */}
      <div className="min-h-[200px]">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={onTaskClick}
          />
        ))}

        {tasks.length === 0 && (
          <div className="text-xs text-gray-400 text-center mt-10">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}

/* ===================== MAIN BOARD ===================== */

export default function KanbanBoard({
  tasks,
  onTaskClick,
  onAddTask,
  onMoveTask,
}) {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max">
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={tasks.filter((t) => t.status === column.id)}
              onDropTask={onMoveTask}
              onAddTask={onAddTask}
              onTaskClick={onTaskClick}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
