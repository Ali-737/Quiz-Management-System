<template>
  <div>
    <h3>Assigned Quizzes</h3>
    <div v-if="assignedQuizzes.length" class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Quiz Title</th>
            <th>Status</th>
            <th>Assigned Date</th>
            <!-- Removed Actions header since there's no button -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="quiz in assignedQuizzes" :key="quiz.id">
            <td>{{ quiz.quiz?.title || 'N/A' }}</td> <!-- Display quiz title -->
            <td>{{ quiz.status }}</td> <!-- Display status -->
            <td>{{ quiz.assigned_at }}</td> <!-- Display assigned date -->
            <!-- Removed the Actions column and button -->
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else>No assigned quizzes available.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['studentId'],
  data() {
    return {
      assignedQuizzes: [],
    };
  },
  methods: {
    // Fetch assigned quizzes for the student using status-based API
    async fetchAssignedQuizzes() {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('http://192.168.15.67:8000/api/my-assigned-quizzes?status=assigned', {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.assignedQuizzes = response.data.data || [];
      } catch (error) {
        console.error('Error fetching assigned quizzes:', error);
      }
    },
  },
  created() {
    this.fetchAssignedQuizzes(); // Fetch quizzes on component creation
  },
};
</script>

<style scoped>
.table-responsive {
  max-height: 400px;
  overflow-y: auto;
}
</style>
