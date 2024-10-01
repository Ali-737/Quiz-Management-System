<template>
  <div>
    <h3>Attempted Quizzes</h3>
    <div v-if="attemptedQuizzes.length > 0" class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Quiz Title</th>
            <th>Status</th>
            <th>Attempt Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="quiz in attemptedQuizzes" :key="quiz.id">
            <td>{{ quiz.quiz?.title || 'N/A' }}</td>
            <td>{{ quiz.status}}</td>
            <td>{{ quiz.attempted_at }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else>No attempted quizzes available.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      attemptedQuizzes: [],
    };
  },
  methods: {
    // Fetch attempted quizzes using the new status-based API
    async fetchAttemptedQuizzes() {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('http://192.168.15.67:8000/api/my-assigned-quizzes?status=attempted', {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.attemptedQuizzes = response.data.data || [];
      } catch (error) {
        console.error('Error fetching attempted quizzes:', error);
      }
    },
  },
  created() {
    this.fetchAttemptedQuizzes();
  },
};
</script>
