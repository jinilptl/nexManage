import React, { useEffect, useState } from "react";
import ProjectHeader from "../../components/ProjectDetails/ProjectHeader";
import ProjectTabs from "../../components/ProjectDetails/ProjectTabs";
import ProjectContent from "../../components/ProjectDetails/ProjectContent";



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
    assignee: {
      name: "Chris",
      avatar: "https://i.pravatar.cc/100?img=5",
    },
  },
];



export default function ProjectDetails() {
  const [activeTab, setActiveTab] = useState("board");
  const [tasks, setTasks] = useState([]);

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
    setTasks(TASKS)
  }, []);

  return (
    <div className="w-full px-8 py-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        Projects <span className="mx-1">›</span>
        <span className="text-gray-700">{PROJECT.title}</span>
      </div>

      <ProjectHeader project={PROJECT} />

      <ProjectTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <ProjectContent
        activeTab={activeTab}
        tasks={tasks}
        setTasks={setTasks}
        reorderTaskInColumn={reorderTaskInColumn}
      />
    </div>
  );
}
