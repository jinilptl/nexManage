import React, { useRef, useMemo } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./kanbanConfig";
import { Paperclip, MessageSquare, Calendar, GripVertical, Tag } from "lucide-react";



const formatDueDate = (dateString) => {
  if (!dateString) return 'No Date';
  try {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch (e) {
    return dateString;
  }
};


const priorityConfig = {
  high: { bg: "bg-red-100", border: "border-red-400", dot: "bg-red-600", text: "text-red-800" },
  medium: { bg: "bg-amber-100", border: "border-amber-400", dot: "bg-amber-600", text: "text-amber-800" },
  low: { bg: "bg-emerald-100", border: "border-emerald-400", dot: "bg-emerald-600", text: "text-emerald-800" },
};

// Sub-Components

const TaskPriorityBadge = ({ priority }) => {

  const config = priorityConfig[priority] || priorityConfig.low;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
      {priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : 'Low'}
    </span>
  );
};

const TaskMetaInfo = ({ attachments, comments }) => (
  <div className="flex items-center gap-3">
    
    {attachments > 0 && (
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Paperclip size={14} className="text-gray-400" />
        <span className="font-medium">{attachments}</span>
      </div>
    )}
 
    {comments > 0 && (
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <MessageSquare size={14} className="text-gray-400" />
        <span className="font-medium">{comments}</span>
      </div>
    )}
  </div>
);




export default function KanbanTaskCard({
  task,
  index,
  columnId,
  moveTask,
  onClick,
}) {
  const ref = useRef(null);


  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover(item) {
      if (
        !ref.current ||
        item.columnId !== columnId ||
        item.index === index
      )
        return;

      moveTask(columnId, item.index, index);
      item.index = index;
    },
  });


  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
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
  const formattedDate = useMemo(() => formatDueDate(task.dueDate), [task.dueDate]);

  
  const assigneeName = task.assignee?.name || "Unassigned";
  const assigneeAvatar = task.assignee?.avatar || "https://via.placeholder.com/100/CCCCCC/FFFFFF?text=A";
console.log(task);

  return (
    <div
      ref={ref}
      onClick={() => onClick(task)}
     
      className={`
        group relative bg-white rounded-xl shadow-md border-t-4 ${cardConfig.border} p-4 mb-3 cursor-pointer 
        transition-all duration-300 transform
        hover:shadow-xl hover:scale-[1.01]
        ${isDragging ? "opacity-30 rotate-1 scale-95" : ""}
      `}
    >
      
      <div className="absolute left-0 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab">
        <GripVertical size={18} className="text-gray-400" />
      </div>

      
      <div className="flex items-center justify-between mb-2">
        <TaskPriorityBadge priority={task.priority} />
       
      </div>

    
      <h4 className="text-base font-bold text-gray-900 mb-3 leading-snug">
        {task.title}
      </h4>
      
      
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

     
      {(task.attachments > 0 || task.comments > 0) && (
        <TaskMetaInfo attachments={task.attachments} comments={task.comments} />
      )}
      
     
      <div className="my-3 border-t border-gray-100"></div>

      
      <div className="flex items-center justify-between">
        
        <div className="flex items-center justify-between">
  <div className="flex items-center gap-2">
    {task.assignees.map((assignee, index) => (
      <div
        key={index}
        title={assignee.name}
        className="
          flex h-7 w-7 items-center justify-center
          rounded-full bg-blue-100
          text-xs font-semibold text-blue-700
          ring-2 ring-white
        "
      >
        {assignee.name?.[0]?.toUpperCase()}
      </div>
    ))}
  </div>
</div>


        {/* Due Date */}
        <div className="flex items-center gap-1 text-xs font-semibold text-gray-500">
          <Calendar size={14} className="text-gray-400" />
          <span className={task.isOverdue ? "text-red-500" : ""}>
            {formattedDate}
          </span>
        </div>
      </div>
    </div>
  );
}