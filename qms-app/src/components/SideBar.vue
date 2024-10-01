<template>
  <div :class="['sidebar', { 'is-hidden': isSidebarHidden }]">
    <button class="close-sidebar" @click="$emit('toggle-sidebar')">✖</button> <!-- Close button for mobile -->
    <ul>
      <li v-if="userRole === 'admin'">
        <router-link to="/admin-dashboard">Admin Dashboard</router-link>
      </li>
      <li v-if="userRole === 'admin'">
        <router-link to="/manage-users">Manage Users</router-link>
      </li>
      <li v-if="userRole === 'admin'">
        <router-link to="/assign-quizzes">Assign Quizzes</router-link>
      </li>
      <li v-if="userRole === 'manager'">
        <router-link to="/manager-dashboard">Manager Dashboard</router-link>
      </li>
      <li v-if="userRole === 'student'">
        <router-link to="/student-dashboard">Student Dashboard</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    isSidebarHidden: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters(['userRole'])
  }
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #f4f4f4;
  padding: 20px;
  height: calc(100vh - 60px);
  position: fixed;
  top: 60px;
  left: -250px; /* Initially off-screen */
  z-index: 999;
  transition: left 0.5s ease-in-out; /* Smooth transition for sliding */
}

.sidebar:not(.is-hidden) {
  left: 0; /* Show sidebar */
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
  padding: 10px;
  display: block;
  background: #e4e4e4;
  border-radius: 5px;
  transition: background 0.3s;
}

.sidebar ul li a:hover {
  background: #ddd;
}

.close-sidebar {
  background: none;
  border: none;
  font-size: 1.5rem;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .sidebar {
    height: 100%;
    top: 0;
  }
}
</style>
