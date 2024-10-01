<template>
  <nav class="sidebar">
    <ul>
      <!-- Admin-specific menu -->
      <li v-if="userRole === 'admin'">
        <router-link to="/admin-dashboard">Admin Dashboard</router-link>
      </li>
      <li v-if="userRole === 'admin'">
        <router-link to="/manage-users">Manage Users</router-link>
      </li>
      <li v-if="userRole === 'admin'">
        <router-link to="/assign-quizzes">Assign Quizzes</router-link>
      </li>

      <!-- Manager-specific menu -->
      <li v-if="userRole === 'manager'">
        <router-link to="/manager-dashboard">Manager Dashboard</router-link>
      </li>
      <li v-if="userRole === 'manager'">
        <router-link to="/manage-students">Manage Students</router-link>
      </li>
      <li v-if="userRole === 'manager'">
        <router-link to="/assign-quizzes">Assign Quizzes</router-link>
      </li>

      <!-- Student-specific menu -->
      <li v-if="userRole === 'student'">
        <router-link to="/student-dashboard">Student Dashboard</router-link>
      </li>
      <li v-if="userRole === 'student'">
        <router-link to="/view-quizzes">View Quizzes</router-link>
      </li>
      <li v-if="userRole === 'student'">
        <router-link to="/quiz-results">View Quiz Results</router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'; // Import Vuex helper for mapping getters

export default {
  computed: {
    ...mapGetters(['userRole']), // Map Vuex getter to access user role
  },
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #f4f4f4;
  padding: 20px;
  position: fixed;
  height: 100%;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar ul li {
  margin-bottom: 15px;
}

.sidebar ul li a {
  text-decoration: none;
  color: #333;
}
</style>
