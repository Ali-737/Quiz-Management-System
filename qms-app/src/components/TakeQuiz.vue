<template>
  <div class="quiz-container">
    <h2 class="quiz-title">Take Quiz</h2>
    <div class="quiz-content">
      <div class="quiz-section">
        <div v-if="quizQuestions.length > 0">
          <form @submit.prevent="submitQuiz">
            <!-- Show one question at a time -->
            <div v-if="currentQuestionIndex < quizQuestions.length" class="question-card">
              <h3>Question {{ currentQuestionIndex + 1 }} of {{ quizQuestions.length }}</h3>
              <p>{{ quizQuestions[currentQuestionIndex].question_text }}</p>
              <div class="options-container">
                <!-- Render options dynamically -->
                <div v-for="(optionText, optionKey) in parseOptions(quizQuestions[currentQuestionIndex].options)" :key="optionKey" class="option">
                  <label>
                    <input
                      type="radio"
                      :name="`question-${quizQuestions[currentQuestionIndex].question_id}`"
                      :value="optionKey"
                      v-model="selectedAnswers[quizQuestions[currentQuestionIndex].question_id]"
                    />
                    {{ optionText }}
                  </label>
                </div>
              </div>
            </div>

            <!-- Navigation buttons for Previous and Next -->
            <div class="navigation-buttons">
              <button type="button" class="btn btn-secondary" @click="prevQuestion" :disabled="currentQuestionIndex === 0">
                Previous
              </button>
              <button type="button" class="btn btn-secondary" @click="nextQuestion" :disabled="currentQuestionIndex === quizQuestions.length - 1">
                Next
              </button>
            </div>

            <!-- Submit button for final submission -->
            <button type="submit" class="btn btn-success" v-if="currentQuestionIndex === quizQuestions.length - 1">
              Submit Quiz
            </button>
          </form>
        </div>
        <p v-else>No questions available for this quiz.</p>
      </div>

      <!-- Camera Feed Section -->
      <div class="camera-section">
        <video ref="cameraFeed" class="camera-feed" autoplay muted></video> <!-- Muted to prevent feedback -->
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      quizQuestions: [],
      selectedAnswers: {},
      currentQuestionIndex: 0,
      videoStream: null,
      mediaRecorder: null, 
      recordedBlobs: [], 
    };
  },
  methods: {
    // Parse the options JSON string
    parseOptions(options) {
      try {
        return JSON.parse(options);
      } catch (error) {
        console.error('Error parsing options:', error);
        return {};
      }
    },

    // Fetch quiz details and questions from the API using quiz ID
    async fetchQuizDetails(quizId) {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`http://192.168.15.67:8000/api/take-quiz?id=${quizId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Access the questions inside the nested "data" object
        this.quizQuestions = response.data.data?.questions || [];
      } catch (error) {
        console.error('Error fetching quiz details:', error);
      }
    },

    // Method to handle quiz submission
    async submitQuiz() {
      try {
        // Stop video recording before submitting
        await this.stopRecording();

        const quizId = this.$route.params.quizId;
        const token = localStorage.getItem('jwtToken');
        const studentId = localStorage.getItem('studentId'); // Assuming the student ID is stored in localStorage

        // Prepare answers in the required format
        const answersArray = Object.keys(this.selectedAnswers).map((questionId) => {
          return {
            question_id: Number(questionId),
            answer: this.selectedAnswers[questionId],
          };
        });

        // Convert recorded blobs to a file after recording has been stopped
        const recordedBlob = new Blob(this.recordedBlobs, { type: 'video/mp4' });
        const recordedFile = new File([recordedBlob], 'recording.mp4', { type: 'video/mp4' });
        
        console.log('Recorded video file size:', recordedFile.size, 'bytes');

        // Save the video locally for testing
        const url = URL.createObjectURL(recordedBlob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'recording.mp4');
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);

        const formData = new FormData();
        formData.append('id', quizId);
        formData.append('student_id', studentId); // Assuming 'student_id' is required
        formData.append('answers', JSON.stringify({ answers: answersArray })); // Send answers in the required format
        formData.append('video', recordedFile, 'recording.mp4'); // Attach the video file

        // Send the quiz submission and video recording to the backend
        const response = await axios.post(
          'http://192.168.15.67:8000/api/submit-quiz-attempt',
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        alert('Quiz submitted successfully!');
        console.log('Quiz submission response:', response.data);

        this.$router.push('/student-dashboard'); // Redirect to student dashboard after submission
      } catch (error) {
        console.error('Error submitting quiz:', error);
        alert('Error submitting quiz. Please try again.');
      }
    },

    // Move to the next question
    nextQuestion() {
      if (this.currentQuestionIndex < this.quizQuestions.length - 1) {
        this.currentQuestionIndex++;
      }
    },

    // Move to the previous question
    prevQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
      }
    },

    // Enable mic and camera for video recording during quiz
    async enableVideoRecording() {
      try {
        // Request access to video and audio
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        this.videoStream = stream;

        // Set up the video feed element
        const videoElement = this.$refs.cameraFeed;
        videoElement.srcObject = stream;

        // Set up MediaRecorder for recording the video
        this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp8,opus' });
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            console.log('Data available:', event.data.size, 'bytes');
            this.recordedBlobs.push(event.data);
          }
        };
        this.mediaRecorder.start(100); // Start recording with chunks every 100ms

        alert('Video recording started successfully');
      } catch (error) {
        console.error('Error enabling video recording:', error);
        alert('Could not access camera and microphone. Please check your permissions.');
      }
    },

    // Stop video recording
    stopRecording() {
      return new Promise((resolve) => {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
          this.mediaRecorder.onstop = () => {
            console.log('Recording stopped. Blobs recorded:', this.recordedBlobs.length);
            resolve();
          };
          this.mediaRecorder.stop(); // Stop the recorder
        }

        if (this.videoStream) {
          // Stop all tracks
          this.videoStream.getTracks().forEach((track) => track.stop());
          this.videoStream = null;
        }
      });
    },
  },

  created() {
    const quizId = this.$route.params.quizId;
    this.fetchQuizDetails(quizId); // Fetch quiz details when the component is created
    this.enableVideoRecording(); // Enable video recording on quiz start
  },

  beforeDestroy() {
    this.stopRecording(); // Stop video recording when the component is destroyed
  },
};
</script>

<style scoped>
.quiz-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.quiz-title {
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
}

.quiz-content {
  display: flex;
  justify-content: space-between;
}

.quiz-section {
  flex: 2;
}

.question-card {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.options-container {
  margin-top: 10px;
}

.option {
  margin-bottom: 10px;
}

.camera-section {
  flex: 1;
  padding: 10px;
}

.camera-feed {
  width: 100%;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-secondary {
  background-color: #95a5a6;
  color: #fff;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
}

.btn-success {
  background-color: #27ae60;
  color: #fff;
}

.btn-success:hover {
  background-color: #1e8449;
}
</style>
