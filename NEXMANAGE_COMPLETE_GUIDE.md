# 🏢 NexManage - Complete Project Architecture & Developer Guide

## 📌 Table of Contents
1. [Overall Architecture](#overall-architecture)
2. [Backend Deep Dive](#backend-deep-dive)
3. [Frontend Deep Dive](#frontend-deep-dive)
4. [Complete User Flows](#complete-user-flows)
5. [Developer Flow & Patterns](#developer-flow--patterns)
6. [What's Complete ✅](#whats-complete-)
7. [What's Missing ❌](#whats-missing-)
8. [Your Responsibilities](#your-responsibilities-as-the-new-developer)
9. [Final Summary](#final-summary)

---

## Overall Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    NEXMANAGE SYSTEM                          │
├──────────────────────┬──────────────────────┬────────────────┤
│   CLIENT (REACT)     │   NETWORK (HTTP)     │  SERVER (NODE) │
│                      │                      │                │
│  ✓ Pages            │  ✓ REST API          │  ✓ Express     │
│  ✓ Components       │    (Axios calls)     │  ✓ JWT Auth    │
│  ✓ Redux Store      │  ✓ WebSockets        │  ✓ MongoDB     │
│  ✓ Services         │    (Socket.IO)       │  ✓ Controllers │
│  ✓ Hooks            │                      │  ✓ Middleware  │
│                      │                      │                │
│  Port: 5173         │  Base URL:           │  Port: 5000    │
│  (Vite Dev)         │  http://localhost:5000                │
└──────────────────────┴──────────────────────┴────────────────┘
```

### Why This Architecture?

1. **Separation of Concerns**: Frontend handles UI/UX, Backend handles business logic and database
2. **RESTful API Design**: Standard HTTP verbs (GET, POST, PUT, DELETE) for predictable behavior
3. **JWT Authentication**: Stateless authentication - each request carries its own credentials
4. **Redux State Management**: Single source of truth for frontend data, predictable state changes
5. **MongoDB**: Flexible schema perfect for managing complex team/project relationships
6. **Socket.IO**: Real-time updates for collaborative features (chat, live task updates)

### High-Level Request → Response Lifecycle

```
USER CLICKS BUTTON
    ↓
React Component calls Service (e.g., loginUserService)
    ↓
Service dispatches Redux action with loading state
    ↓
Axios makes HTTP request to Backend API
    ↓
SERVER RECEIVES REQUEST
    ↓
Middleware 1: Check if token exists (verifyToken)
    ↓
Middleware 2: Verify user role permissions (roleChecker)
    ↓
Controller: Execute business logic (query database)
    ↓
Return ApiResponse (standardized format)
    ↓
CLIENT RECEIVES RESPONSE
    ↓
Service dispatches Redux action with data
    ↓
Component re-renders with updated data
    ↓
Toast notification shows success/error
```

---

## Backend Deep Dive

### 1. Folder Structure & Responsibilities

```
server/
├── index.js                 # Entry point - initializes server & socket
├── app.js                   # Express app setup - middleware & routes
├── package.json             # Dependencies
│
├── config/
│   └── DbConnect.js         # MongoDB connection
│
├── models/                  # Database schemas
│   ├── user.models.js       # User data structure
│   ├── team.models.js       # Team with embedded members
│   ├── project.models.js    # Project with members & task statuses
│   └── Task models/
│       ├── task.models.js
│       ├── subTask.models.js
│       ├── taskAttachment.models.js
│       └── taskActivityLog.models.js
│
├── controllers/             # Business logic (what happens)
│   ├── user.controllers.js
│   ├── team.controllers.js
│   └── projectControllers/
│       ├── project.controllers.js
│       └── projectMembers.controllers.js
│
├── routes/                  # API endpoints (where requests go)
│   ├── auth.routes.js
│   ├── team.routes.js
│   ├── project.routes.js
│   └── tasksRoutes/
│       ├── task.routes.js
│       ├── subtask.routes.js
│       ├── fileUpload.routes.js
│       └── activityLogs.routes.js
│
├── middlewares/             # Interceptors (check before proceeding)
│   ├── authMiddlewares/
│   │   ├── varifyToken.middlewares.js    # ✓ Verify JWT
│   │   └── roleChecker.middlewares.js    # ✓ Check user role
│   ├── fileUploadMiddlewares/
│   │   └── multer.middleware.js          # ✓ Handle file uploads
│   ├── socketMiddlewares/
│   │   └── socketAuth.js                 # ✓ WebSocket auth
│   └── taskMiddlewares/
│       ├── attachTaskToRequest.middlewares.js
│       ├── isAssigneeOrProjectManager.middlewares.js
│       ├── isProjectManager.middlewares.js
│       ├── isProjectMember.middlewares.js
│       ├── isTaskAssignee.middlewares.js
│       └── isValidTaskStatus.middlewares.js
│
├── socket/                  # Real-time communication
│   ├── index.js             # Socket.IO initialization
│   ├── socketEvents.js      # Event handlers
│   └── socketRooms.js       # Room management
│
├── utils/                   # Helper functions
│   ├── ApiError.js          # Error class
│   ├── ApiResponse.js       # Response class
│   ├── asyncHandler.js      # Async wrapper
│   ├── cloudinary.js        # Image upload service
│   ├── emailSender.js       # Email service
│   ├── CreateActivityLog.js # Audit trail
│   └── verifySocketToken.js
│
└── templates/               # Email templates
    ├── forgotPasswordMail.js
    └── team_member_added_email_template.js
```

### 2. index.js - The Server Entry Point

```javascript
// server/index.js
import http from "http";
import app from './app.js';
import dotenv from "dotenv";
import { initSocket } from "./socket/index.js";
import Dbconnect from './config/DbConnect.js';

dotenv.config();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);      // HTTP server
initSocket(server);                         // WebSocket setup
Dbconnect().then(() => {                    // Connect to MongoDB
  server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});
```

**What happens**:
1. Read environment variables (.env file)
2. Create HTTP server from Express app
3. Initialize Socket.IO for real-time features
4. Connect to MongoDB
5. Start listening on port 5000

### 3. app.js - Express Setup

```javascript
// server/app.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from "morgan";

const app = express();

// CORS: Allow requests from http://localhost:3000 and http://localhost:5173
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Middleware: Parse JSON requests
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Middleware: Parse cookies
app.use(cookieParser());

// Middleware: Log all requests
app.use(morgan("dev"));

// ROUTES
app.use("/api/v1/user", authRouter);
app.use("/api/v1/team", teamRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/project/task", taskRouter);
// ... more routes

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    errors: err.errors
  });
});
```

**Order matters** because middleware executes top-to-bottom. By the time a request reaches a route, it has been parsed and logged.

### 4. Middleware Flow (Request Lifecycle)

```
HTTP Request arrives at /api/v1/project/create-project
    ↓
cors() - Check if origin is allowed
    ↓
express.json() - Parse JSON body
    ↓
cookieParser() - Extract cookies
    ↓
morgan() - Log request
    ↓
verifyToken - Extract and validate JWT token
    If fails → throw ApiError(400, "unauthorized access")
    ↓
roleChecker(['admin', 'super_admin']) - Check user role
    If fails → throw ApiError(403, "access denied")
    ↓
createProject controller - Execute business logic
    ↓
Global Error Handler - Catch any errors and respond
```

**Key middleware**:

#### A. verifyToken Middleware
```javascript
// Extract token from:
// 1. Cookies (req.cookies.token)
// 2. Authorization header (req.headers.authorization.split(" ")[1])

// Verify with JWT secret
jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
  if (err) throw ApiError(400, "invalid token or token expired");
  req.user = decode;  // Attach user info to request
  next();             // Continue to next middleware
});
```

#### B. roleChecker Middleware
```javascript
// Exported as roleChecker(['admin', 'super_admin'])
// Returns a middleware function that checks if req.user.role 
// is in the allowed roles array
```

### 5. Authentication System (JWT + Cookies)

#### User Registration
```
POST /api/v1/user/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "member"  // optional, defaults to "member"
}
```

**Backend Process**:
1. Validate required fields
2. Check if user already exists (by email)
3. Hash password with bcryptjs (10 salt rounds)
4. Create user in database
5. Return user data (password excluded)

**Who can create users**:
- `super_admin` and `admin` can create any user
- Regular `member` cannot create other users via API
- First user must be created directly in database or via seed script

#### User Login
```
POST /api/v1/user/login
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Backend Process**:
1. Find user by email
2. Compare submitted password with stored hash using bcrypt
3. If match: Create JWT token with payload:
   ```javascript
   {
     _id: user._id,
     name: user.name,
     email: user.email,
     role: user.role
   }
   ```
4. Set cookie with token (httpOnly: true, secure: true)
5. Return token + user details

**Frontend Process** (see Services section):
1. Service calls backend
2. On success: Dispatch Redux actions:
   - `setUser(userData)` → store in localStorage
   - `setToken(token)` → store in localStorage
   - `setIsLogin(true)`
3. Navigate to /dashboard

#### Token Handling
```javascript
// Token stored in 3 places for redundancy:
// 1. HTTP-only cookie (auto-sent with each request)
// 2. localStorage (accessible via JavaScript)
// 3. Redux store (in-memory for current session)

// On each API request, Axios sends:
// Authorization header: "Bearer <token>"
// AND cookie automatically

// Protected routes check:
// 1. Token exists
// 2. Token not expired (client-side validation in ProtectedWrapper)
```

### 6. User Roles & Permissions

```
SUPER_ADMIN
├─ Can: Create teams, projects, manage all users
├─ Can: Assign roles to other users
└─ Can: Access all projects and teams

ADMIN
├─ Can: Create teams within their organization
├─ Can: Create projects
├─ Can: Manage team members
└─ Can: Manage projects they created/assigned to

MEMBER
├─ Can: View teams they're part of
├─ Can: Create personal projects
├─ Can: Be added to team projects
└─ Can: Create and manage tasks assigned to them
```

**Route Protection Examples**:
```javascript
// Only admin+ can create teams
teamRouter.post("/create-team", 
  verifyToken, 
  roleChecker(['super_admin', 'admin']), 
  createNewTeam
);

// Any logged-in user can create projects
projectRouter.post("/create-project", 
  verifyToken,  // Just verify token, no role check
  createProject
);
```

### 7. Data Models & Relationships

#### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['super_admin', 'admin', 'member'],
  createdBy: ObjectId (reference to User who created this user),
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Team Model
```javascript
{
  _id: ObjectId,
  teamName: String (unique),
  description: String,
  createdBy: ObjectId (reference to User),
  members: [
    {
      user: ObjectId (reference to User),
      roleInTeam: Enum ['team lead', 'member', 'developer', ...],
      joinedAt: Date,
      status: Enum ['active', 'inactive'],
      _id: NOT INCLUDED (embedded, no ID)
    }
  ],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Important**: Team members are **embedded documents** (sub-schema), not references. This means:
- ✅ Fast lookup (no second database query needed)
- ✅ Team member data is always synchronized
- ❌ If you update a user's name, team member records still show old name (denormalization trade-off)

#### Project Model
```javascript
{
  _id: ObjectId,
  projectName: String,
  description: String,
  createdBy: ObjectId (User who created it),
  projectType: Enum ['team', 'personal', 'mixed'],
  teams: [ObjectId] (array of Team IDs),
  projectManager: ObjectId (User assigned as PM),
  projectMembers: [
    {
      user: ObjectId (reference to User),
      roleInProject: Enum ['project-manager', 'developer', ...],
      addedFromTeam: ObjectId (which team they came from, null if direct add),
      addedAt: Date,
      status: Enum ['active', 'removed'],
      taskStatuses: [String] (custom Kanban columns for this member),
      _id: NOT INCLUDED (embedded)
    }
  ],
  status: Enum ['active', 'onhold', 'completed', 'archived'],
  taskStatuses: [
    {
      _id: ObjectId,
      key: String ('todo', 'in_progress', etc.),
      label: String ('To Do', 'In Progress', etc.),
      order: Number (display order),
      isDefault: Boolean
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

**Project Types Explained**:

| Type | Teams | Auto-add | Use Case |
|------|-------|----------|----------|
| **team** | Required | ✓ Team members auto-added to project | Work with multiple teams on same project |
| **personal** | Not allowed | N/A | Solo projects, freelance work |
| **mixed** | Optional | ✓ If teams assigned, members auto-added | Hybrid: team members + handpicked individuals |

#### Task Model
```javascript
{
  _id: ObjectId,
  project: ObjectId (reference to Project),
  title: String (min 5 chars),
  description: String,
  priority: Enum ['low', 'medium', 'high', 'critical'],
  status: ObjectId (reference to TaskStatus in Project),
  assignees: [ObjectId] (array of User IDs),
  dueDate: Date (must be future date),
  order: Number (for Kanban drag-and-drop),
  createdBy: ObjectId (User who created task),
  createdAt: Date,
  updatedAt: Date
}
```

#### Task Status (Embedded in Project)
```javascript
{
  _id: ObjectId,
  key: 'to_do' or 'in_progress' or 'review' or 'done',
  label: 'To Do' or 'In Progress' or 'Review' or 'Done',
  order: 1, 2, 3, 4 (display order),
  isDefault: true/false
}
```

**Why status is referenced by ID, not string**?
- Allows custom statuses per project
- Each project can have different Kanban columns
- Sorting by order field maintains column order

#### SubTask, Attachment, Activity Log Models
```javascript
// SubTask - Breaks down a task into smaller chunks
{
  task: ObjectId,
  title: String,
  isCompleted: Boolean,
  assignee: ObjectId,
  createdBy: ObjectId
}

// Attachment - File uploaded to task
{
  task: ObjectId,
  fileName: String,
  fileUrl: String (Cloudinary URL),
  uploadedBy: ObjectId,
  uploadedAt: Date
}

// ActivityLog - Audit trail of all changes
{
  task: ObjectId,
  actionType: String ('created', 'updated', 'commented', ...),
  changedBy: ObjectId,
  description: String,
  oldValue: Any,
  newValue: Any,
  createdAt: Date
}
```

### 8. Core Flows (Backend Perspective)

#### Flow 1: Create a Team
```
POST /api/v1/team/create-team
Headers: { Authorization: "Bearer <token>" }
Body: { teamName: "Dev Team", description: "Backend developers" }

MIDDLEWARE CHAIN:
├─ verifyToken → req.user = { _id, name, email, role }
└─ No role check (anyone can create team in current implementation)

CONTROLLER (createNewTeam):
├─ Validate teamName and description
├─ Check if team already exists (unique teamName)
├─ Create in database:
│  └─ Team { teamName, description, createdBy: req.user._id, members: [] }
├─ Populate createdBy with user details
└─ Return ApiResponse(201, "Team created successfully", teamDoc)

RESPONSE:
{
  "success": true,
  "statusCode": 201,
  "message": "Team created successfully",
  "data": {
    "_id": "...",
    "teamName": "Dev Team",
    "description": "Backend developers",
    "createdBy": { "_id": "...", "name": "John", "email": "..." },
    "members": [],
    "isActive": true,
    "createdAt": "2026-01-30T...",
    "updatedAt": "2026-01-30T..."
  }
}
```

#### Flow 2: Add Member to Team
```
POST /api/v1/team/add-member/:teamId
Body: {
  "userId": "user_id_to_add",
  "roleInTeam": "developer"
}

CONTROLLER (addTeamMember):
├─ Find team by ID
├─ Check if user exists
├─ Check if user already in team
├─ Push new member to team.members array:
│  └─ { user: userId, roleInTeam, joinedAt: Date.now(), status: 'active' }
├─ Save team
├─ Send email to new member (optional notification)
└─ Return updated team

RESULT:
Team members array now includes new user
Team.members = [
  { user: userId, roleInTeam: 'developer', status: 'active', ... },
  ...
]
```

#### Flow 3: Create a Project
```
POST /api/v1/project/create-project
Body: {
  "projectName": "E-commerce Platform",
  "description": "Build online store",
  "projectType": "team",
  "teams": ["team_id_1", "team_id_2"]
}

CONTROLLER (createProject):

STEP 1: Validate
├─ projectName required
├─ projectType must be 'team', 'personal', or 'mixed'
├─ If projectType === 'team':
│  └─ teams array required with at least 1 team
├─ If projectType === 'personal':
│  └─ teams array must be empty
└─ If projectType === 'mixed':
   └─ teams array optional

STEP 2: Load Team Data
├─ Find all teams by their IDs
├─ Populate each team's members with user details
└─ Extract all members from all teams (for auto-add)

STEP 3: Create Project
├─ Project {
│  ├─ projectName,
│  ├─ description,
│  ├─ createdBy: req.user._id,
│  ├─ projectManager: req.user._id (creator becomes PM by default),
│  ├─ projectType,
│  ├─ teams: [team IDs],
│  ├─ projectMembers: [  // AUTO-ADD FROM TEAMS
│  │  └─ For each team member, create:
│  │     { user: memberId, roleInProject: 'contributor', addedFromTeam: teamId }
│  │  },
│  └─ taskStatuses: [default To Do, In Progress, Review, Done]
│ }
└─ Save to database

STEP 4: Return
└─ Populated project with all details

RESULT:
All team members automatically become project members
When team members are added/removed later, you may need to sync
```

#### Flow 4: Create a Task
```
POST /api/v1/project/task/create-task
Body: {
  "projectId": "project_id",
  "title": "Implement login page",
  "description": "Create responsive login UI",
  "priority": "high",
  "status": "status_id",  // Reference to one of project.taskStatuses
  "assignees": ["user_id_1", "user_id_2"],
  "dueDate": "2026-02-28"
}

MIDDLEWARE CHAIN:
├─ verifyToken
├─ isProjectMember (user must be member of project)
├─ attachTaskToRequest (load project and validate)
└─ isValidTaskStatus (status must exist in project.taskStatuses)

CONTROLLER (createTask):
├─ Validate all required fields
├─ Validate due date is in future
├─ Verify all assignees are project members
├─ Create Task {
│  ├─ project: projectId,
│  ├─ title,
│  ├─ description,
│  ├─ priority,
│  ├─ status: statusId (ObjectId reference),
│  ├─ assignees: [userIds],
│  ├─ dueDate,
│  ├─ createdBy: req.user._id,
│  └─ order: (auto-calculated based on status)
│ }
├─ Create ActivityLog entry (record that task was created)
└─ Return populated task

RESPONSE:
{
  "_id": "task_id",
  "project": { "_id": "...", "projectName": "..." },
  "title": "Implement login page",
  "priority": "high",
  "status": { "_id": "...", "label": "To Do", "key": "to_do" },
  "assignees": [{ "_id": "...", "name": "John", ... }, ...],
  ...
}
```

### 9. Error Handling (ApiError Class)

All errors follow a standard format:

```javascript
throw new ApiError(statusCode, message, errorsArray);

// Example
throw new ApiError(400, "Invalid email format", [
  { field: "email", issue: "Must be valid email" }
]);
```

**Global Error Handler catches all ApiError instances**:
```javascript
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    errors: err.errors || []
  });
});
```

**Standard Status Codes**:
- 200: Success
- 201: Created
- 400: Bad request (validation error)
- 401: Unauthorized (not logged in)
- 403: Forbidden (logged in but not authorized)
- 404: Not found
- 500: Server error

### 10. Standardized Response Format (ApiResponse Class)

```javascript
class ApiResponse {
  constructor(statusCode, message, data) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;  // Auto-calculated
    this.message = message;
    this.data = data;
  }
}

// Usage
return res.status(200).json(
  new ApiResponse(200, "Operation successful", userData)
);

// Response sent to client
{
  "statusCode": 200,
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### 11. Socket.IO Setup (Real-time Features)

```javascript
// server/socket/index.js
const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
  });

  // Middleware: Verify token on connection
  socketAuth(io);

  io.on("connection", (socket) => {
    console.log("User connected:", socket.user._id);

    // Socket has access to authenticated user
    // Can emit real-time updates:
    socket.emit("task-updated", taskData);

    // Register room handlers (team rooms, project rooms, etc.)
    registerRoomHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
};
```

**Planned Use Cases**:
- 🔔 Real-time task updates (when team member changes task status)
- 💬 Live notifications (task assigned, mentioned in comment)
- 👥 Presence indicators (see who's online)
- 📊 Live activity feeds (show team activity in real-time)

---

## Frontend Deep Dive

### 1. Folder Structure & Responsibilities

```
client/src/
├── main.jsx                 # App entry point - React 19
├── App.jsx                  # Routes & top-level layout
├── index.css                # Global styles
│
├── Redux_Config/            # Global state management
│   ├── store/
│   │   └── Store.js         # Redux store configuration
│   ├── Slices/
│   │   ├── authSlice.js     # User & token state
│   │   ├── teamsSlice.js    # Teams data
│   │   ├── projectsSlice.js # Projects & members
│   │   └── tasksSlice.js    # Tasks state
│   └── Reducers/
│       └── RootReducers.js  # Combine all slices
│
├── services/                # API calls (Axios)
│   ├── authOperations/
│   │   ├── authEndPoints.js # API URLs
│   │   └── authServices.js  # Login, register, forgot password
│   ├── projectsOperations/
│   │   ├── projectEndPoints.js
│   │   └── projectsServices.js
│   ├── taskOperations/
│   │   └── taskServices.js
│   └── teamsOperations/
│       └── teamServices.js
│
├── components/              # Reusable UI components
│   ├── Dashboard.jsx        # Main dashboard
│   ├── Navigation.jsx       # Top navbar
│   ├── DashboardHearderCard.jsx
│   ├── Analytics/           # Chart components
│   ├── kanban/              # Drag-drop task board
│   ├── Lodders/             # Loading spinners
│   ├── modals/              # Modal dialogs
│   ├── ProjectDetails/      # Task view for project
│   ├── projects/            # Project cards, list
│   ├── Settings/            # User settings
│   └── Wrappers/
│       └── ProtectedWrapper.jsx  # Require authentication
│
├── pages/                   # Full page components (combine multiple components)
│   ├── Homepage/
│   │   └── HomePage.jsx     # Login/Register page
│   ├── DashBoard/
│   │   ├── DashboardPage.jsx    # Main layout
│   │   ├── ProjectPage.jsx      # View all projects
│   │   ├── TeamsPage.jsx        # View all teams
│   │   └── Projectdetails.jsx   # Kanban for specific project
│   ├── ForgotPassword/
│   │   ├── ForgotPasswordPage.jsx
│   │   └── ResetPasswordPage.jsx
│   ├── Analytics/
│   │   └── AnalyticsPage.jsx    # Dashboard charts
│   ├── Settings/
│   │   └── SettingsPage.jsx     # User profile, preferences
│   └── NotFoundPage.jsx
│
├── hooks/                   # Custom React hooks
│   └── useAnalyticsData.jsx # Fetch & calculate analytics
│
├── utils/                   # Helper functions
│   ├── axios_instance.js    # Axios configuration
│   └── formatDueDate.js     # Date formatting
│
├── config/                  # App configuration
│   └── priorityConfig.js    # Priority levels (low, medium, high, critical)
│
└── sockets/                 # WebSocket setup
    ├── socket.js            # Socket.IO client initialization
    ├── project.socket.js    # Project room events
    └── task.socket.js       # Task update events
```

### 2. Redux & Global State Management

#### Redux Store Structure

```javascript
// store/Store.js
export const Store = configureStore({
  reducer: rootReducer  // Combines all slices
});

// Reducers/RootReducers.js
export const rootReducer = combineReducers({
  auth: authReducer,        // User & authentication
  teams: teamsReducer,      // Teams data
  projects: projectReducer, // Projects & members
  tasks: taskreducer        // Tasks data
});
```

**Why Redux?**
- ✓ Single source of truth for all data
- ✓ Predictable state changes via actions
- ✓ Time-travel debugging
- ✓ Easy to sync with backend updates
- ✓ Global state accessible anywhere without prop drilling

#### Auth Slice (Most Important)

```javascript
// Redux_Config/Slices/authSlice.js
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: localStorage.getItem("user") ? JSON.parse(...) : null,
    token: localStorage.getItem("token") || null,
    Authloading: false,
    error: null,
    isLogin: false
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    setIsLogin(state, action) {
      state.isLogin = action.payload;
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.isLogin = false;
    }
  }
});
```

**Persistence Strategy**:
- Redux state lives in memory
- Critical data (user, token) also stored in localStorage
- On app refresh: localStorage data restored to Redux
- On logout: Clear both localStorage and Redux

#### Auth Slice Usage

```javascript
// In a component
import { useSelector, useDispatch } from "react-redux";
import { setUser, setToken, clearAuth } from "...authSlice";

export function MyComponent() {
  const dispatch = useDispatch();
  const { user, token, isLogin } = useSelector(state => state.auth);

  const handleLogin = (email, password) => {
    // This dispatches a service function (thunk)
    dispatch(loginUserService(email, password, navigate));
  };

  const handleLogout = () => {
    dispatch(clearAuth());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <>
      {isLogin && <p>Welcome, {user.name}</p>}
    </>
  );
}
```

#### Other Slices (Projects, Teams, Tasks)

```javascript
// projectsSlice.js
const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    allProjects: [],        // All projects user has access to
    myProjects: [],         // Projects created by user
    loading: false,

    selectedProject: {
      id: null,
      data: null,           // Full project with members, tasks, etc.
      loading: false
    },

    projectMembers: {
      list: [],             // Members of selected project
      loading: false
    },

    actions: {              // Loading states for each operation
      creating: false,
      updating: false,
      deleting: false,
      addingMember: false,
      removingMember: false
    }
  },
  reducers: {
    setProjects(state, action) { ... },
    setSelectedProjectData(state, action) { ... },
    addTaskStatusIntoProject(state, action) { ... },
    // ... more reducers
  }
});
```

### 3. Services Layer (API Communication)

#### Service Pattern

```javascript
// services/authOperations/authEndPoints.js
const AUTH_END_POINTS = {
  LOGIN: "/user/login",
  REGISTER: "/user/register",
  LOGOUT: "/user/logout",
  FORGET_PASSWORD: "/user/forgot-password",
  RESET_PASSWORD: "/user/reset-password",
  CHANGE_PASSWORD: "/user/change-password",
  ADD_MEMBER: "/user/add-member"
};

export default AUTH_END_POINTS;
```

```javascript
// services/authOperations/authServices.js
export function loginUserService(email, password, navigate) {
  return async (dispatch) => {  // Returns a thunk
    dispatch(setAuthLoading(true));

    try {
      // Call backend API
      const response = await axiosInstance.post(LOGIN, {
        email,
        password
      }, { withCredentials: true });  // Auto-send cookies

      if (response.data.success) {
        const { token, userdDetailes } = response.data.data;

        // Update Redux state
        dispatch(setUser(userdDetailes));
        dispatch(setToken(token));
        dispatch(setIsLogin(true));

        // Show success toast
        toast.success("Login successful");

        // Navigate to dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      // Show error toast
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      dispatch(setAuthLoading(false));
    }
  };
}
```

**Why this pattern?**
- ✓ Separation of concerns (API logic separate from components)
- ✓ Reusable (same service called from multiple components)
- ✓ Testable (mock service in tests)
- ✓ Loading state management built-in
- ✓ Centralized error handling

#### Axios Instance Configuration

```javascript
// utils/axios_instance.js
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,  // http://localhost:5000/api/v1
  headers: { "Content-Type": "application/json" },
  withCredentials: true  // IMPORTANT: Auto-send cookies with each request
});

export default axiosInstance;
```

**withCredentials: true** means:
- When you make a request to backend, cookies are automatically included
- This is how the JWT token in the httpOnly cookie gets sent
- Backend can also set new cookies in response

### 4. Authentication Flow (Frontend)

#### Login Flow

```
USER VISITS / (HOME PAGE)
└─ Sees Login Form

USER ENTERS EMAIL & PASSWORD & CLICKS LOGIN
└─ onClick handler calls dispatch(loginUserService(email, password, navigate))

SERVICE FUNCTION EXECUTES:
├─ dispatch(setAuthLoading(true))  // Show loading spinner
├─ POST /api/v1/user/login with credentials
├─ Axios auto-includes httpOnly cookie if exists
├─ Backend verifies credentials & returns JWT token + user data
└─ If success:
   ├─ dispatch(setUser(userData))      → localStorage + Redux
   ├─ dispatch(setToken(token))        → localStorage + Redux
   ├─ dispatch(setIsLogin(true))
   ├─ toast.success("Login successful")
   └─ navigate("/dashboard")           → Redirect to dashboard
└─ If error:
   ├─ toast.error("Login failed")
   └─ Stay on login page

USER NAVIGATES TO /DASHBOARD
└─ ProtectedWrapper checks:
   ├─ Does token exist in Redux state?
   ├─ Is token expired? (jwt-decode library)
   └─ If no token or expired: Redirect to / (login)
   └─ If valid: Render dashboard

DASHBOARD LOADS
└─ useEffect fetches user's teams, projects, tasks
└─ Each fetch includes Authorization header with token
└─ Displays user's data
```

#### Session Recovery (Page Refresh)

```
USER REFRESHES BROWSER
└─ main.jsx renders App component
└─ Redux store re-initializes with initialState

authSlice initialState:
├─ user: JSON.parse(localStorage.getItem("user")) || null
├─ token: localStorage.getItem("token") || null
└─ isLogin: false initially

IMMEDIATELY:
└─ Redux state is restored from localStorage
└─ useSelector hooks in components see restored state
└─ ProtectedWrapper sees token exists → renders dashboard
└─ No need to login again!

WHEN MAKING NEXT API CALL:
└─ Axios includes Authorization header with stored token
└─ Backend verifies token is valid
└─ If expired: Backend returns 401 → Frontend redirects to login
```

### 5. Protected Routes (ProtectedWrapper)

```javascript
// components/Wrappers/ProtectedWrapper.jsx
const ProtectedWrapper = ({ children }) => {
  const token = useSelector(state => state.auth.token);

  if (!token) {
    toast.error("Please login to access this page");
    return <Navigate to="/" replace />;
  }

  try {
    // Decode token without verifying signature (client-side only)
    const decodedToken = jwtDecode(token);

    // Check if token is expired
    if (decodedToken.exp * 1000 < Date.now()) {
      toast.error("Session expired. Please login again.");
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    console.error("Invalid token:", error);
    toast.error("Invalid token. Please login again.");
    return <Navigate to="/" replace />;
  }

  // Token is valid → render protected content
  return children;
};
```

**Usage in App.jsx**:
```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedWrapper>
      <DashboardPage />
    </ProtectedWrapper>
  }
>
  {/* Sub-routes */}
</Route>
```

**Token Validation Layers**:
1. Client-side (ProtectedWrapper): Fast check, prevents unnecessary API calls
2. Server-side (verifyToken middleware): Authoritative check, prevents unauthorized access

### 6. Component Architecture

#### Page Components (Pages)
```
Pages are full-page layouts combining multiple sections
Example: DashboardPage.jsx
├─ Imports Navigation.jsx
├─ Imports Dashboard.jsx (main content)
├─ Imports sidebar or breadcrumbs
└─ Uses Outlet for nested routes
```

#### Section Components (Components)
```
Components are reusable sections used within pages
Examples:
├─ Navigation.jsx        → Top navbar (search, user menu)
├─ Dashboard.jsx         → Overview cards, quick stats
├─ ProjectCard.jsx       → Single project card
├─ TaskModal.jsx         → Create/edit task modal
├─ KanbanBoard.jsx       → Drag-drop task management
└─ Analytics/            → Chart components
```

#### Logic Components (Hooks)
```
Custom hooks contain logic, not UI
Example: useAnalyticsData.jsx
├─ Fetches analytics data from backend
├─ Calculates derived metrics
├─ Manages loading states
└─ Returns data for components to render
```

**Why separate logic from UI?**
- ✓ One hook → multiple components can use same logic
- ✓ Easier to test
- ✓ Cleaner component files (less spaghetti code)
- ✓ Logic reusable across pages

### 7. Real-World Component Example

```javascript
// components/ProjectDetails/ProjectKanban.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectTasks } from "...taskServices";
import TaskCard from "./TaskCard";
import TaskModal from "../modals/TaskModal";

export function ProjectKanban() {
  const dispatch = useDispatch();
  
  // Get data from Redux
  const { selectedProject } = useSelector(state => state.projects);
  const { tasks, loading } = useSelector(state => state.tasks);

  // Modal state
  const [showModal, setShowModal] = React.useState(false);

  // On mount, fetch tasks for this project
  useEffect(() => {
    if (selectedProject?.id) {
      dispatch(fetchProjectTasks(selectedProject.id));
    }
  }, [selectedProject?.id]);

  if (loading) return <LoadingSpinner />;

  // Group tasks by status (for Kanban columns)
  const columns = selectedProject.data?.taskStatuses || [];
  
  return (
    <div className="kanban-board">
      {columns.map(column => (
        <div key={column._id} className="kanban-column">
          <h3>{column.label}</h3>
          
          {/* Tasks in this column */}
          {tasks
            .filter(task => task.status._id === column._id)
            .map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onClick={() => setShowModal(true)}
              />
            ))}
          
          {/* Add task button */}
          <button onClick={() => setShowModal(true)}>
            + Add Task
          </button>
        </div>
      ))}

      {/* Task creation modal */}
      {showModal && (
        <TaskModal
          projectId={selectedProject.id}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            dispatch(fetchProjectTasks(selectedProject.id));
          }}
        />
      )}
    </div>
  );
}
```

### 8. Styling (Tailwind CSS)

```javascript
// Tailwind configuration
// Uses utility-first CSS: className="bg-blue-500 p-4 rounded-lg"

// Benefits:
// ✓ No CSS file context switching
// ✓ Consistent spacing, colors, breakpoints
// ✓ Mobile-first responsive design
// ✓ Dark mode support
// ✓ Smaller bundle size (tree-shaking)

// Global styles (index.css)
// ├─ CSS resets
// ├─ Custom color palette
// ├─ Custom fonts
// └─ Shared component styles

// Component styles (inline classes)
// ├─ Most styling done with utility classes
// └─ Rarely need external CSS files
```

---

## Complete User Flows

### 🔐 Flow 1: User Registration & First Login

#### Step 1: User Visits Homepage
```
Frontend:
- GET http://localhost:5173/
- App.jsx renders HomePage component
- HomePage shows login form + register link
```

#### Step 2: User Clicks "Create Account"
```
Frontend:
- Form with fields: name, email, password, confirm password
- On submit: Call registerUserService(name, email, password)
- Show loading spinner

Service:
- dispatch(setAuthLoading(true))
- POST /api/v1/user/register { name, email, password, role: "member" }
- Axios sends request with JSON body

Backend (Server):
- Request arrives at POST /api/v1/user/register
- Middleware chain:
  └─ cors() ✓ check origin allowed
  └─ express.json() ✓ parse body
  └─ No auth required for registration
- Controller (registerUser):
  ├─ Validate name, email, password not empty
  ├─ Check if email already exists in database
  ├─ If exists: throw ApiError(401, "user already registered")
  ├─ Hash password: bcrypt.hash(password, 10)
  ├─ Create user:
  │  └─ db.User.create({
  │     name,
  │     email,
  │     password: hashedPassword,
  │     role: "member",
  │     createdBy: null (self-registered)
  │  })
  ├─ Load user from DB (exclude password field)
  └─ Return ApiResponse(200, "user registered successfully", userData)

Frontend:
- Service receives success response
- dispatch(setUser(userData))  → Store in Redux + localStorage
- toast.success("Registration successful")
- navigate("/dashboard")

Backend:
User document now in database:
{
  "_id": "user_123",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$...hashed...",  // Bcrypt hash
  "role": "member",
  "createdBy": null,
  "createdAt": "2026-01-30T10:00:00Z"
}
```

#### Step 3: Login
```
Frontend:
- User visits /
- Enters email + password
- Calls loginUserService(email, password, navigate)

Service:
- POST /api/v1/user/login { email, password }

Backend:
- Request → verifyToken not needed (anyone can login)
- Controller (loginUser):
  ├─ Validate email and password not empty
  ├─ Find user by email
  ├─ Use bcrypt.compare(submittedPassword, storedHash)
  ├─ If no match: throw ApiError(400, "invalid credentials")
  ├─ Create JWT token:
  │  └─ jwt.sign(
  │     { _id, name, email, role },
  │     process.env.JWT_SECRET,
  │     { expiresIn: "7d" }
  │  )
  ├─ Set HTTP-only cookie: token=<jwt>
  └─ Return { token, userdDetailes }

Frontend:
- dispatch(setToken(token))           → Redux + localStorage
- dispatch(setIsLogin(true))
- navigate("/dashboard")
- Dashboard loads with user data
```

**Why not store token in database?**
- JWT is stateless (doesn't require database lookup)
- Token carries its own payload (user ID, role, expiration)
- Backend only needs to verify signature, not look up token
- Scales better (no database queries for every request)

---

### 👥 Flow 2: Create Team & Add Members

#### Prerequisites
- User must be logged in
- User must have admin or super_admin role

#### Step 1: Navigate to Teams Page
```
Frontend:
- GET /dashboard/teams
- Renders TeamsPage component
- Shows list of existing teams + "Create Team" button
```

#### Step 2: Create Team
```
Frontend Dialog/Modal:
- Form with: Team Name, Description
- Click "Create"
- Calls createTeamService(teamName, description)

Service:
- dispatch(setTeamsLoading(true))
- POST /api/v1/team/create-team { teamName, description }

Backend:
- Request → /api/v1/team/create-team
- Middleware:
  └─ verifyToken:
     ├─ Extract token from cookie or Authorization header
     ├─ Verify JWT signature with JWT_SECRET
     ├─ Attach to req.user = { _id, name, email, role }
  └─ No role check (anyone logged in can create)
- Controller (createNewTeam):
  ├─ Validate teamName and description
  ├─ Check teamName unique in database
  ├─ Create:
  │  └─ db.Team.create({
  │     teamName,
  │     description,
  │     createdBy: req.user._id,  // Authenticated user
  │     members: [],              // Empty initially
  │     isActive: true
  │  })
  ├─ Populate references
  └─ Return ApiResponse(201, "Team created successfully", teamDoc)

Frontend:
- Service receives team data
- dispatch(setTeams([...teams, newTeam]))  → Add to Redux
- Modal closes
- New team appears in teams list
- Toast: "Team created successfully"
```

**Database Result**:
```javascript
{
  "_id": "team_456",
  "teamName": "Backend Team",
  "description": "All backend developers",
  "createdBy": "user_123",
  "members": [],  // Empty until members added
  "isActive": true,
  "createdAt": "2026-01-30T11:00:00Z"
}
```

#### Step 3: Add Member to Team
```
Frontend:
- View team details
- See "Add Member" button
- Opens modal with user search dropdown
- Select user + role
- Click "Add"
- Calls addTeamMemberService(teamId, userId, roleInTeam)

Service:
- POST /api/v1/team/add-member/:teamId
  Body: { userId, roleInTeam: "developer" }

Backend:
- Request → /api/v1/team/add-member/team_456
- Middleware:
  └─ verifyToken: req.user = authenticated user
- Controller (addTeamMember):
  ├─ Find team by ID
  ├─ Validate user exists
  ├─ Check user not already in team
  ├─ Push to members array:
  │  └─ team.members.push({
  │     user: userId,
  │     roleInTeam: "developer",
  │     joinedAt: Date.now(),
  │     status: "active"
  │  })
  ├─ Save team
  ├─ Send email notification (optional)
  │  └─ "You've been added to Backend Team"
  └─ Return updated team

Frontend:
- dispatch(setTeams([updated teams]))
- toast.success("Member added")
```

**Database Result**:
```javascript
{
  "_id": "team_456",
  "teamName": "Backend Team",
  "members": [
    {
      "user": "user_789",
      "roleInTeam": "developer",
      "joinedAt": "2026-01-30T11:05:00Z",
      "status": "active"
      // Note: No _id field (embedded sub-schema)
    }
  ]
}
```

---

### 📊 Flow 3: Create Project & Auto-Add Team Members

#### Prerequisites
- User must be logged in
- Teams must exist (if projectType is "team")

#### Step 1: Navigate to Projects
```
Frontend:
- GET /dashboard/projects
- Shows all projects user has access to
- "Create Project" button visible
```

#### Step 2: Create Project
```
Frontend Modal:
- Fields:
  ├─ Project Name (required)
  ├─ Description (optional)
  ├─ Project Type (team / personal / mixed) (required)
  └─ If type is "team" or "mixed":
     └─ Select Teams to include
- Click "Create"
- Calls createProjectService(projectData)

Service:
- dispatch(setProjectsLoading(true))
- POST /api/v1/project/create-project
  Body: {
    projectName: "E-commerce",
    description: "Build online store",
    projectType: "team",
    teams: ["team_456", "team_789"]
  }

Backend:
- Request → /api/v1/project/create-project
- Middleware:
  └─ verifyToken: req.user = authenticated user
- Controller (createProject):

  STEP 1: Validation
  ├─ projectName required
  ├─ projectType in ["team", "personal", "mixed"]
  ├─ If type === "team": teams array required with ≥1 team
  ├─ If type === "personal": teams array must be empty
  └─ If type === "mixed": teams array optional

  STEP 2: Fetch Teams & Members
  ├─ For each team ID in request:
  │  └─ db.Team.findById(teamId).populate("members.user")
  ├─ Extract all members from all teams
  └─ Flatten to unique users

  STEP 3: Create Project
  ├─ db.Project.create({
  │  projectName,
  │  description,
  │  createdBy: req.user._id,
  │  projectManager: req.user._id,  // Creator is PM
  │  projectType: "team",
  │  teams: ["team_456", "team_789"],
  │
  │  // AUTO-ADD TEAM MEMBERS
  │  projectMembers: [
  │    {
  │      user: "user_789",
  │      roleInProject: "contributor",
  │      addedFromTeam: "team_456",  // Track which team
  │      addedAt: Date.now(),
  │      status: "active",
  │      taskStatuses: ["To Do", "In Progress", "Review", "Done"]
  │    },
  │    {
  │      user: "user_890",
  │      roleInProject: "contributor",
  │      addedFromTeam: "team_789",
  │      ...
  │    }
  │  ],
  │
  │  // DEFAULT TASK STATUSES
  │  taskStatuses: [
  │    {
  │      key: "to_do",
  │      label: "To Do",
  │      order: 1,
  │      isDefault: true
  │    },
  │    {
  │      key: "in_progress",
  │      label: "In Progress",
  │      order: 2,
  │      isDefault: true
  │    },
  │    {
  │      key: "review",
  │      label: "Review",
  │      order: 3,
  │      isDefault: true
  │    },
  │    {
  │      key: "done",
  │      label: "Done",
  │      order: 4,
  │      isDefault: true
  │    }
  │  ],
  │  status: "active"
  │ })
  ├─ Populate all references
  └─ Return ApiResponse(201, "Project created successfully", projectDoc)

Frontend:
- dispatch(setProjects([...projects, newProject]))
- dispatch(setSelectedProjectData(projectDoc))
- toast.success("Project created")
- Navigate to project Kanban view
```

**Database Result**:
```javascript
{
  "_id": "project_111",
  "projectName": "E-commerce",
  "description": "Build online store",
  "createdBy": "user_123",  // Who created
  "projectManager": "user_123",  // Who's in charge
  "projectType": "team",
  "teams": ["team_456", "team_789"],  // Which teams are involved
  
  // All team members automatically added
  "projectMembers": [
    {
      "user": "user_789",  // From team_456
      "roleInProject": "contributor",
      "addedFromTeam": "team_456",
      "status": "active",
      "taskStatuses": ["To Do", "In Progress", "Review", "Done"]
    },
    {
      "user": "user_890",  // From team_789
      "roleInProject": "contributor",
      "addedFromTeam": "team_789",
      "status": "active",
      "taskStatuses": ["To Do", "In Progress", "Review", "Done"]
    }
  ],
  
  // Kanban columns
  "taskStatuses": [
    { key: "to_do", label: "To Do", order: 1 },
    { key: "in_progress", label: "In Progress", order: 2 },
    { key: "review", label: "Review", order: 3 },
    { key: "done", label: "Done", order: 4 }
  ],
  
  "status": "active",
  "createdAt": "2026-01-30T12:00:00Z"
}
```

#### Step 4: Sync Members (Later)
```
If you add new members to the team AFTER creating the project:
- User clicks "Sync Members" button
- Backend query finds team members not yet in project
- Adds them to project.projectMembers
- Frontend updates to show new members
```

---

### ✅ Flow 4: Create Task & Track Progress

#### Prerequisites
- Project exists
- User is member of project

#### Step 1: Navigate to Project Kanban
```
Frontend:
- GET /dashboard/projects/task/:projectId
- Renders ProjectDetails component
- Shows Kanban board with columns (To Do, In Progress, Review, Done)
- Each column displays tasks in that status
```

#### Step 2: Create Task
```
Frontend:
- Click "+ Add Task" button in "To Do" column
- Modal opens with form:
  ├─ Title (required, min 5 chars)
  ├─ Description (optional)
  ├─ Priority (low/medium/high/critical)
  ├─ Assignees (select one or more team members)
  └─ Due Date (optional, must be future date)
- Click "Create Task"
- Calls createTaskService(taskData)

Service:
- dispatch(setTasksLoading(true))
- POST /api/v1/project/task/create-task
  Body: {
    projectId: "project_111",
    title: "Implement user authentication",
    description: "JWT-based login system",
    priority: "high",
    status: "status_id_1",  // First column ID (To Do)
    assignees: ["user_789", "user_890"],
    dueDate: "2026-02-15"
  }

Backend:
- Request → /api/v1/project/task/create-task
- Middleware chain:
  ├─ verifyToken: req.user attached
  ├─ attachTaskToRequest: Load project, validate
  ├─ isProjectMember: Check req.user is project member
  └─ isValidTaskStatus: Check status ID exists in project
- Controller (createTask):
  ├─ Validate title (required, ≥5 chars)
  ├─ Validate priority (low/medium/high/critical)
  ├─ Validate status ID exists in project.taskStatuses
  ├─ Validate due date in future
  ├─ Validate all assignees are project members
  ├─ Create task:
  │  └─ db.Task.create({
  │     project: projectId,
  │     title: "Implement user authentication",
  │     description: "JWT-based login system",
  │     priority: "high",
  │     status: statusObjectId,  // Reference to taskStatus._id
  │     assignees: [userId1, userId2],
  │     dueDate: "2026-02-15",
  │     createdBy: req.user._id,
  │     order: 1  // First in this status
  │  })
  ├─ Create activity log:
  │  └─ ActivityLog.create({
  │     task: taskId,
  │     actionType: "created",
  │     changedBy: req.user._id,
  │     description: "Task created"
  │  })
  ├─ Populate references
  └─ Return ApiResponse(201, "Task created successfully", taskDoc)

Frontend:
- Service receives task
- dispatch(setTasks([...tasks, newTask]))
- Modal closes
- Task appears in Kanban board
- If assignees online: Real-time notification via Socket.IO
- toast.success("Task created")
```

**Database Result**:
```javascript
Task {
  "_id": "task_222",
  "project": "project_111",
  "title": "Implement user authentication",
  "description": "JWT-based login system",
  "priority": "high",
  "status": "status_id_1",  // ObjectId reference to taskStatus in project
  "assignees": ["user_789", "user_890"],
  "dueDate": "2026-02-15T00:00:00Z",
  "order": 1,
  "createdBy": "user_123",
  "createdAt": "2026-01-30T13:00:00Z"
}

ActivityLog {
  "task": "task_222",
  "actionType": "created",
  "changedBy": "user_123",
  "description": "Task created",
  "createdAt": "2026-01-30T13:00:00Z"
}
```

#### Step 3: Drag Task to "In Progress"
```
Frontend:
- User drags task from "To Do" to "In Progress" column
- @dnd-kit library handles drag-drop UI
- On drop:
  ├─ Calculate new order (position in column)
  └─ Call updateTaskStatusService(taskId, newStatusId, newOrder)

Service:
- PATCH /api/v1/project/task/:taskId
  Body: { status: newStatusId, order: newOrder }

Backend:
- Middleware: verifyToken, isProjectMember, isTaskAssignee (can update own task)
- Controller (updateTask):
  ├─ Find task
  ├─ Verify new status ID exists in project
  ├─ Update:
  │  └─ task.status = newStatusId
  │     task.order = newOrder
  │     task.save()
  ├─ Create activity log:
  │  └─ ActivityLog.create({
  │     task: taskId,
  │     actionType: "status_changed",
  │     changedBy: req.user._id,
  │     oldValue: "to_do",
  │     newValue: "in_progress"
  │  })
  ├─ Emit Socket event: "task-updated"
  │  └─ All team members see update in real-time
  └─ Return updated task

Frontend:
- Task moves to new column visually
- Activity log updates in real-time if connected via Socket.IO
- No page refresh needed
```

#### Step 4: Mark Task as Done
```
Same flow as Step 3, but user drags to "Done" column

When task status = "done":
- Backend can:
  ├─ Check if all subtasks are complete
  ├─ Update project progress percentage
  └─ Notify team members
```

**Task Status Tracking**:
```javascript
Task can be in states:
├─ To Do (default)
├─ In Progress (work started)
├─ Review (waiting for approval)
└─ Done (completed)

Each status is customizable per project:
- Projects can add custom statuses
- Drag-drop order determines Kanban column order
- Tasks sort by "order" field within each column
```

---

### 📈 Flow 5: View Analytics & Project Progress

#### Prerequisites
- Project exists with tasks

#### Step 1: Navigate to Analytics
```
Frontend:
- GET /dashboard/analytics
- Renders AnalyticsPage component
- Shows charts + metrics
```

#### Step 2: Fetch Analytics Data
```
Frontend Component (AnalyticsPage.jsx):
- On mount, calls useAnalyticsData hook

Hook (useAnalyticsData.jsx):
- Fetches:
  ├─ All projects (or selected project)
  ├─ All tasks in projects
  ├─ All users
  └─ Team information

- Calculates metrics:
  ├─ Total tasks, completed tasks, pending tasks
  ├─ Tasks per status (pie chart)
  ├─ Tasks per assignee (bar chart)
  ├─ Project progress % (completed / total * 100)
  ├─ Team productivity (tasks closed per week)
  ├─ Overdue tasks (due date < today)
  └─ Average task completion time

- Returns { data, loading, error }

Component:
- Displays using Recharts library:
  ├─ <PieChart> for task distribution by status
  ├─ <BarChart> for tasks per team member
  ├─ <LineChart> for completion over time
  ├─ <Cards> for key metrics
  └─ <Table> for task details

Examples:
┌─────────────────────────────────────┐
│         Tasks Distribution          │
├─────────────────────────────────────┤
│  To Do: 5 (25%)  |████░░░░░░░░░░░░│
│  In Progress: 8  |████████░░░░░░░░│
│  Review: 3 (15%) |███░░░░░░░░░░░░│
│  Done: 12 (60%)  |████████████░░░░│
└─────────────────────────────────────┘

Project Progress:
┌─────────────────────────────────────┐
│  Project A: 12/20 tasks done        │
│  ████████░░░░░░░░░░ 60%            │
│  Expected completion: 2026-02-10    │
└─────────────────────────────────────┘
```

**Backend Support** (if API-driven):
```
GET /api/v1/project/:projectId/analytics
Response: {
  totalTasks: 28,
  completedTasks: 12,
  pendingTasks: 16,
  tasksByStatus: {
    to_do: 5,
    in_progress: 8,
    review: 3,
    done: 12
  },
  tasksByAssignee: {
    user_789: { assigned: 5, completed: 3 },
    user_890: { assigned: 7, completed: 4 }
  },
  projectProgress: 42.8,  // %
  overdueTasks: 2,
  teamCapacity: 85  // %
}
```

---

## Developer Flow & Patterns

### 1. How to Understand This Codebase

#### First Day: Architecture Overview
```
1. Read this document (you're doing it!)
2. Read server/index.js → understand entry point
3. Read server/app.js → understand middleware & routing
4. Read client/src/main.jsx → understand frontend bootstrap
5. Read client/src/App.jsx → understand routing structure
```

#### Second Day: Authentication
```
1. Read server/models/user.models.js → user structure
2. Read server/controllers/user.controllers.js → login/register logic
3. Read server/middlewares/authMiddlewares/verifyToken.middlewares.js
4. Read client/src/Redux_Config/Slices/authSlice.js → state
5. Read client/src/services/authOperations/authServices.js → API calls
6. Trace: loginForm → loginUserService → backend → response
```

#### Third Day: Team Management
```
1. Read server/models/team.models.js
2. Read server/controllers/team.controllers.js
3. Read server/routes/team.routes.js
4. Follow code flow for: createNewTeam → addTeamMember
5. Understand embedded members sub-schema
```

#### Fourth Day: Projects & Tasks
```
1. Read server/models/project.models.js
2. Read server/models/Task models/task.models.js
3. Read server/controllers/projectControllers/
4. Understand projectMembers embedding
5. Understand taskStatuses embedding
6. Trace: Create project → auto-add members → create task
```

#### Fifth Day: Frontend State Management
```
1. Read Redux slices (projects, tasks, teams)
2. Understand flow: Component → Service → API → Redux → Component re-render
3. Practice creating a new feature following the pattern
```

### 2. CRITICAL Patterns You MUST Follow

#### Pattern 1: Error Handling
```javascript
// ❌ WRONG: Throwing plain Error
throw new Error("User not found");

// ✅ CORRECT: Use ApiError with status code
throw new ApiError(404, "User not found");

// ❌ WRONG: Returning error directly
res.send({ error: "Something failed" });

// ✅ CORRECT: Use global error handler
throw new ApiError(500, "Database error");

// The global error handler catches it and sends standard response
```

#### Pattern 2: Response Format
```javascript
// ❌ WRONG: Custom response format
res.json({ data: userData, ok: true });

// ✅ CORRECT: Use ApiResponse
res.status(200).json(
  new ApiResponse(200, "User fetched successfully", userData)
);

// Frontend expects:
{
  "statusCode": 200,
  "success": true,
  "message": "...",
  "data": {}
}
```

#### Pattern 3: Async/Await + Error Handling
```javascript
// ❌ WRONG: Not handling errors
const user = await User.findById(userId);
res.json(new ApiResponse(200, "Success", user));

// ✅ CORRECT: Wrapped in asyncHandler
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.json(new ApiResponse(200, "Success", user));
});

// asyncHandler catches errors and passes to error handler middleware
```

#### Pattern 4: Middleware Chain
```javascript
// ❌ WRONG: Forgetting required middleware
router.post("/create", updateProject);

// ✅ CORRECT: Include all needed middleware
router.post("/create",
  verifyToken,           // Verify user is logged in
  roleChecker(['admin']), // Verify user has permission
  updateProject          // Actual controller
);

// ORDER MATTERS:
// verifyToken MUST come before roleChecker
// Both MUST come before controller
```

#### Pattern 5: Redux Service Functions (Thunks)
```javascript
// ❌ WRONG: Calling dispatch in component directly
const handleLogin = async () => {
  const response = await axiosInstance.post("/login", ...);
  dispatch(setUser(response.data));
};

// ✅ CORRECT: Create service function
export function loginUserService(email, password, navigate) {
  return async (dispatch) => {
    dispatch(setAuthLoading(true));
    try {
      const response = await axiosInstance.post("/login", {...});
      if (response.data.success) {
        dispatch(setUser(...));
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      dispatch(setAuthLoading(false));
    }
  };
}

// Usage in component
dispatch(loginUserService(email, password, navigate));
```

#### Pattern 6: Embedded Documents vs References
```javascript
// ✅ CORRECT USAGE:

// Embedded (team members) - small, denormalized
const memberSubSchema = new mongoose.Schema({
  user: { type: ObjectId, ref: "User" },    // Still reference for population
  roleInTeam: String,
  status: String,
  // NO _id field
}, { _id: false });

// Use when:
// ✓ Small data (< 100 items)
// ✓ Accessed together (team + members)
// ✓ Updated rarely
// ✓ Queries often need both

// Reference (project.teams) - large, normalized
const projectSchema = new mongoose.Schema({
  teams: [{ type: ObjectId, ref: "Team" }],  // Reference only
});

// Use when:
// ✓ Large data (100+ items)
// ✓ Accessed separately
// ✓ Updated frequently
// ✓ Reduces memory footprint
```

#### Pattern 7: Populating References
```javascript
// ❌ WRONG: Forgetting to populate
const project = await Project.findById(projectId);
// project.createdBy is just an ObjectId

// ✅ CORRECT: Populate needed fields
const project = await Project.findById(projectId)
  .populate("createdBy", "name email")      // User who created
  .populate("projectManager", "name email")  // PM name
  .populate("projectMembers.user", "name email role");  // Nested populate

// Response includes full user objects, not just IDs
```

#### Pattern 8: Validation Before Database Operations
```javascript
// ✅ CORRECT ORDER:
const createTask = asyncHandler(async (req, res) => {
  // STEP 1: Validate input
  if (!title || !projectId) {
    throw new ApiError(400, "Required fields missing");
  }

  // STEP 2: Query database (only after validation passes)
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // STEP 3: Validate fetched data
  const status = project.taskStatuses.find(s => s._id === statusId);
  if (!status) {
    throw new ApiError(400, "Invalid status");
  }

  // STEP 4: Create record
  const task = await Task.create({...});

  // STEP 5: Return response
  res.status(201).json(new ApiResponse(201, "Success", task));
});
```

#### Pattern 9: Redux State Organization
```javascript
// ✅ CORRECT: Organized slice structure
const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    // Data sections
    allProjects: [],
    myProjects: [],
    selectedProject: { id: null, data: null },
    projectMembers: { list: [] },

    // Loading sections
    loading: false,
    myLoading: false,
    actions: {
      creating: false,
      updating: false,
      deleting: false
    },

    // Error section
    error: null
  },
  reducers: {
    // ... reducers
  }
});

// Benefits:
// ✓ Easy to see all loading states
// ✓ Data organized by logical groups
// ✓ Errors centralized
// ✓ Scales well as app grows
```

#### Pattern 10: Protected Routes with Token Validation
```javascript
// ✅ CORRECT: Multi-layer validation
<Route
  path="/dashboard"
  element={
    <ProtectedWrapper>  {/* Layer 1: Check token exists */}
      <PermissionWrapper>  {/* Layer 2: Check role */}
        <DashboardPage />
      </PermissionWrapper>
    </ProtectedWrapper>
  }
/>

// Layer 1: ProtectedWrapper
// ├─ Check token in Redux
// ├─ Decode token & check expiration
// └─ Redirect to login if invalid

// Layer 2: Backend verification
// ├─ verifyToken middleware
// ├─ Check signature validity
// └─ Reject if server-side revocation list exists
```

### 3. Where to Add New Features Safely

#### Adding a New Endpoint (Backend)

```
1. Create/extend model: server/models/
2. Create controller: server/controllers/
3. Add route: server/routes/
4. Test with Postman
5. Connect frontend service when ready

Example: Add "export project as PDF" endpoint
├─ No model changes needed
├─ Controller: server/controllers/projectControllers/
│  └─ Add exportProjectAsPDF function
├─ Route: server/routes/project.routes.js
│  └─ POST /api/v1/project/:projectId/export-pdf
└─ Test: curl -X POST http://localhost:5000/api/v1/project/123/export-pdf
```

#### Adding a New Frontend Page

```
1. Create page component: client/src/pages/NewPage/
2. Create Redux slice (if needed): client/src/Redux_Config/Slices/
3. Create services: client/src/services/newPageOperations/
4. Add route: client/src/App.jsx
5. Create components: client/src/components/
6. Add navigation link: client/src/components/Navigation.jsx

Example: Add "Time Tracking" page
├─ client/src/pages/TimeTracking/TimeTrackingPage.jsx
├─ client/src/Redux_Config/Slices/timeSlice.js
├─ client/src/services/timeOperations/timeServices.js
├─ Add route in App.jsx
├─ Create TimeCard, TimeLog components
└─ Add "Time Tracking" link to Navigation
```

#### Common Mistakes to Avoid

```javascript
// ❌ MISTAKE 1: Not handling loading states
// User clicks button multiple times while loading
// Multiple requests sent, causing race conditions

// ✅ FIX: Check loading state before allowing action
<button 
  onClick={handleCreate}
  disabled={isLoading}
>
  {isLoading ? "Creating..." : "Create"}
</button>

// ❌ MISTAKE 2: Not validating on frontend before API call
// Sends invalid data to backend
// Wastes bandwidth

// ✅ FIX: Validate before sending
if (!email.includes("@")) {
  toast.error("Invalid email");
  return;
}
dispatch(loginUserService(email, password, navigate));

// ❌ MISTAKE 3: Not handling errors from API
// User doesn't know what went wrong
// Silent failures lead to confusion

// ✅ FIX: Always show error toast
catch (error) {
  const message = error.response?.data?.message || "Unknown error";
  toast.error(message);
}

// ❌ MISTAKE 4: Modifying Redux state directly
// Redux DevTools can't track changes
// Makes debugging impossible

// ✅ FIX: Use reducers to modify state
dispatch(setProjects(newProjects));  // ✓ Good
state.projects.push(newProject);     // ✗ Bad

// ❌ MISTAKE 5: Not using uniqueId for map keys
// React can't track updates properly
// Drag-drop and animations break

// ✅ FIX: Use unique identifier
{tasks.map(task => (
  <TaskCard key={task._id} task={task} />  // ✓ Good
))}

// ❌ MISTAKE 6: Not closing DB connections in cleanup
// Memory leaks, connection exhaustion

// ✅ FIX: Use try-finally or asyncHandler
const getUser = asyncHandler(async (req, res) => {
  // Connection auto-managed by Mongoose
  const user = await User.findById(userId);
  res.json(new ApiResponse(200, "Success", user));
});

// ❌ MISTAKE 7: Exposing sensitive data in responses
// Password hashes, tokens in API responses

// ✅ FIX: Use select("-password") and omit sensitive fields
const user = await User.findById(userId).select("-password");
res.json(new ApiResponse(200, "Success", user));
```

---

## What's Complete ✅

### Backend Features

#### Authentication System (✅ Complete)
- User registration with role assignment
- Login with JWT + HTTP-only cookie
- Password hashing with bcryptjs
- Token verification middleware
- Role-based access control (admin, member, super_admin)
- Forgot password + reset password flow
- Change password functionality

#### Team Management (✅ Complete)
- Create teams
- Add/remove team members
- Update member roles within team
- Team member status tracking (active/inactive)
- Fetch teams by user
- Team details + member list

#### Project Management (✅ Complete)
- Create projects (team/personal/mixed types)
- Auto-add team members to projects
- Project member management (add/remove/update)
- Project status tracking (active/onhold/completed/archived)
- Project manager assignment
- Sync team members to project
- Custom task statuses per project (Kanban columns)
- Project details fetching

#### Task Management (✅ In Progress)
- Create tasks with title, description, priority, due date
- Assign tasks to one or multiple users
- Task status updates (drag-drop compatible)
- Task ordering within status (for Kanban)
- Task deletion
- Subtask management

#### Activity & Audit (✅ In Progress)
- Activity log for task changes
- Track who made changes and when
- Log action types (created, updated, status_changed, etc.)
- Attachment tracking

#### Real-Time Features (🚀 Planned)
- Socket.IO server initialization
- Socket authentication middleware
- Room-based events ready for implementation
- Event handlers stubbed out

### Frontend Features

#### Authentication (✅ Complete)
- Login page with form validation
- Registration page
- Forgot password flow
- Reset password page
- Session persistence (localStorage + Redux)
- Protected routes with token validation
- Automatic logout on token expiration
- Toast notifications for feedback

#### Navigation & Layout (✅ Complete)
- Top navigation bar with user menu
- Sidebar/navigation structure
- Dashboard home page
- Responsive design with Tailwind

#### Team Management (✅ In Progress)
- View all teams
- Create new team modal
- View team members
- Add members to team
- Update member roles

#### Project Management (✅ In Progress)
- View all projects
- View "my projects" (created by user)
- Create project modal
- Project type selection
- Team assignment for projects
- Project member list view
- Add/remove project members

#### Kanban Board (✅ In Progress)
- Drag-drop task management with @dnd-kit
- Kanban columns based on taskStatuses
- Create tasks within columns
- Visual task cards with priority color coding
- Task assignment display

#### Analytics Dashboard (🚀 Partially Done)
- Chart components with Recharts
- Hook for analytics data fetching
- Placeholder for metrics display

---

## What's Missing ❌

### Critical Backend Features

#### 1. Task Operations API
```
Missing endpoints:
├─ PATCH /api/v1/project/task/:taskId/status  (update task status + order)
├─ DELETE /api/v1/project/task/:taskId
├─ GET /api/v1/project/task (search, filter, sort tasks)
├─ PATCH /api/v1/project/task/:taskId/assignees
└─ GET /api/v1/project/:projectId/tasks (get tasks for project)

Current issue:
- Create task exists but status updates not properly tested
- No way to bulk update task ordering when dragging
```

#### 2. Task Comments & Activity
```
Missing:
├─ POST /api/v1/project/task/:taskId/comment (add comment)
├─ GET /api/v1/project/task/:taskId/activity (activity log)
├─ DELETE /api/v1/project/task/:taskId/comment/:commentId
└─ Real-time activity feed via Socket.IO

Current issue:
- ActivityLog model exists but endpoints not implemented
- No way for team members to discuss tasks
```

#### 3. File Uploads
```
Missing complete implementation:
├─ Multer middleware exists but not fully integrated
├─ Cloudinary integration stubbed
├─ POST /api/v1/project/task/:taskId/upload endpoint incomplete
├─ No file download endpoints
└─ No file deletion

Current issue:
- Route exists: /api/v1/project/task/upload
- Controller incomplete
- Cloudinary credentials needed in .env
```

#### 4. Real-Time Updates (Socket.IO)
```
Missing implementation:
├─ registerRoomHandlers() needs task event handlers
├─ Task update events ("task-created", "task-updated", "task-deleted")
├─ Comment notifications in real-time
├─ User presence tracking
└─ Live activity stream

Current issue:
- Socket infrastructure ready but events not implemented
- No real-time updates between team members
```

#### 5. Analytics Data API
```
Missing endpoints:
├─ GET /api/v1/project/:projectId/analytics
├─ GET /api/v1/team/:teamId/analytics
├─ GET /api/v1/user/dashboard-metrics
└─ Time-based metrics (weekly, monthly trends)

Current issue:
- No backend aggregation for charts
- Frontend can't fetch pre-calculated metrics
```

#### 6. Search & Filtering
```
Missing:
├─ Full-text search for tasks
├─ Filter tasks by: assignee, priority, status, due date
├─ Search teams by name
├─ Search projects by name
└─ Pagination for large datasets

Current issue:
- Fetches all data → frontend filters locally
- Doesn't scale with large projects
```

#### 7. Email Notifications
```
Missing:
├─ SendGrid integration incomplete
├─ Email on task assignment
├─ Email on task status change
├─ Email on comment mention (@user)
├─ Daily summary emails
└─ Notification preferences/unsubscribe

Current issue:
- Templates exist: forgotPasswordMail, team_member_added_email
- Most notification emails not triggered
```

#### 8. User Profile & Settings
```
Missing endpoints:
├─ GET /api/v1/user/profile
├─ PATCH /api/v1/user/profile (update name, email)
├─ PATCH /api/v1/user/preferences (notification settings)
├─ DELETE /api/v1/user/account
└─ List all users (for admin)

Current issue:
- User exists but no profile update endpoint
- No user preferences/settings persistence
```

#### 9. Validation & Constraints
```
Issues:
├─ No unique constraint on project name per user
├─ No validation on teamName update (could create duplicates)
├─ No constraint checking task assignees exist
├─ Soft deletes not implemented (hard deletes lose data)
└─ No archival strategy for old projects/tasks
```

#### 10. Error Handling Edge Cases
```
Missing handling:
├─ Concurrent requests (race conditions)
├─ Network timeouts
├─ Database connection failures
├─ Large payload handling
├─ Rate limiting to prevent abuse
└─ Input sanitization (XSS prevention)
```

### Critical Frontend Features

#### 1. Complete Kanban Board
```
Missing:
├─ ✓ Drag-drop works visually
├─ ❌ Syncs to backend on drop
├─ ❌ Optimistic updates
├─ ❌ Undo/redo for drag operations
└─ ❌ Multi-column operations

Current issue:
- Kanban component exists but doesn't persist changes
```

#### 2. Task Modal / Task Details Panel
```
Missing:
├─ Full task details view
├─ Edit task modal
├─ Subtask creation & management
├─ Add comments to task
├─ View activity log
├─ Bulk operations (assign, change priority, etc.)
└─ Task attachments section

Current issue:
- Task creation modal exists
- No way to view/edit created tasks
```

#### 3. Analytics Page
```
Missing implementation:
├─ ✓ Chart components exist (from Recharts)
├─ ❌ Fetch analytics data from backend
├─ ❌ Display metrics
├─ ❌ Filter by date range
├─ ❌ Compare metrics (week-over-week, etc.)
└─ ❌ Export analytics as PDF/CSV

Current issue:
- Hook useAnalyticsData exists but not connected to API
- Charts rendered but no real data
```

#### 4. Settings Page
```
Missing:
├─ User profile management
├─ Change password form
├─ Notification preferences
├─ API integration for settings save
├─ Profile picture upload
└─ Account deletion

Current issue:
- Settings page exists but is empty
- No backend endpoints to save settings
```

#### 5. Project Member Management
```
Missing:
├─ UI to add members to project
├─ UI to remove members
├─ Change member roles (developer → project-manager)
├─ Bulk add members from team
├─ View permissions/roles for each member
└─ Deactivate members

Current issue:
- Backend endpoints exist
- Frontend components not fully implemented
- No clear member list with role badges
```

#### 6. Search & Filter in UI
```
Missing:
├─ Search bar for finding projects/tasks
├─ Filter tasks by: assignee, priority, status, due date
├─ Sort options (by name, due date, priority, etc.)
├─ Search teams
├─ Advanced search/saved filters
└─ Search history

Current issue:
- All data shown at once
- No way to find specific items in large project
```

#### 7. Real-Time Notifications
```
Missing:
├─ Toast/banner notifications for:
│  ├─ Task assigned to you
│  ├─ Task status changed
│  ├─ New comment on your task
│  ├─ Team member joined
│  └─ Project archived
├─ Notification center/bell icon
├─ Mark notifications as read
└─ Notification preferences

Current issue:
- Basic toast notifications for API responses only
- No real-time updates from other team members
```

#### 8. Team Member Invitation Flow
```
Missing:
├─ Generate invite link
├─ Send invite email
├─ Accept invite in browser
├─ Pending invites list
└─ Resend invite

Current issue:
- Can only add by selecting existing users
- No way to invite new users by email
```

#### 9. Project Settings/Configuration
```
Missing:
├─ Edit project details
├─ Custom task statuses (Kanban columns)
├─ Workflow automation (rules)
├─ Project templates
└─ Archive/delete project

Current issue:
- Can create project but not edit after
- Can't customize Kanban columns per project
```

#### 10. Mobile Responsiveness
```
Missing:
├─ Mobile-optimized Kanban (scroll-able columns)
├─ Touch-friendly drag-drop
├─ Mobile navigation menu
├─ Responsive task cards
└─ Mobile forms

Current issue:
- Tailwind CSS supports responsive design
- Not fully tested on mobile/tablet
- Kanban drag-drop doesn't work well on touch
```

### Database & Data Issues

#### 1. Denormalization Problems
```
Current issue:
- Team member names are embedded
- If user changes name, team member record still shows old name
- No way to sync user profile updates across all documents

Solution needed:
- Use references instead of embedding full user objects
- Update all affected documents when user profile changes
- Or accept stale data and document it
```

#### 2. No Cascade Delete
```
Current issue:
- Delete user → team member records still exist (orphaned)
- Delete team → project still references it
- Delete project → tasks still exist

Solution needed:
- Implement cascade deletes (delete all related records)
- Or soft deletes (mark as deleted, don't actually remove)
- Or prevent deletion if records depend on it
```

#### 3. Data Consistency
```
Current issue:
- No transaction support for multi-collection updates
- Add member to team → also add to projects (can partially fail)
- Sync members endpoint might duplicate records

Solution needed:
- Use MongoDB transactions for atomic operations
- Validate data consistency after operations
- Implement idempotent endpoints
```

---

## Your Responsibilities as the New Developer

### Priority 1: Critical (Do First - Project Can't Work Without These)

#### 1. Implement Full Task CRUD + Status Updates
```
Effort: 3-4 days
Impact: High (Kanban board won't work without this)

Tasks:
├─ Backend:
│  ├─ PATCH /api/v1/project/task/:taskId
│  │  ├─ Update title, description, priority, due date
│  │  ├─ Update assignees
│  │  └─ Update status (with order recalculation)
│  └─ DELETE /api/v1/project/task/:taskId
│     ├─ Delete task
│     └─ Delete all related subtasks, attachments, activity logs
│
└─ Frontend:
   ├─ Task detail panel/modal
   ├─ Connect drag-drop to update endpoint
   ├─ Form to edit task
   └─ Confirmation before delete

Testing:
├─ Create task, verify appears in Kanban
├─ Drag task between columns, verify persists
├─ Edit task, verify updates
├─ Delete task, verify removed
└─ Refresh page, verify changes persist

Definition of Done:
✅ Full Kanban board functional (create, view, move, delete)
✅ All operations persist to database
✅ Task details visible and editable
```

#### 2. Connect Frontend to Backend APIs
```
Effort: 2-3 days
Impact: High (Nothing works without this)

Tasks:
├─ Create all Redux services
│  ├─ taskServices.js (create, update, delete, fetch)
│  ├─ projectServices.js (complete)
│  └─ teamServices.js (complete)
│
├─ Connect components to services
│  ├─ KanbanBoard.jsx → fetchTasks, updateTaskStatus
│  ├─ ProjectMembers.jsx → fetchMembers, addMember
│  └─ TeamPage.jsx → fetchTeams, createTeam
│
└─ Test all endpoints with real backend

Testing:
├─ Create team → appears immediately
├─ Add member → member visible in list
├─ Create project → can view in Kanban
├─ Create task → appears in Kanban
└─ Update task → persists across refresh

Definition of Done:
✅ All CRUD operations work end-to-end
✅ Loading states show during API calls
✅ Error messages display on failure
✅ Data refreshes automatically
```

#### 3. File Upload to Cloudinary
```
Effort: 2 days
Impact: Medium (Needed for attachments)

Tasks:
├─ Backend:
│  ├─ Complete multer.middleware.js
│  ├─ Complete uploadFile controller
│  ├─ Implement POST /api/v1/project/task/:taskId/upload
│  ├─ Store file URL in TaskAttachment model
│  └─ Create .env variables for Cloudinary
│
└─ Frontend:
   ├─ Create file upload component
   ├─ Show upload progress
   ├─ Display uploaded files list
   └─ Allow file download/preview

Testing:
├─ Upload image → verify in Cloudinary
├─ Upload PDF → verify in Cloudinary
├─ Access file URL → file displays
└─ Delete file → removed from database

Definition of Done:
✅ Files upload to Cloudinary, not local storage
✅ File URLs stored in database
✅ Users can download files
✅ Progress indicator during upload
```

### Priority 2: High (Do Next - Project Works But Incomplete)

#### 4. Analytics & Reporting
```
Effort: 3-4 days
Impact: Medium (Feature, not critical)

Tasks:
├─ Backend:
│  ├─ GET /api/v1/project/:projectId/analytics
│  │  └─ Return: total tasks, completed, pending, by status, by assignee
│  ├─ GET /api/v1/team/:teamId/analytics
│  └─ GET /api/v1/user/dashboard-stats
│
└─ Frontend:
   ├─ AnalyticsPage.jsx
   ├─ Connect to analytics endpoints
   ├─ Display charts with real data
   ├─ Add date range filters
   └─ Add export to CSV/PDF

Testing:
├─ Create 10 tasks in project
├─ Analytics show correct counts
├─ Charts update after status change
├─ Filters work correctly
└─ Export generates valid file

Definition of Done:
✅ Real-time analytics dashboard
✅ Charts display accurate data
✅ Filters & date ranges work
✅ Export functionality works
```

#### 5. Real-Time Socket.IO Integration
```
Effort: 3-4 days
Impact: Medium (Nice-to-have, enhances UX)

Tasks:
├─ Backend:
│  ├─ Implement room handlers:
│  │  ├─ Join room on project view
│  │  ├─ Emit "task-created" event
│  │  ├─ Emit "task-updated" event
│  │  └─ Emit "task-deleted" event
│  ├─ Activity log real-time
│  └─ User presence tracking
│
└─ Frontend:
   ├─ Connect to Socket.IO server
   ├─ Join project room on navigate to Kanban
   ├─ Listen for task updates
   ├─ Update local state when event received
   ├─ Show "User X is online" indicators
   └─ Show "User X is working on Task Y" status

Testing:
├─ Open project in 2 browsers
├─ Create task in one → appears in other (real-time)
├─ Update task status → other browser updates instantly
├─ Go offline → reconnect gracefully
└─ Multiple operations in sequence don't conflict

Definition of Done:
✅ Real-time updates working
✅ No page refresh needed for updates
✅ Graceful reconnection handling
✅ Shows who's working on what
```

#### 6. Task Comments & Activity Log
```
Effort: 2-3 days
Impact: Medium (Collaboration feature)

Tasks:
├─ Backend:
│  ├─ POST /api/v1/project/task/:taskId/comment
│  ├─ GET /api/v1/project/task/:taskId/comments
│  ├─ DELETE /api/v1/project/task/:taskId/comment/:commentId
│  └─ GET /api/v1/project/task/:taskId/activity-log
│
└─ Frontend:
   ├─ Comments section in task detail panel
   ├─ Add comment form
   ├─ Display comment list with user + timestamp
   ├─ Allow delete own comments
   ├─ Activity log timeline view
   └─ Show what changed and when

Testing:
├─ Add comment to task
├─ Comment appears to all team members
├─ Delete comment removes it
├─ Activity log shows task changes
└─ Mentions (@username) mentioned in comments

Definition of Done:
✅ Comments fully functional
✅ Activity log tracks all changes
✅ Mentions notify users
✅ Comments persist across refresh
```

### Priority 3: Medium (Do Later - Nice Features)

#### 7. Email Notifications
```
Effort: 2-3 days

Implement:
├─ Task assigned to you
├─ Task status changes
├─ Comment mentions you
├─ Daily summary email
└─ User preferences for notifications

Benefit: Better team communication
```

#### 8. Project Member Invitation
```
Effort: 2 days

Implement:
├─ Generate invite links
├─ Send via email
├─ Accept invite without account creation
├─ Pending invites management

Benefit: Easier onboarding
```

#### 9. Custom Kanban Columns
```
Effort: 2 days

Implement:
├─ UI to add/remove/reorder task statuses
├─ Per-project custom columns
├─ Migrate existing tasks on column delete

Benefit: Flexible workflow
```

#### 10. Search & Advanced Filtering
```
Effort: 2-3 days

Implement:
├─ Full-text search for tasks
├─ Filters by assignee, priority, status, due date
├─ Saved filters
├─ Search history

Benefit: Find tasks in large projects
```

### Priority 4: Polish (Do Last)

#### 11. Mobile Responsiveness
```
Effort: 2-3 days
Test on: iOS Safari, Chrome Android
Ensure: Touch-friendly, readable, functional
```

#### 12. Error Handling & Validation
```
Effort: 1-2 days
Add: Input validation, error boundaries, retry logic
```

#### 13. Performance Optimization
```
Effort: 1-2 days
Optimize: Lazy load components, debounce API calls, cache data
```

#### 14. Documentation & Deployment
```
Effort: 1-2 days
Create: User guide, API documentation, deployment guide
```

### Development Timeline Estimate

```
Week 1:
├─ Mon-Tue: Implement Task CRUD (Priority 1)
├─ Wed-Thu: Connect Frontend APIs (Priority 2)
└─ Fri: Testing & bug fixes

Week 2:
├─ Mon-Tue: File Uploads (Priority 3)
├─ Wed: Analytics (Priority 4)
└─ Thu-Fri: Socket.IO real-time (Priority 5)

Week 3:
├─ Mon: Task Comments (Priority 6)
├─ Tue-Wed: Email notifications (Priority 7)
├─ Thu: Polish & bug fixes
└─ Fri: Testing on multiple browsers

Week 4:
├─ Mon-Tue: User features (settings, profile)
├─ Wed: Mobile responsiveness
├─ Thu: Performance optimization
└─ Fri: Final testing, deployment ready

Total: 4 weeks to MVP (all Priority 1-3 done)
```

### How to Stay Organized

#### Daily Standup Template
```
What I did yesterday:
- Implemented task update endpoint
- Fixed bug in task deletion

What I'm doing today:
- Add task delete UI button
- Test Kanban drag-drop persistence

What's blocking me:
- Need to review Cloudinary setup
```

#### Commit Message Format
```
[FEATURE] Implement task status update API
- Add PATCH /api/v1/project/task/:taskId endpoint
- Handle status change with order recalculation
- Create activity log entry
- Add validation for status ID

[BUGFIX] Fix task list not refreshing after create
- Reset form after successful submission
- Refetch task list from backend
- Show success toast

[REFACTOR] Move task validation to separate module
- Extract validation logic to validators/taskValidators.js
- Improve error messages
- Add unit tests
```

---

## Final Summary

### 🎯 The Big Picture

**NexManage** is a **real-world project management tool** built with proven, production-grade technologies:

```
Backend: Node.js + Express + MongoDB
└─ Handles business logic, authentication, database persistence
└─ RESTful API design with standardized error/response formats
└─ Middleware-based request processing
└─ Role-based access control

Frontend: React + Redux + Tailwind + Vite
└─ Modern SPA with instant page loads
└─ Global state management with Redux Toolkit
└─ Reusable component architecture
└─ Real-time capable with Socket.IO ready

Database: MongoDB with Mongoose
└─ Flexible schema for teams, projects, tasks
└─ Embedded documents for performance (members)
└─ References for scalability (projects, tasks)
```

### 🔗 How Everything Connects

```
User opens app
└─ Checks localStorage for token
└─ ProtectedWrapper validates token
└─ Redirects to login if needed
└─ Dashboard loads

User creates task
└─ Fills form → clicks submit
└─ Redux service called (taskServices.js)
└─ Axios POST to /api/v1/project/task/create-task
└─ Backend receives, verifies token + permissions
└─ Database creates task + activity log
└─ Response returned with task data
└─ Redux state updated (setTasks)
└─ Component re-renders, task appears in Kanban
└─ Socket.IO emits to team members (future)

User drags task to "Done"
└─ @dnd-kit handles drag-drop UI
└─ On drop, updateTaskStatus called
└─ Backend updates task.status and task.order
└─ Activity log recorded
└─ All team members see update (via Socket.IO)
└─ Kanban refreshes instantly
```

### 📈 Your Path Forward

1. **Days 1-3**: Master the architecture (read this guide + code)
2. **Days 4-7**: Implement Task CRUD (high impact, builds confidence)
3. **Days 8-14**: Connect all APIs, test end-to-end
4. **Days 15-21**: Add analytics, real-time, and polish
5. **Days 22-28**: Bug fixes, optimization, documentation

### 💪 What You Need to Be Successful

```
Technical Skills:
✓ JavaScript/Node.js fundamentals
✓ React hooks and component patterns
✓ MongoDB & Mongoose basics
✓ RESTful API concepts
✓ Async/await and error handling

Tools:
✓ Git for version control
✓ Postman or Thunder Client for API testing
✓ VS Code with good extensions
✓ Browser DevTools for frontend debugging
✓ MongoDB Compass for database inspection

Mindset:
✓ Read code before writing code
✓ Understand why before implementing how
✓ Test as you code (don't wait until the end)
✓ Ask questions when stuck (better than wasting time)
✓ Commit frequently (every feature/bugfix)
✓ Don't jump to next feature until current works
```

### 🎓 Key Learning Opportunities

```
This project teaches you:
├─ Full-stack development (frontend + backend)
├─ Database design (normalization, embedding)
├─ Authentication & authorization
├─ Real-time communication (Socket.IO)
├─ State management at scale (Redux)
├─ API design principles
├─ Error handling & validation
├─ Deployment considerations
├─ Testing strategies
└─ Production-grade code patterns
```

### ✅ How Confident Should You Feel?

**After understanding this document**: 60%
- You understand the architecture
- You can navigate the codebase
- You know what's built and what's missing

**After implementing Priority 1-2 tasks**: 80%
- You can add new features confidently
- You understand the patterns
- You can debug issues independently

**After 4 weeks of development**: 95%
- You own the codebase
- You can mentor others
- You understand trade-offs and design decisions
- You're ready to lead the project

### 🚀 Final Checklist Before Starting

```
Before writing code:
☐ Clone repo and install dependencies
☐ Setup .env file with secrets
☐ Start server and verify it runs
☐ Start frontend and verify it loads
☐ Create test account and login
☐ Verify database is populated
☐ Review this guide one more time

Setup your tools:
☐ VS Code with extensions (ES Lint, Prettier, MongoDB)
☐ MongoDB Compass connected to database
☐ Postman configured with API collection
☐ Git configured locally
☐ Two terminals open (one for server, one for client)

Pick your first task:
☐ Choose from Priority 1 list
☐ Read related code files
☐ Write pseudo-code first
☐ Implement incrementally
☐ Test thoroughly before moving on

Remember:
✓ This is a real project, not a tutorial
✓ Production code, real patterns, actual decisions
✓ You're taking over from another developer
✓ Understand before you change
✓ Document your decisions
✓ Help the next developer (maybe yourself in 3 months!)
```

---

### 🤝 Need Help?

When you get stuck:

1. **Read the code**: Look at similar implementations
2. **Check database**: Use MongoDB Compass to verify data
3. **Use browser DevTools**: Console, Network tab for debugging
4. **Trace the flow**: Follow a request from frontend to backend
5. **Use Postman**: Test API endpoints directly
6. **Review this guide**: Re-read the relevant section
7. **Google the error**: 90% of errors have Stack Overflow answers
8. **Ask someone**: Better to spend 5 mins asking than 2 hours stuck

### 📝 Final Thoughts

You're taking over a **real, production-grade project** with:
- ✅ Solid architecture
- ✅ Good patterns & conventions
- ✅ Extensible design
- ✅ Clear separation of concerns

Your job is to:
1. Understand how it works
2. Add missing features carefully
3. Maintain code quality
4. Document your decisions
5. Leave it better than you found it

**You've got this.** 🎉

Now go build something great!

---

**Last Updated**: January 30, 2026
**Project**: NexManage
**Status**: Halfway Complete, Ready for New Developer
**Confidence Level**: You should feel 60% confident now, 95% after 4 weeks
