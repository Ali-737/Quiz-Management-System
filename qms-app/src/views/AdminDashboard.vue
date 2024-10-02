<template>
  <div class="dashboard-layout">
    <!-- Navbar Component -->
    <NavBar />

    <!-- Sidebar for navigation (always visible on laptop/PC view) -->
    <div class="sidebar" :class="{ open: isSidebarOpen, 'sidebar-visible': isSidebarVisibleOnPC }">
      <div class="sidebar-header">
        <h3>Admin Options</h3>
        <button @click="toggleSidebar" class="close-btn" v-if="!isSidebarVisibleOnPC">
          &times;
        </button>
      </div>
      <ul class="sidebar-menu">
        <li @click="navigateToSection('addManager')" :class="{ active: currentSection === 'addManager' }">
          Add Manager/Supervisor
        </li>
        <li @click="navigateToSection('viewManagers')" :class="{ active: currentSection === 'viewManagers' }">
          View Manager/Supervisor List
        </li>
        <li @click="navigateToSection('pendingStudents')" :class="{ active: currentSection === 'pendingStudents' }">
          Pending Student Registrations
        </li>
        <li @click="navigateToSection('acceptedStudents')" :class="{ active: currentSection === 'acceptedStudents' }">
          Accepted Students
        </li>
        <li @click="navigateToSection('rejectedStudents')" :class="{ active: currentSection === 'rejectedStudents' }">
          Rejected Students
        </li>
        <li @click="navigateToSection('assignQuizzes')" :class="{ active: currentSection === 'assignQuizzes' }">
          Assign Quizzes
        </li>
        <li @click="navigateToSection('viewAssignedQuizzes')" :class="{ active: currentSection === 'viewAssignedQuizzes' }">
          View Assigned Quizzes
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
        <!-- Add Manager/Supervisor Section -->
        <div v-if="currentSection === 'addManager'" class="card">
          <ManagerRegistrationForm @managerAdded="refreshManagers" />
        </div>

        <!-- View Manager/Supervisor List Section with Pagination -->
        <div v-if="currentSection === 'viewManagers'" class="card">
          <h3>View Manager/Supervisor List</h3>
          <div class="table-responsive">
            <table class="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th class="actions-column">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="manager in paginatedManagers" :key="manager.id">
                  <td>{{ manager.name }}</td>
                  <td>{{ manager.email }}</td>
                  <td>
                    <button class="btn btn-danger btn-sm" @click="deleteManager(manager.id)">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-if="!managers.length">No managers or supervisors available.</p>

          <!-- Pagination Controls for Managers/Supervisors -->
          <div class="pagination">
            <button class="btn btn-primary" @click="prevPage('manager')" :disabled="managerCurrentPage === 1">Previous</button>
            <span>Page {{ managerCurrentPage }} of {{ managerTotalPages }}</span>
            <button class="btn btn-primary" @click="nextPage('manager')" :disabled="managerCurrentPage === managerTotalPages">Next</button>
          </div>
        </div>

        <!-- Pending Student Registrations Section with Pagination -->
        <div v-if="currentSection === 'pendingStudents'" class="card">
          <h3>Pending Student Registrations</h3>
          <div v-for="student in paginatedPendingStudents" :key="student.id" class="student-card">
            <p><strong>Full Name:</strong> {{ student.name }}</p>
            <p><strong>Email:</strong> {{ student.email }}</p>
            <p><strong>Phone Number:</strong> {{ student.phone_number }}</p>
            <p>
              <button class="btn btn-success btn-sm" @click="acceptStudent(student)">Approve</button>
              <button class="btn btn-danger btn-sm" @click="rejectStudent(student)">Reject</button>
            </p>
          </div>
          <p v-if="!pendingStudentsArray.length">No pending registrations.</p>

          <!-- Pagination Controls for Pending Students -->
          <div class="pagination">
            <button class="btn btn-primary" @click="prevPage('pendingStudent')" :disabled="pendingStudentCurrentPage === 1">Previous</button>
            <span>Page {{ pendingStudentCurrentPage }} of {{ pendingStudentTotalPages }}</span>
            <button class="btn btn-primary" @click="nextPage('pendingStudent')" :disabled="pendingStudentCurrentPage === pendingStudentTotalPages">Next</button>
          </div>
        </div>

        <!-- Accepted Students Section with Pagination -->
        <div v-if="currentSection === 'acceptedStudents'" class="card">
          <h3>Accepted Students</h3>
          <div v-for="student in paginatedAcceptedStudents" :key="student.id" class="student-card">
            <p><strong>Full Name:</strong> {{ student.name }}</p>
            <p><strong>Email:</strong> {{ student.email }}</p>
            <p><strong>Phone Number:</strong> {{ student.phone_number }}</p>
          </div>
          <p v-if="!acceptedStudentsArray.length">No accepted students.</p>

          <!-- Pagination Controls for Accepted Students -->
          <div class="pagination">
            <button class="btn btn-primary" @click="prevPage('acceptedStudent')" :disabled="acceptedStudentCurrentPage === 1">Previous</button>
            <span>Page {{ acceptedStudentCurrentPage }} of {{ acceptedStudentTotalPages }}</span>
            <button class="btn btn-primary" @click="nextPage('acceptedStudent')" :disabled="acceptedStudentCurrentPage === acceptedStudentTotalPages">Next</button>
          </div>
        </div>

        <!-- Rejected Students Section with Pagination -->
        <div v-if="currentSection === 'rejectedStudents'" class="card">
          <h3>Rejected Students</h3>
          <div v-for="student in paginatedRejectedStudents" :key="student.id" class="student-card">
            <p><strong>Full Name:</strong> {{ student.name }}</p>
            <p><strong>Email:</strong> {{ student.email }}</p>
            <p><strong>Phone Number:</strong> {{ student.phone_number }}</p>
          </div>
          <p v-if="!rejectedStudentsArray.length">No rejected students.</p>

          <!-- Pagination Controls for Rejected Students -->
          <div class="pagination">
            <button class="btn btn-primary" @click="prevPage('rejectedStudent')" :disabled="rejectedStudentCurrentPage === 1">Previous</button>
            <span>Page {{ rejectedStudentCurrentPage }} of {{ rejectedStudentTotalPages }}</span>
            <button class="btn btn-primary" @click="nextPage('rejectedStudent')" :disabled="rejectedStudentCurrentPage === rejectedStudentTotalPages">Next</button>
          </div>
        </div>

        <!-- Assign Quizzes Section (Unchanged) -->
        <div v-if="currentSection === 'assignQuizzes'" class="card">
          <h3>Assign Quizzes</h3>
          <AssignQuiz @quizAssigned="refreshAssignedQuizzes" />
        </div>

        <!-- View Assigned Quizzes Section with Pagination -->
        <div v-if="currentSection === 'viewAssignedQuizzes'" class="card">
          <h3>View Assigned Quizzes</h3>
          <div class="table-responsive">
            <table class="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Quiz Title</th>
                  <th>Quiz ID</th>
                  <th>Status</th>
                  <th>Assigned Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="quiz in paginatedAssignedQuizzes" :key="quiz.id">
                  <td>{{ quiz.quiz.title }}</td>
                  <td>{{ quiz.quiz_id }}</td>
                  <td>{{ quiz.status }}</td>
                  <td>{{ quiz.assigned_at }}</td>
                  <td>
                    <span v-if="quiz.status === 'completed'">Quiz completed</span>
                    <span v-else>Assigned</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-if="!assignedQuizzes.length">No quizzes have been assigned yet.</p>

          <!-- Pagination Controls for Assigned Quizzes -->
          <div class="pagination">
            <button class="btn btn-primary" @click="prevPage('assignedQuiz')" :disabled="assignedQuizCurrentPage === 1">Previous</button>
            <span>Page {{ assignedQuizCurrentPage }} of {{ assignedQuizTotalPages }}</span>
            <button class="btn btn-primary" @click="nextPage('assignedQuiz')" :disabled="assignedQuizCurrentPage === assignedQuizTotalPages">Next</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Import relevant components and Vuex getters
import NavBar from '../components/NavBar.vue';
import ManagerRegistrationForm from '../components/ManagerRegistrationForm.vue';
import AssignQuiz from '../components/AssignQuiz.vue';
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  components: {
    NavBar,
    ManagerRegistrationForm,
    AssignQuiz,
  },
  data() {
    return {
      currentSection: 'addManager', // Default section
      isSidebarOpen: false,
      isSidebarVisibleOnPC: true, // Sidebar should be visible by default on larger screens
      // Pagination for managers/supervisors
      managerCurrentPage: 1,
      managerPageSize: 5,
      // Pagination for accepted students
      acceptedStudentCurrentPage: 1,
      acceptedStudentPageSize: 5,
      // Pagination for rejected students
      rejectedStudentCurrentPage: 1,
      rejectedStudentPageSize: 5,
      // Pagination for pending students
      pendingStudentCurrentPage: 1,
      pendingStudentPageSize: 5,
      // Pagination for assigned quizzes
      assignedQuizCurrentPage: 1,
      assignedQuizPageSize: 5,
      assignedQuizzes: [], // Store assigned quizzes data
    };
  },
  computed: {
    ...mapGetters(['pendingStudents', 'acceptedStudents', 'rejectedStudents', 'managers']),
    pendingStudentsArray() {
      return Object.values(this.pendingStudents);
    },
    acceptedStudentsArray() {
      return Object.values(this.acceptedStudents);
    },
    rejectedStudentsArray() {
      return Object.values(this.rejectedStudents);
    },
    // Pagination for managers/supervisors
    paginatedManagers() {
      const start = (this.managerCurrentPage - 1) * this.managerPageSize;
      const end = start + this.managerPageSize;
      return this.managers.slice(start, end);
    },
    managerTotalPages() {
      return Math.ceil(this.managers.length / this.managerPageSize);
    },
    // Pagination for accepted students
    paginatedAcceptedStudents() {
      const start = (this.acceptedStudentCurrentPage - 1) * this.acceptedStudentPageSize;
      const end = start + this.acceptedStudentPageSize;
      return this.acceptedStudentsArray.slice(start, end);
    },
    acceptedStudentTotalPages() {
      return Math.ceil(this.acceptedStudentsArray.length / this.acceptedStudentPageSize);
    },
    // Pagination for rejected students
    paginatedRejectedStudents() {
      const start = (this.rejectedStudentCurrentPage - 1) * this.rejectedStudentPageSize;
      const end = start + this.rejectedStudentPageSize;
      return this.rejectedStudentsArray.slice(start, end);
    },
    rejectedStudentTotalPages() {
      return Math.ceil(this.rejectedStudentsArray.length / this.rejectedStudentPageSize);
    },
    // Pagination for pending students
    paginatedPendingStudents() {
      const start = (this.pendingStudentCurrentPage - 1) * this.pendingStudentPageSize;
      const end = start + this.pendingStudentPageSize;
      return this.pendingStudentsArray.slice(start, end);
    },
    pendingStudentTotalPages() {
      return Math.ceil(this.pendingStudentsArray.length / this.pendingStudentPageSize);
    },
    // Pagination for assigned quizzes
    paginatedAssignedQuizzes() {
      const start = (this.assignedQuizCurrentPage - 1) * this.assignedQuizPageSize;
      const end = start + this.assignedQuizPageSize;
      return this.assignedQuizzes.slice(start, end);
    },
    assignedQuizTotalPages() {
      return Math.ceil(this.assignedQuizzes.length / this.assignedQuizPageSize);
    },
  },
  methods: {
    refreshManagers() {
      this.$store.dispatch('fetchManagers');
    },
    refreshAssignedQuizzes() {
      this.fetchAssignedQuizzes();
    },
    acceptStudent(student) {
      this.$store.dispatch('acceptStudent', student);
    },
    rejectStudent(student) {
      this.$store.dispatch('rejectStudent', student);
    },
    async deleteManager(managerId) {
      try {
        const token = localStorage.getItem('jwtToken');
        await axios.delete('http://192.168.15.67:8000/api/delete-manager', {
          headers: { Authorization: `Bearer ${token}` },
          data: { id: managerId }
        });
        alert('Manager deleted Succesfully.');
        this.refreshManagers();
      } catch (error) {
        console.error('Error deleting manager:', error);
        alert('Failed to delete manager. Please try again.');
      }
    },
    prevPage(type) {
      if (type === 'manager' && this.managerCurrentPage > 1) {
        this.managerCurrentPage--;
      } else if (type === 'acceptedStudent' && this.acceptedStudentCurrentPage > 1) {
        this.acceptedStudentCurrentPage--;
      } else if (type === 'rejectedStudent' && this.rejectedStudentCurrentPage > 1) {
        this.rejectedStudentCurrentPage--;
      } else if (type === 'pendingStudent' && this.pendingStudentCurrentPage > 1) {
        this.pendingStudentCurrentPage--;
      } else if (type === 'assignedQuiz' && this.assignedQuizCurrentPage > 1) {
        this.assignedQuizCurrentPage--;
      }
    },
    nextPage(type) {
      if (type === 'manager' && this.managerCurrentPage < this.managerTotalPages) {
        this.managerCurrentPage++;
      } else if (type === 'acceptedStudent' && this.acceptedStudentCurrentPage < this.acceptedStudentTotalPages) {
        this.acceptedStudentCurrentPage++;
      } else if (type === 'rejectedStudent' && this.rejectedStudentCurrentPage < this.rejectedStudentTotalPages) {
        this.rejectedStudentCurrentPage++;
      } else if (type === 'pendingStudent' && this.pendingStudentCurrentPage < this.pendingStudentTotalPages) {
        this.pendingStudentCurrentPage++;
      } else if (type === 'assignedQuiz' && this.assignedQuizCurrentPage < this.assignedQuizTotalPages) {
        this.assignedQuizCurrentPage++;
      }
    },
    navigateToSection(section) {
      this.currentSection = section;
    },
    async fetchAssignedQuizzes() {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('http://192.168.15.67:8000/api/assigned-quizzes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.assignedQuizzes = response.data.data || [];
      } catch (error) {
        console.error('Error fetching assigned quizzes:', error);
      }
    },
  },
  created() {
    this.$store.dispatch('fetchPendingStudents');
    this.$store.dispatch('fetchAcceptedStudents');
    this.$store.dispatch('fetchRejectedStudents');
    this.$store.dispatch('fetchManagers');
    this.fetchAssignedQuizzes();
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
  left: -250px; /* Initially hide sidebar */
  transition: left 0.5s ease;
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

/* Pagination Styles */
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination button {
  margin: 0 5px;
}

.pagination span {
  margin: 0 10px;
}

/* Mobile View Adjustments */
@media (max-width: 768px) {
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

  .pagination {
    flex-direction: column;
    gap: 10px;
  }
}

/* Adjust student cards for visual separation */
.student-card {
  background-color: #ffffff;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.student-card:not(:last-child) {
  margin-bottom: 20px; /* Add spacing between cards */
}

/* Table Styles for Improved Visibility on Mobile */
table thead {
  display: table-header-group; /* Show header on larger screens */
}

@media (max-width: 768px) {
  table thead {
    display: none; /* Hide table headers on small screens */
  }

  table tbody tr {
    display: block;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    padding: 10px;
  }

  table tbody tr td {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
}

/* Pagination Adjustments for Mobile */
@media (max-width: 480px) {
  .pagination {
    flex-direction: column;
  }

  .pagination button,
  .pagination span {
    margin-bottom: 10px;
  }
}

/* Action Buttons */
.btn {
  font-size: 14px;
}

.btn-sm {
  font-size: 12px;
  padding: 5px 10px;
}
</style>
