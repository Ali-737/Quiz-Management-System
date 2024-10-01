<template>
  <div class="assign-quiz">
    <h3>Assign Quiz to Student</h3>

    <form @submit.prevent="assignQuiz">
      <!-- Select Student -->
      <div class="form-group">
        <label for="student">Select Student (by Email):</label>
        <select v-model="selectedStudent" id="student" class="form-control">
          <option v-for="student in students" :key="student.id" :value="student.id">
            {{ student.email }}
          </option>
        </select>
      </div>

      <!-- Select Quiz -->
      <div class="form-group">
        <label for="quiz">Select Quiz:</label>
        <select v-model="selectedQuiz" id="quiz" class="form-control">
          <option v-for="quiz in quizzes" :key="quiz.id" :value="quiz.id">
            {{ quiz.title }}
          </option>
        </select>
      </div>

      <button type="submit" class="btn btn-success">Assign Quiz</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      students: [],
      quizzes: [],
      selectedStudent: null,
      selectedQuiz: null,
    };
  },
  methods: {
    async fetchStudents() {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('http://192.168.15.67:8000/api/students', {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.students = response.data.data || [];
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    },

    async fetchQuizzes() {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('http://192.168.15.67:8000/api/quizzes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.quizzes = response.data.data || [];
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    },

    async assignQuiz() {
      if (!this.selectedStudent || !this.selectedQuiz) {
        alert('Please select a student and a quiz.');
        return;
      }

      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.post(
          'http://192.168.15.67:8000/api/assign-quiz',
          {
            student_id: this.selectedStudent,
            quiz_id: this.selectedQuiz,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log('Quiz assigned successfully:', response.data);
        alert('Quiz assigned successfully!');
        this.$emit('quizAssigned'); // Emit event to parent to refresh the quiz list
      } catch (error) {
        console.error('Error assigning quiz:', error);
        alert('Failed to assign the quiz.');
      }
    },
  },
  created() {
    this.fetchStudents();
    this.fetchQuizzes();
  },
};
</script>

<style scoped>
.assign-quiz {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.btn-success {
  background-color: #28a745;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
}

.btn-success:hover {
  background-color: #218838;
}
</style>
