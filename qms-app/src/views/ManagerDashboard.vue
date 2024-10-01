<template>
  <div class="dashboard-layout">
    <!-- Navbar Component -->
    <NavBar />

    <!-- Sidebar for navigation (always visible on laptop/PC view) -->
    <div class="sidebar" :class="{ open: isSidebarOpen, 'sidebar-visible': isSidebarVisibleOnPC }">
      <div class="sidebar-header">
        <h3>Manager Dashboard</h3>
        <button @click="toggleSidebar" class="close-btn" v-if="!isSidebarVisibleOnPC">
          &times;
        </button>
      </div>
      <ul class="sidebar-menu">
        <li @click="navigateToSection('accepted-students')" :class="{ active: currentSection === 'accepted-students' }">
          Accepted Students
        </li>
        <li @click="navigateToSection('assign-quizzes')" :class="{ active: currentSection === 'assign-quizzes' }">
          Assign Quizzes
        </li>
      </ul>
    </div>

    <!-- Main Content Area -->
    <div class="dashboard-content" :class="{ 'content-offset': isSidebarVisibleOnPC }">
      <button class="btn btn-primary toggle-sidebar-btn" @click="toggleSidebar" v-if="!isSidebarVisibleOnPC">
        ☰ Toggle Sidebar
      </button>

      <!-- Content will change based on selected section from the sidebar -->
      <div class="content-section">
        <!-- Accepted Students Section -->
        <div v-if="currentSection === 'accepted-students'" class="card">
          <div v-for="student in acceptedStudentsArray" :key="student.id" class="student-card">
            <p><strong>Full Name:</strong> {{ student.name }}</p>
            <p><strong>Email:</strong> {{ student.email }}</p>
            <p><strong>Phone Number:</strong> {{ student.phone_number }}</p>
            <p><a :href="student.cvUrl" target="_blank">View Resume</a></p>
          </div>
          <p v-if="!acceptedStudentsArray.length">No accepted students available.</p>
        </div>

        <!-- Assign Quizzes Section -->
        <div v-if="currentSection === 'assign-quizzes'" class="card">
          <AssignQuiz />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue';
import AssignQuiz from '../components/AssignQuiz.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    NavBar,
    AssignQuiz,
  },
  data() {
    return {
      isSidebarOpen: false, // Controls sidebar visibility on small screens
      isSidebarVisibleOnPC: true, // Sidebar should be visible by default on larger screens
      currentSection: 'accepted-students', // Tracks the current active section
    };
  },
  computed: {
    ...mapGetters(['acceptedStudents']),
    acceptedStudentsArray() {
      return Object.values(this.acceptedStudents);
    },
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen; // Toggle sidebar open/close on small screens
    },
    navigateToSection(section) {
      this.currentSection = section; // Change section based on sidebar option
      this.isSidebarOpen = false; // Close the sidebar after selecting an option on mobile
    },
  },
  created() {
    // Fetch accepted students when the component is created
    this.$store.dispatch('fetchAcceptedStudents');
    // Determine initial sidebar visibility based on screen width
    this.isSidebarVisibleOnPC = window.innerWidth > 768;
    window.addEventListener('resize', this.handleResize);
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      // Adjust sidebar visibility when resizing the window
      this.isSidebarVisibleOnPC = window.innerWidth > 768;
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    navigateToSection(section) {
      this.currentSection = section;
      if (window.innerWidth <= 768) {
        this.isSidebarOpen = false; // Close sidebar on mobile after navigation
      }
    },
  },
};
</script>

<style scoped>
/* General Layout */
.dashboard-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* Navbar styles */
nav {
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 2;
}

/* Sidebar styling */
.sidebar {
  width: 250px;
  height: 100%;
  background: #3498db;
  color: white;
  position: fixed;
  top: 60px; /* Offset by the height of the navbar */
  left: 0;
  transition: left 0.5s ease; /* Smooth transition */
  z-index: 1;
}

.sidebar.open,
.sidebar.sidebar-visible {
  left: 0; /* Make sidebar visible */
}

.sidebar-header {
  padding: 15px;
  background: #2980b9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h3 {
  margin: 0;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
}

.sidebar-menu li {
  padding: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.sidebar-menu li:hover {
  background: #1abc9c;
}

.sidebar-menu li.active {
  background: #1abc9c;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: white;
}

/* Dashboard Content Area */
.dashboard-content {
  margin-top: 60px; /* Offset content below the navbar */
  padding: 20px;
  overflow-y: auto;
  transition: padding-left 0.5s ease;
}

.dashboard-content.content-offset {
  padding-left: 270px; /* Offset content beside the sidebar */
}

/* Sidebar toggle button for mobile */
.toggle-sidebar-btn {
  display: none;
}

@media (max-width: 768px) {
  /* Adjust layout for smaller screens */
  .sidebar {
    width: 200px;
    left: -200px;
    top: 60px;
  }

  .sidebar.open {
    left: 0;
  }

  .dashboard-content {
    padding-left: 0;
  }

  .toggle-sidebar-btn {
    display: block; /* Show sidebar toggle button on mobile */
    margin-bottom: 20px;
  }
}
</style>
