// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '../components/LoginForm.vue';
import StudentRegistrationForm from '../components/StudentRegistrationForm.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import ManagerDashboard from '../views/ManagerDashboard.vue';
import StudentDashboard from '../views/StudentDashboard.vue';
import SetPassword from '../components/SetPassword.vue';
import ForgotPassword from '../components/ForgotPassword.vue';
import AssignQuiz from '../components/AssignQuiz.vue';
import TakeQuiz from '../components/TakeQuiz.vue'; // Import TakeQuiz component
import ViewManagers from '../components/ViewManagers.vue'; // Import ViewManagers component

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginForm,
  },
  {
    path: '/register',
    name: 'StudentRegistrationForm',
    component: StudentRegistrationForm,
  },
  {
    path: '/admin-dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' }, // Add meta fields to specify role-based access
  },
  {
    path: '/manager-dashboard',
    name: 'ManagerDashboard',
    component: ManagerDashboard,
    meta: { requiresAuth: true, role: 'manager' }, // Specify meta fields for manager role
  },
  {
    path: '/student-dashboard',
    name: 'StudentDashboard',
    component: StudentDashboard,
    meta: { requiresAuth: true, role: 'student' }, // Specify meta fields for student role
  },
  {
    path: '/set-password',
    name: 'SetPassword',
    component: SetPassword,
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
  },
  {
    path: '/assign-quiz',
    name: 'AssignQuiz',
    component: AssignQuiz,
    meta: { requiresAuth: true, role: 'admin' }, // Restrict route access to admin role
  },
  {
    path: '/view-managers',
    name: 'ViewManagers',
    component: ViewManagers,
    meta: { requiresAuth: true, role: 'admin' }, // Restrict access to admin role
  },
  {
    path: '/take-quiz/:quizId',
    name: 'TakeQuiz',
    component: TakeQuiz,
    props: true,
    meta: { requiresAuth: true, role: 'student' }, // Restrict route access to student role
  },
  // Remove the PageNotFound route
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Add a global navigation guard to handle authentication and role-based access control
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('jwtToken'); // Check if the user is authenticated
  const userRole = localStorage.getItem('userRole'); // Get the user's role

  if (to.matched.some(record => record.meta.requiresAuth)) {
    // If the route requires authentication and the user is not authenticated, redirect to login
    if (!isAuthenticated) {
      return next({ name: 'Login' });
    }

    // If the route has role-based restrictions, check the user's role
    if (to.meta.role && to.meta.role !== userRole) {
      // Redirect to a default page or show an error if the role doesn't match
      return next({ name: 'Login' });
    }
  }

  next(); // Proceed to the route
});

export default router;
