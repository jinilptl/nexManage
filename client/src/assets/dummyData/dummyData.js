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
