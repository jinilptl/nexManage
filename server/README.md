# NexManage — Backend (Server)

NexManage is a project management tool. This repository contains the backend built with Node.js, Express, and MongoDB, implementing user authentication, team management, and member functionality.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Quick Start](#quick-start)
- [Folder Structure](#folder-structure)
- [Available Modules & Features](#available-modules--features)
- [Middleware](#middleware)
- [Utilities](#utilities)
- [API Routes & Examples](#api-routes--examples)
  - [Auth/User Routes](#authuser-routes)
  - [Team Routes](#team-routes)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Contributors](#contributors)

---

## Project Overview

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express
- **Database:** MongoDB (Mongoose)
- **Email Service:** SendGrid (via `utils/emailSender.js`)
- **Modules:** Auth/User, Team (with Member subdocument)
- **Error Format:** `{ success: false, message: string, errors: [] }`
- **Success Format:** `{ statusCode, success, message, data }`

---

## Quick Start

### 1. Clone and Install

```bash
cd "c:\Users\91635\Desktop\project Management tool\NexManage\server"
npm install
```

### 2. Configure Environment

Create a `.env` file with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/nexmanage
JWT_SECRET=<your_jwt_secret>
SEND_GRID_API_KEY=<your_sendgrid_key>     # optional if not sending emails
EMAIL_FROM=<sender@example.com>
CLIENT_URL=http://localhost:5173
```

### 3. Run the Server

**Development (with nodemon):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

**Server URL:** `http://localhost:5000`

---

## Folder Structure

```
server/
 ├── config/
 │   └── DbConnect.js
 ├── controllers/
 │   ├── team.controllers.js
 │   └── user.controllers.js
 ├── middlewares/
 │   └── authMiddlewares/
 │       ├── roleChecker.middlewares.js
 │       └── varifyToken.middlewares.js
 ├── models/
 │   ├── team.models.js
 │   └── user.models.js
 ├── routes/
 │   ├── auth.routes.js
 │   └── team.routes.js
 ├── templates/
 │   ├── forgotPasswordMail.js
 │   └── team_member_added_email_template.js
 ├── utils/
 │   ├── ApiError.js
 │   ├── ApiResponse.js
 │   ├── asyncHandler.js
 │   └── emailSender.js
 ├── app.js
 ├── index.js
 └── .env
```

---

## Available Modules & Features

### Auth / User Module

**Files:** `controllers/user.controllers.js`, `models/user.models.js`, `routes/auth.routes.js`

**User Model Fields:**
- `name`, `email`, `password` (hashed), `role`, `createdby`
- `resetPasswordToken`, `resetPasswordExpire`

**Features:**
- User registration (super_admin protected)
- Login/Logout
- List all users (super_admin only)
- Change password
- Forgot password (with email)
- Reset password

### Team Module

**Files:** `controllers/team.controllers.js`, `models/team.models.js`, `routes/team.routes.js`

**Team Model Fields:**
- `teamName`, `description`, `createdby`, `isActive`
- `members[]` (subdocument: `user`, `roleInTeam`, `joinedAt`, `status`)

**Features:**
- Create, read, update, delete teams
- Add members to teams
- Get all team members
- Update member roles
- Remove members from teams

---

## Middleware

### verifyToken
**Location:** `middlewares/authMiddlewares/varifyToken.middlewares.js`

Extracts JWT token from cookie or Authorization header and sets `req.user`.

### roleChecker
**Location:** `middlewares/authMiddlewares/roleChecker.middlewares.js`

Restricts route access based on user roles (accepts array of allowed roles).

---

## Utilities

- **asyncHandler** — Wraps async controllers and forwards errors to global error handler
- **ApiError / ApiResponse** — Standardized error/response classes
- **emailSender** — SendGrid wrapper for sending emails

---

## API Routes & Examples

**Base API Prefix:** `/api/v1`

**Authentication:** Protected routes require `Authorization: Bearer <token>` header.

---

### Auth/User Routes

#### 1. Register User

- **Method:** `POST`
- **Path:** `/api/v1/user/register`
- **Auth:** Protected — `roleChecker(["super_admin"])`
- **Headers:**
  ```
  Authorization: Bearer <SUPER_ADMIN_TOKEN>
  Content-Type: application/json
  ```
- **Body:**
  ```json
  {
    "name": "Alice Admin",
    "email": "alice@example.com",
    "password": "SecurePass123!",
    "role": "admin"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "user register succesfully",
    "data": {
      "_id": "652a6ff4a1e6f2b123456789",
      "name": "Alice Admin",
      "email": "alice@example.com",
      "role": "admin",
      "createdby": {
        "_id": "652a6ff4a1e6f2b000000000",
        "name": "Super Admin",
        "email": "superadmin@example.com",
        "role": "super_admin"
      },
      "createdAt": "2025-11-12T08:00:00.000Z",
      "updatedAt": "2025-11-12T08:00:00.000Z"
    }
  }
  ```
- **Error Response:**
  ```json
  {
    "success": false,
    "message": "email already exists",
    "errors": []
  }
  ```

---

#### 2. Login

- **Method:** `POST`
- **Path:** `/api/v1/user/login`
- **Auth:** Public
- **Body:**
  ```json
  {
    "email": "alice@example.com",
    "password": "SecurePass123!"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "_id": "652a6ff4a1e6f2b123456789",
        "name": "Alice Admin",
        "email": "alice@example.com",
        "role": "admin"
      }
    }
  }
  ```
- **Error Response:**
  ```json
  {
    "success": false,
    "message": "invalid email or password",
    "errors": []
  }
  ```

---

#### 3. Logout

- **Method:** `POST`
- **Path:** `/api/v1/user/logout`
- **Auth:** Protected
- **Headers:**
  ```
  Authorization: Bearer <TOKEN>
  ```
- **Success Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "logout successful",
    "data": null
  }
  ```

---

#### 4. Get All Users

- **Method:** `GET`
- **Path:** `/api/v1/user/alluser`
- **Auth:** Protected — `roleChecker(["super_admin"])`
- **Headers:**
  ```
  Authorization: Bearer <SUPER_ADMIN_TOKEN>
  ```
- **Success Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "users fetched successfully",
    "data": [
      {
        "_id": "652a6ff4...",
        "name": "Alice Admin",
        "email": "alice@example.com",
        "role": "admin"
      },
      {
        "_id": "652a7aa1...",
        "name": "Bob Member",
        "email": "bob@example.com",
        "role": "member"
      }
    ]
  }
  ```
- **Error Response:**
  ```json
  {
    "success": false,
    "message": "forbidden access, you dont have access to this resource",
    "errors": []
  }
  ```

---

#### 5. Change Password

- **Method:** `POST`
- **Path:** `/api/v1/user/change-password`
- **Auth:** Protected
- **Headers:**
  ```
  Authorization: Bearer <TOKEN>
  ```
- **Body:**
  ```json
  {
    "oldPassword": "OldPass123",
    "newPassword": "NewSecurePass456"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "password changed successfully",
    "data": null
  }
  ```
- **Error Response:**
  ```json
  {
    "success": false,
    "message": "old password is incorrect",
    "errors": []
  }
  ```

---

#### 6. Forgot Password

- **Method:** `POST`
- **Path:** `/api/v1/user/forget-password`
- **Auth:** Public
- **Body:**
  ```json
  {
    "email": "alice@example.com"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "password reset link sent to email if the account exists",
    "data": null
  }
  ```
- **Error Response:**
  ```json
  {
    "success": false,
    "message": "failed to send reset email",
    "errors": []
  }
  ```

---

#### 7. Reset Password

- **Method:** `POST`
- **Path:** `/api/v1/user/reset-password/:token`
- **Auth:** Public (token in URL)
- **Body:**
  ```json
  {
    "newPassword": "NewSecurePass456"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "password reset successfully",
    "data": null
  }
  ```
- **Error Response:**
  ```json
  {
    "success": false,
    "message": "invalid token or token expired",
    "errors": []
  }
  ```

---

### Team Routes

#### 8. Create Team

- **Method:** `POST`
- **Path:** `/api/v1/team/create-team`
- **Auth:** Protected — `roleChecker(["super_admin","admin"])`
- **Headers:**
  ```
  Authorization: Bearer <ADMIN_TOKEN>
  ```
- **Body:**
  ```json
  {
    "teamName": "Platform Team",
    "description": "Team responsible for core platform features"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "team created successfully",
    "data": {
      "_id": "652b1c2a...",
      "teamName": "Platform Team",
      "description": "Team responsible for core platform features",
      "members": [],
      "createdby": "652a6ff4a1e6f2b000000000",
      "isActive": true
    }
  }
  ```
- **Error Response:**
  ```json
  {
    "success": false,
    "message": "teamName already exists",
    "errors": []
  }
  ```

---

#### 9. Get All Teams

- **Method:** `GET`
- **Path:** `/api/v1/team/get-all-teams`
- **Auth:** Protected — `roleChecker(["super_admin","admin"])`
- **Headers:**
  ```
  Authorization: Bearer <ADMIN_TOKEN>
  ```
- **Success Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "teams fetched successfully",
    "data": [
      {
        "_id": "652b1c2a...",
        "teamName": "Platform Team",
        "description": "...",
        "isActive": true
      }
    ]
  }
  ```

---

#### 10. Get Team by ID

- **Method:** `GET`
- **Path:** `/api/v1/team/get-team/:teamId`
- **Auth:** Protected
- **Headers:**
  ```
  Authorization: Bearer <TOKEN>
  ```
- **Success Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "team fetched successfully",
    "data": {
      "_id": "652b1c2a...",
      "teamName": "Platform Team",
      "description": "...",
      "members": [
        {
          "user": {
            "_id": "652a7aa1...",
            "name": "Bob Member",
            "email": "bob@example.com"
          },
          "roleInTeam": "developer",
          "joinedAt": "2025-11-12T08:20:00.000Z",
          "status": "active"
        }
      ],
      "createdby": "652a6ff4a1e6f2b000000000",
      "isActive": true
    }
  }
  ```

---

#### 11. Update Team

- **Method:** `POST`
- **Path:** `/api/v1/team/update-team/:teamId`
- **Auth:** Protected
- **Body:**
  ```json
  {
    "teamName": "Platform Team (Core)",
    "description": "Updated description"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "team updated successfully",
    "data": {
      "_id": "652b1c2a...",
      "teamName": "Platform Team (Core)",
      "description": "Updated description",
      "isActive": true
    }
  }
  ```

---

#### 12. Delete Team

- **Method:** `POST`
- **Path:** `/api/v1/team/delete-team/:teamId`
- **Auth:** Protected
- **Success Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "team deleted successfully",
    "data": null
  }
  ```

---

#### 13. Add Team Member

- **Method:** `POST`
- **Path:** `/api/v1/team/add-member/:teamId`
- **Auth:** Protected
- **Headers:**
  ```
  Authorization: Bearer <TOKEN>
  ```
- **Body:**
  ```json
  {
    "email": "newmember@example.com",
    "roleInTeam": "developer"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "member added to team",
    "data": {
      "teamId": "652b1c2a...",
      "member": {
        "user": "652a7aa1...",
        "roleInTeam": "developer",
        "joinedAt": "2025-11-12T08:30:00.000Z",
        "status": "active"
      }
    }
  }
  ```
- **Error Response:**
  ```json
  {
    "success": false,
    "message": "user not found with provided email",
    "errors": []
  }
  ```

---

#### 14. Get All Team Members

- **Method:** `GET`
- **Path:** `/api/v1/team/get-all-members/:teamId`
- **Auth:** Protected
- **Headers:**
  ```
  Authorization: Bearer <TOKEN>
  ```
- **Success Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "team members fetched",
    "data": [
      {
        "user": {
          "_id": "652a7aa1...",
          "name": "Bob Member",
          "email": "bob@example.com"
        },
        "roleInTeam": "developer",
        "joinedAt": "2025-11-12T08:20:00.000Z",
        "status": "active"
      }
    ]
  }
  ```

---

#### 15. Update Team Member

- **Method:** `POST`
- **Path:** `/api/v1/team/update-member/:teamId/:memberId`
- **Auth:** Protected
- **Body:**
  ```json
  {
    "roleInTeam": "team lead",
    "status": "active"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "team member updated",
    "data": {
      "user": "652a7aa1...",
      "roleInTeam": "team lead",
      "status": "active"
    }
  }
  ```

---

#### 16. Remove Team Member

- **Method:** `POST`
- **Path:** `/api/v1/team/remove-member/:teamId/:memberId`
- **Auth:** Protected
- **Success Response (200):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "member removed from team",
    "data": null
  }
  ```

---

## Testing

- Use **Postman** or **Thunder Client** to test API endpoints
- Ensure MongoDB is running and `MONGO_URI` is correctly configured
- For email flows, configure `SEND_GRID_API_KEY` and `EMAIL_FROM` in `.env`
- Token format: `Authorization: Bearer <token>`
- IDs in examples are placeholders — replace with actual ObjectId strings from your database

---

## Troubleshooting

- **Environment variables not loading:** Ensure `.env` file exists and `dotenv` is configured in `index.js`
- **SendGrid email failures:** Check API key and sender email configuration. You can comment out `sendEmail` calls temporarily to continue development
- **Token issues:** `verifyToken` middleware reads tokens from `req.cookies.token` or `Authorization: Bearer <token>` header
- **Server errors:** All errors are returned in JSON format by the global error handler in `app.js`: `{ success: false, message, errors: [] }`
- **MongoDB connection errors:** Verify MongoDB is running and `MONGO_URI` is correct

---

## Contributors

Project developed and maintained by the NexManage team. Add contributors as needed.

---

**NexManage Backend** — Core user authentication and team management features implemented. Extend with additional modules (projects, tasks, etc.) as needed.