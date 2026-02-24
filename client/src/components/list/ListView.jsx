import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import ListHeader from "./ListHeader";
import ListRow from "./ListRow";

export default function ListView({ tasks, onTaskClick, onMoveTask, isObserver = false }) {
  const project = useSelector((state) => state.projects.selectedProject);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);

  // Get project data
  const statuses = project?.data?.taskStatuses || [];
  const members = project?.data?.projectMembers || [];

  // Create status map for easy lookup
  const statusMap = useMemo(() => {
    return statuses.reduce((acc, status) => {
      acc[status._id] = status;
      return acc;
    }, {});
  }, [statuses]);

  const canViewAllTasks = useMemo(() => {
    if (!user) return false;
    if (user.role === "super_admin" || user.role === "admin") return true;
    if (isObserver) return true;

    const projectMembers = project?.data?.projectMembers || [];
    const currentMember = projectMembers.find(
      (m) => (m.user?._id || m.user) === user?._id,
    );

    if (currentMember?.roleInProject === "project-manager") return true;
    if (currentMember?.roleInProject === "observer") return true;

    return false;
  }, [user, project, isObserver]);

  // Handle Filtering
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 0. Permission Check
      if (!canViewAllTasks) {
        const isAssigned = task.assignees?.some(
          (a) => (a._id || a) === user?._id,
        );
        if (!isAssigned) return false;
      }

      // 1. Status Filter
      if (statusFilter && task.status !== statusFilter) return false;

      // 2. Priority Filter
      if (priorityFilter && task.priority !== priorityFilter) return false;

      // 3. Assignee Filter
      if (assigneeFilter) {
        const hasAssignee = task.assignees?.some(
          (a) => (a._id || a) === assigneeFilter,
        );
        if (!hasAssignee) return false;
      }

      // 4. Search Query (Title)
      if (searchQuery) {
        const titleMatch = task.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        if (!titleMatch) return false;
      }

      return true;
    });
  }, [
    tasks,
    statusFilter,
    priorityFilter,
    assigneeFilter,
    searchQuery,
    canViewAllTasks,
    user,
  ]);

  const handleToggleSelectAll = () => {
    if (
      selectedTaskIds.length === filteredTasks.length &&
      filteredTasks.length > 0
    ) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(filteredTasks.map((t) => t._id));
    }
  };

  const handleToggleSelectRow = (taskId) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId],
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <ListHeader
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        assigneeFilter={assigneeFilter}
        setAssigneeFilter={setAssigneeFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        allSelected={
          filteredTasks.length > 0 &&
          selectedTaskIds.length === filteredTasks.length
        }
        onToggleSelectAll={handleToggleSelectAll}
        projectMembers={members}
        statuses={statuses}
      />

      <div className="flex-1 overflow-y-auto">
        {filteredTasks.length > 0 ? (
          <div className="min-w-[800px] flex flex-col">
            {filteredTasks.map((task, index) => (
              <ListRow
                key={task._id}
                task={task}
                index={index}
                statusLabel={statusMap[task.status]?.label || "Unknown"}
                isSelected={selectedTaskIds.includes(task._id)}
                onToggleSelect={handleToggleSelectRow}
                onTaskClick={onTaskClick}
                statuses={statuses}
                onMoveTask={onMoveTask}
                projectId={project?.data?._id}
                token={token}
                isObserver={isObserver}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-gray-400">
            <p>No tasks found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
