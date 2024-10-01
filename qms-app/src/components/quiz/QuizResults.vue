<template>
  <div>
    <h3>Quiz Results</h3>
    <div v-if="quizResults.length > 0" class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Quiz Title</th>
            <th>Score</th>
            <th>Attempt Date</th>
            <th>Percentage</th> <!-- New Percentage Column -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="result in quizResults" :key="result.id">
            <td>{{ result.quiz?.title || 'N/A' }}</td> <!-- Display quiz title -->
            <td>{{ result.score }}</td> <!-- Display score -->
            <td>{{ result.attempted_at }}</td> <!-- Display attempt date -->
            <td>{{ calculatePercentage(result.score, result.quiz.total_marks) }}%</td> <!-- Display calculated percentage -->
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else>No quiz results available.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      quizResults: [], // Array to store quiz results
    };
  },
  methods: {
    // Fetch quiz results from the API using the attempted status
    async fetchQuizResults() {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('http://192.168.15.67:8000/api/my-assigned-quizzes?status=attempted', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Map the data to include 'score', 'attempted_at', and 'total_questions' fields
        this.quizResults = response.data.data.map((quiz) => ({
          ...quiz,
          score: quiz.score || 'N/A', // If score exists, display it; otherwise, show 'N/A'
          attempted_at: quiz.attempted_at || 'N/A', // If attempted_at exists, display it; otherwise, show 'N/A'
          total_questions: quiz.total_questions || 1, // Total questions (assuming it's included in the response)
        })) || [];

      } catch (error) {
        console.error('Error fetching quiz results:', error);
      }
    },

    // Calculate percentage based on score and total questions
    calculatePercentage(score, totalQuestions) {
      if (score === 'N/A' || totalQuestions === 0) return 'N/A';
      return (( score/ totalQuestions) * 100).toFixed(2);
    },
  },
  created() {
    this.fetchQuizResults(); // Fetch quiz results on component creation
  },
};
</script>

<style scoped>
.table-responsive {
  max-height: 400px;
  overflow-y: auto;
}

table {
  width: 100%;
}

th, td {
  padding: 10px;
  text-align: left;
}

th {
  background-color: #3498db;
  color: white;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}
</style>
