
# Vue 3 Role-Based Access System with JWT Authentication

This project is a frontend application built with Vue 3 and Vite, providing a role-based access system using JWT authentication. It includes different dashboards for Admin, Manager, Supervisor, and Student roles, each with distinct functionalities based on permissions.

## Getting Started

### Prerequisites
- Node.js (v14+)
- Vue 3
- Vite
- VS Code or any other code editor

### Project Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
   
2. Navigate to the project directory:
   ```
   cd <project-directory>
   ```
   
3. Install dependencies:
   ```
   npm install
   ```
   
4. Start the development server:
   ```
   npm run dev
   ```
   The development server will start at `http://localhost:5173/`.

### Running the Backend
The backend for this project is managed by Hadia Asif and is hosted at the following IP address:

```
http://192.168.15.67:8000
```

### Login Credentials
To access the different roles, use the following credentials:

- Admin
  - Email: `admin@example.com`
  - Password: `password`

- Manager
  - Email: `manager@example.com`
  - Password: `password`

- Supervisor
  - Email: `supervisor@example.com`
  - Password: `password`

- Student
  - Email: `student@example.com`
  - Password: `password`

### Important Components and Views
- `LoginForm.vue`: Handles user login.
- `AdminDashboard.vue`: Admin dashboard for managing users and quizzes.
- `ManagerDashboard.vue`: Manager dashboard for managing students and quizzes.
- `SupervisorDashboard.vue`: Supervisor dashboard for viewing student performance.
- `StudentDashboard.vue`: Student dashboard for taking quizzes and viewing results.
- `SetPassword.vue`: Component for setting a new password after registration.
- `AssignQuiz.vue`: Component for assigning quizzes to students.

### Permissions and Role-Based Access
- Admin: Full access to all features.
- Manager: Can manage students and assign quizzes.
- Supervisor: Can view quiz results and student performance.
- Student: Can view and take assigned quizzes.

### API Integration
The frontend application integrates with the backend through Axios for data fetching and submission. The backend API endpoints are located at `http://192.168.15.67:8000/api`.

### Deployment
For deployment, make sure to set the correct backend URL in the environment variables:
```
VITE_API_URL=http://192.168.15.67:8000/api
```
