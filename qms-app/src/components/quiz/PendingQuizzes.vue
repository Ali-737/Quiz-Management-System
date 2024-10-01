<template>
  <div>
    <h3>Active Quizzes</h3> <!-- Updated to 'Active Quizzes' instead of 'Pending Quizzes' -->
    <div v-if="activeQuizzes.length" class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Quiz Title</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Actions</th> <!-- Added Actions column -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="quiz in activeQuizzes" :key="quiz.id">
            <td>{{ quiz.quiz?.title || 'N/A' }}</td> <!-- Check if quiz title exists -->
            <td>{{ quiz.status }}</td>
            <td>{{ quiz.due_date }}</td>
            <td>
              <button
                class="btn btn-primary"
                @click="takeQuiz(quiz)"
                :disabled="quiz.status === 'completed'"
              >
                {{ quiz.status === 'completed' ? 'Completed' : 'Take Quiz' }}
              </button>
            </td> <!-- Added Take Quiz button -->
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else>No active quizzes available.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['studentId'], // Receive studentId as a prop
  data() {
    return {
      activeQuizzes: [], // Active quizzes for the student
    };
  },
  methods: {
    // Fetch active quizzes for the student using the new API structure
    async fetchActiveQuizzes() {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`http://192.168.15.67:8000/api/my-assigned-quizzes?status=assigned`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.activeQuizzes = response.data.data || [];
      } catch (error) {
        console.error('Error fetching active quizzes:', error);
      }
    },
    // Redirect to the Take Quiz page
    takeQuiz(quiz) {
      this.$router.push({ name: 'TakeQuiz', params: { quizId: quiz.id } });
    },
  },
  created() {
    this.fetchActiveQuizzes(); // Fetch active quizzes when the component is created
  },
};
</script>

<style scoped>
.table-responsive {
  max-height: 400px;
  overflow-y: auto;
}
</style>
