<template>
  <div class="dashboard-layout">
    <!-- Navbar Component -->
    <NavBar />

    <!-- Sidebar for navigation (always visible on laptop/PC view) -->
    <div class="sidebar" :class="{ open: isSidebarOpen, 'sidebar-visible': isSidebarVisibleOnPC }">
      <div class="sidebar-header">
        <h3>Quizzes</h3>
        <button @click="toggleSidebar" class="close-btn" v-if="!isSidebarVisibleOnPC">
          &times;
        </button>
      </div>
      <ul class="sidebar-menu">
        <li @click="navigateToSection('assigned')" :class="{ active: currentSection === 'assigned' }">
          Assigned Quizzes
        </li>
        <li @click="navigateToSection('active')" :class="{ active: currentSection === 'active' }">
          Active Quizzes
        </li>
        <li @click="navigateToSection('attempted')" :class="{ active: currentSection === 'attempted' }">
          Attempted Quizzes
        </li>
        <li @click="navigateToSection('results')" :class="{ active: currentSection === 'results' }">
          Quiz Results
        </li>
      </ul>
    </div>

    <!-- Main Content Area (content starts beside sidebar on laptop/PC view) -->
    <div class="dashboard-content" :class="{ 'content-offset': isSidebarVisibleOnPC }">
      <button class="btn btn-primary toggle-sidebar-btn" @click="toggleSidebar" v-if="!isSidebarVisibleOnPC">
        ☰ Toggle Sidebar
      </button>

      <!-- Content will change based on selected section from the sidebar -->
      <div class="content-section">
        <!-- Removed outer card-header h3 tags and let the child components handle their own titles -->
        <div v-if="currentSection === 'assigned'" class="card">
          <AssignedQuizzes :student-id="studentId" />
        </div>

        <div v-if="currentSection === 'active'" class="card">
          <PendingQuizzes :student-id="studentId" />
        </div>

        <div v-if="currentSection === 'attempted'" class="card">
          <AttemptedQuizzes :student-id="studentId" />
        </div>

        <div v-if="currentSection === 'results'" class="card">
          <QuizResults :student-id="studentId" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue';
import AssignedQuizzes from '../components/quiz/AssignedQuizzes.vue';
import PendingQuizzes from '../components/quiz/PendingQuizzes.vue';
import AttemptedQuizzes from '../components/quiz/AttemptedQuizzes.vue';
import QuizResults from '../components/quiz/QuizResults.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    NavBar,
    AssignedQuizzes,
    PendingQuizzes,
    AttemptedQuizzes,
    QuizResults,
  },
  data() {
    return {
      isSidebarOpen: false, // Controls sidebar visibility on small screens
      isSidebarVisibleOnPC: true, // Sidebar should be visible by default on larger screens
      currentSection: 'assigned', // Tracks the current active section
    };
  },
  computed: {
    ...mapGetters(['userEmail']),
    studentId() {
      return this.userEmail;
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
