export const dummyProjects = [
  {
    _id: "p1",
    projectName: "NexManage Dashboard",
    description: "Building the core dashboard and analytics.",
    projectType: "team",
    status: "active",
    createdAt: "2025-01-20T10:00:00Z",
    createdBy: { name: "Chintan Rabari" },
    projectMembers: [
      { user: { name: "Chintan" } },
      { user: { name: "Rohan" } },
      { user: { name: "Aditi" } }
    ]
  },
  {
    _id: "p2",
    projectName: "Portfolio Site",
    description: "A personal portfolio website.",
    projectType: "personal",
    status: "onhold",
    createdAt: "2025-02-01T09:20:00Z",
    createdBy: { name: "Dev Patel" },
    projectMembers: [{ user: { name: "Dev Patel" } }]
  }
];



export const mockUsers = [
  {
    id: "u1",
    name: "Jinil Patel",
    email: "jinil@example.com",
    avatar: "",
  },
  {
    id: "u2",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    avatar: "",
  },
  {
    id: "u3",
    name: "Priya Singh",
    email: "priya@example.com",
    avatar: "",
  },
  {
    id: "u4",
    name: "Aman Verma",
    email: "aman@example.com",
    avatar: "",
  },
  {
    id: "u5",
    name: "Neha Patel",
    email: "neha@example.com",
    avatar: "",
  },
];

export const mockProjects = [
  {
    id: "p1",
    name: "NexManage Dashboard",
    icon: "📌",
    status: "active",
    stats: {
      totalTasks: 24,
      completedTasks: 18,
    },
  },
  {
    id: "p2",
    name: "Task & Kanban Module",
    icon: "🧩",
    status: "active",
    stats: {
      totalTasks: 30,
      completedTasks: 14,
    },
  },
  {
    id: "p3",
    name: "Team Management",
    icon: "👥",
    status: "active",
    stats: {
      totalTasks: 16,
      completedTasks: 6,
    },
  },
  {
    id: "p4",
    name: "Authentication Setup",
    icon: "🔐",
    status: "completed",
    stats: {
      totalTasks: 12,
      completedTasks: 12,
    },
  },
];

export const mockTasks = [
  {
    id: "t1",
    title: "Create Analytics UI",
    status: "in_progress", // todo | in_progress | review | done
    priority: "high", // low | medium | high | critical
    assignees: ["u1", "u2"],
    comments: 4,
    dueDate: "2026-01-10",
  },
  {
    id: "t2",
    title: "Fix Kanban drag issue",
    status: "review",
    priority: "critical",
    assignees: ["u2"],
    comments: 8,
    dueDate: "2026-01-05",
  },
  {
    id: "t3",
    title: "Add Task Attachments feature",
    status: "done",
    priority: "medium",
    assignees: ["u1", "u3"],
    comments: 3,
    dueDate: "2026-01-02",
  },
  {
    id: "t4",
    title: "Implement role-based access",
    status: "done",
    priority: "high",
    assignees: ["u4"],
    comments: 6,
    dueDate: "2025-12-20",
  },
  {
    id: "t5",
    title: "Build project progress section",
    status: "todo",
    priority: "low",
    assignees: ["u5"],
    comments: 1,
    dueDate: "2026-01-25",
  },
  {
    id: "t6",
    title: "Create API integration for tasks",
    status: "in_progress",
    priority: "high",
    assignees: ["u1"],
    comments: 5,
    dueDate: "2026-01-12",
  },
  {
    id: "t7",
    title: "Add notifications UI",
    status: "todo",
    priority: "medium",
    assignees: ["u3", "u5"],
    comments: 2,
    dueDate: "2026-01-28",
  },
  {
    id: "t8",
    title: "Optimize dashboard performance",
    status: "review",
    priority: "high",
    assignees: ["u2", "u4"],
    comments: 7,
    dueDate: "2026-01-08",
  },
  {
    id: "t9",
    title: "Setup project settings page",
    status: "done",
    priority: "low",
    assignees: ["u5"],
    comments: 0,
    dueDate: "2025-12-30",
  },
  {
    id: "t10",
    title: "Create task filters",
    status: "in_progress",
    priority: "medium",
    assignees: ["u1", "u2"],
    comments: 3,
    dueDate: "2026-01-15",
  },
];

