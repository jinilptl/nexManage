import React, { useEffect, useState } from "react";
import KanbanBoard from "./KanbanBoard";
import { Share2, Settings } from "lucide-react";

/* ---------------- DUMMY PROJECT DATA ---------------- */

const PROJECT = {
  title: "Website Redesign",
  status: "Active",
  description:
    "Complete redesign of company website with modern UI/UX",
  members: [
    { id: 1, avatar: "https://i.pravatar.cc/100?img=11" },
    { id: 2, avatar: "https://i.pravatar.cc/100?img=12" },
    { id: 3, avatar: "https://i.pravatar.cc/100?img=13" },
  ],
};

/* ---------------- DUMMY TASK DATA ---------------- */

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


/* ---------------- MAIN COMPONENT ---------------- */

export default function ProjectDetails() {
  const [activeTab, setActiveTab] = useState("board");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setTasks(TASKS);
  }, []);

  const handleMoveTask = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      )
    );
  };

  return (
    <div className="w-full px-8 py-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        Projects <span className="mx-1">›</span>{" "}
        <span className="text-gray-700">{PROJECT.title}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-xl">
            🌐
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">
                {PROJECT.title}
              </h1>
              <span className="px-3 py-1 text-xs rounded-full bg-black text-white">
                {PROJECT.status}
              </span>
            </div>

            <p className="text-sm text-gray-500 mt-1">
              {PROJECT.description}
            </p>

            {/* Members */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex -space-x-2">
                {PROJECT.members.map((m) => (
                  <img
                    key={m.id}
                    src={m.avatar}
                    alt=""
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {PROJECT.members.length} members
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm bg-white hover:bg-gray-100">
            <Share2 size={16} /> Share
          </button>
          <button className="p-2 border rounded-lg bg-white hover:bg-gray-100">
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 bg-gray-100 rounded-full px-4 py-2 w-fit mb-8">
        {["board", "list", "calendar", "files", "analytics"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm capitalize transition ${
                activeTab === tab
                  ? "bg-white shadow text-gray-900 font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* Content */}
      {activeTab === "board" && (
        <KanbanBoard
          tasks={tasks}
          onTaskClick={(t) => console.log(t)}
          onAddTask={(s) => console.log("add in", s)}
          onMoveTask={handleMoveTask}
        />
      )}

      {activeTab !== "board" && (
        <div className="text-sm text-gray-500">
          {activeTab} view coming soon…
        </div>
      )}
    </div>
  );
}
