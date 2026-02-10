import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import ListHeader from "./ListHeader";
import ListRow from "./ListRow";

export default function ListView({ tasks, onTaskClick, onMoveTask }) {
    const project = useSelector((state) => state.projects.selectedProject);
    const token = useSelector((state) => state.auth.token);
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

    // Handle Filtering
    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            // 1. Status Filter
            if (statusFilter && task.status !== statusFilter) return false;

            // 2. Priority Filter
            if (priorityFilter && task.priority !== priorityFilter) return false;

            // 3. Assignee Filter
            if (assigneeFilter) {
                const hasAssignee = task.assignees?.some(
                    (a) => (a._id || a) === assigneeFilter // Handle expanded or ID-only
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
    }, [tasks, statusFilter, priorityFilter, assigneeFilter, searchQuery]);


    // Selection Logic
    const handleToggleSelectAll = () => {
        if (selectedTaskIds.length === filteredTasks.length && filteredTasks.length > 0) {
            setSelectedTaskIds([]);
        } else {
            setSelectedTaskIds(filteredTasks.map((t) => t._id));
        }
    };

    const handleToggleSelectRow = (taskId) => {
        setSelectedTaskIds((prev) =>
            prev.includes(taskId)
                ? prev.filter((id) => id !== taskId)
                : [...prev, taskId]
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
