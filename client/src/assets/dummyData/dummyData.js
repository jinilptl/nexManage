export const dummyProjects = [
  {
    _id: "p1",
    projectName: "NexManage Dashboard",
    description: "Building the core dashboard and analytics.",
    projectType: "team",
    status: "active",
    createdAt: "2025-01-20T10:00:00Z",
    createdBy: { name: "Jinil Patel" },
    projectMembers: [
      { user: { name: "Jinil" } },
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


export const dummyTeams = [
  { _id: "team1", teamName: "Design Team" },
  { _id: "team2", teamName: "Development Team" },
  { _id: "team3", teamName: "Marketing Team" },
];




// ===============================
// USERS
// ===============================
export const mockUsers = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@company.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    status: 'active',
  },
  {
    id: 'user-2',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    status: 'active',
  },
  {
    id: 'user-3',
    name: 'Mike Ross',
    email: 'mike@company.com',
    role: 'member',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    status: 'active',
  },
  {
    id: 'user-4',
    name: 'Jane Smith',
    email: 'jane@company.com',
    role: 'member',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    status: 'active',
  },
];

// ===============================
// PROJECTS (used in ProjectDetail)
// ===============================
export const mockProjects = [
  {
    id: 'project-1',
    name: 'Website Redesign',
    description: 'Complete redesign of company website',
    icon: '🌐',
    color: '#3B82F6',
    owner: 'user-2',
    members: ['user-1', 'user-2', 'user-3'],
    status: 'active',
    stats: {
      totalTasks: 5,
      completedTasks: 1,
      memberCount: 3,
    },
  },
  {
    id: 'project-2',
    name: 'Mobile App Development',
    description: 'iOS & Android mobile application',
    icon: '📱',
    color: '#10B981',
    owner: 'user-1',
    members: ['user-1', 'user-3', 'user-4'],
    status: 'active',
    stats: {
      totalTasks: 3,
      completedTasks: 1,
      memberCount: 3,
    },
  },
];

// ===============================
// TASKS (used in KanbanBoard)
// ===============================
export const mockTasks = [
  // PROJECT 1
  {
    id: 'task-1',
    title: 'Design homepage UI',
    description: 'Create homepage mockups',
    project: 'project-1',
    status: 'done',
    columnId: 'done',
    priority: 'high',
    assignees: ['user-2'],
    labels: ['design', 'ui'],
    attachments: 2,
    comments: 4,
    dueDate: new Date('2025-01-20'),
    position: 0,
  },
  {
    id: 'task-2',
    title: 'Build navbar component',
    description: 'Responsive navbar',
    project: 'project-1',
    status: 'in_progress',
    columnId: 'in_progress',
    priority: 'high',
    assignees: ['user-3'],
    labels: ['frontend'],
    attachments: 1,
    comments: 2,
    dueDate: new Date('2025-01-30'),
    position: 0,
  },
  {
    id: 'task-3',
    title: 'Optimize images',
    description: 'Lazy load images',
    project: 'project-1',
    status: 'todo',
    columnId: 'todo',
    priority: 'medium',
    assignees: ['user-3'],
    labels: ['performance'],
    attachments: 0,
    comments: 1,
    position: 1,
  },

  // PROJECT 2
  {
    id: 'task-4',
    title: 'Setup React Native project',
    description: 'Initialize RN app',
    project: 'project-2',
    status: 'done',
    columnId: 'done',
    priority: 'critical',
    assignees: ['user-3'],
    labels: ['setup', 'mobile'],
    attachments: 1,
    comments: 3,
    position: 0,
  },
  {
    id: 'task-5',
    title: 'Design login screen',
    description: 'Login UI & validation',
    project: 'project-2',
    status: 'in_progress',
    columnId: 'in_progress',
    priority: 'high',
    assignees: ['user-4'],
    labels: ['design'],
    attachments: 2,
    comments: 1,
    position: 0,
  },
  {
    id: 'task-6',
    title: 'Auth API integration',
    description: 'JWT auth flow',
    project: 'project-2',
    status: 'todo',
    columnId: 'todo',
    priority: 'critical',
    assignees: ['user-3'],
    labels: ['backend'],
    attachments: 0,
    comments: 0,
    position: 1,
  },
];

// ===============================
// CURRENT USER
// ===============================
export const currentUser = mockUsers[0];

// ===============================
// HELPERS (USED BY UI)
// ===============================
export const getUserById = id =>
  mockUsers.find(user => user.id === id);

export const getProjectById = id =>
  mockProjects.find(project => project.id === id);

export const getTasksByProject = projectId =>
  mockTasks.filter(task => task.project === projectId);


