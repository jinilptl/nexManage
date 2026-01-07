import React, { useEffect, useState } from "react";
import ProjectHeader from "../../components/ProjectDetails/ProjectHeader";
import ProjectTabs from "../../components/ProjectDetails/ProjectTabs";
import ProjectContent from "../../components/ProjectDetails/ProjectContent";
import { useDispatch, useSelector } from "react-redux";
import CreateTaskModal from "../../components/modals/taskModal/CreateTaskModal";
import CreateTeamModal from "../../components/modals/teamsModals/CreateTeamModal";
import {
  createTaskService,
  getAllTasksService,
} from "../../services/taskOperations/taskServices";
import { act } from "react";

const PROJECT = {
  title: "Website Redesign",
  status: "Active",
  description: "Complete redesign of company website with modern UI/UX",
  members: [
    { id: 1, avatar: "https://i.pravatar.cc/100?img=11" },
    { id: 2, avatar: "https://i.pravatar.cc/100?img=12" },
    { id: 3, avatar: "https://i.pravatar.cc/100?img=13" },
  ],
};

const TASKS = [
  {
    id: "t1",
    title: "Optimize image loading",
    status: "todo",
    priority: "high",
    description:
      "Use WebP format and lazy loading for all primary images on landing pages to improve FCP.",
    tags: ["Frontend", "Performance", "Critical"],
    assignee: {
      name: "Alex",
      avatar: "https://i.pravatar.cc/100?img=1",
    },
  },
  {
    id: "t2",
    title: "User testing and feedback",
    status: "todo",
    priority: "medium",
    description:
      "Schedule five user interviews to gather feedback on the new checkout flow and address pain points.",
    tags: ["UX", "Research", "Customer"],
    assignee: {
      name: "Emma",
      avatar: "https://i.pravatar.cc/100?img=2",
    },
  },
  {
    id: "t3",
    title: "Implement responsive navigation",
    status: "in_progress",
    priority: "high",
    description:
      "Develop mobile-first navigation menu, ensuring smooth transitions and accessibility across all devices.",
    tags: ["Frontend", "Mobile", "A11y"],
    assignee: {
      name: "Rahul",
      avatar: "https://i.pravatar.cc/100?img=3",
    },
  },
  {
    id: "t4",
    title: "Setup design system tokens",
    status: "review",
    priority: "medium",
    description:
      "Define and implement core color, typography, and spacing tokens in Figma and codebase (CSS variables).",
    tags: ["Design", "DevOps", "Documentation"],
    assignee: {
      name: "Maya",
      avatar: "https://i.pravatar.cc/100?img=4",
    },
  },
  {
    id: "t5",
    title: "Design homepage mockups",
    status: "done",
    priority: "high",
    description:
      "Create high-fidelity mockups for the new homepage design, focusing on clarity and conversion rates.",
    tags: ["Design", "Marketing"],
    assignee: {
      name: "Chris",
      avatar: "https://i.pravatar.cc/100?img=5",
    },
  },
];

export default function ProjectDetails() {
  const [activeTab, setActiveTab] = useState("board");
  const [tasks, setTasks] = useState([]);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const projectData = useSelector((state) => state.projects.selectedProject);
  const taskList = useSelector((state) => state.tasks.list);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  // console.log("project |Data===> ", projectData);
  const reorderTaskInColumn = (columnId, fromIndex, toIndex) => {
    setTasks((prev) => {
      const columnTasks = prev.filter((t) => t.status === columnId);
      const otherTasks = prev.filter((t) => t.status !== columnId);

      const [moved] = columnTasks.splice(fromIndex, 1);
      columnTasks.splice(toIndex, 0, moved);

      return [...otherTasks, ...columnTasks];
    });
  };

  useEffect(() => {
    setTasks(TASKS);
    dispatch(getAllTasksService(projectData.id, token));
  }, [activeTab]);

  const onSubmit = (formData) => {
    // console.log("form Data is ---> ", formData);

    dispatch(
      createTaskService(formData, projectData.id, token, setCreateTaskModalOpen)
    );
  };
  return (
    <div className="px-8 py-6 bg-gray-50 min-h-screen overflow-x-hidden min-w-0">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        Projects <span className="mx-1">›</span>
        <span className="text-gray-700">{projectData.data.projectName}</span>
      </div>

      <ProjectHeader project={projectData.data} />

      <ProjectTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <ProjectContent
        activeTab={activeTab}
        tasks={tasks}
        setTasks={setTasks}
        reorderTaskInColumn={reorderTaskInColumn}
        onModalOpen={setCreateTaskModalOpen}
        modalOpen={createTaskModalOpen}
      />

      {createTaskModalOpen && (
        <CreateTaskModal
          isOpen={createTaskModalOpen}
          onClose={setCreateTaskModalOpen}
          projectMembers={projectData.data.projectMembers}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
}
