<template>
  <div class="registration-wrapper">
    <div class="registration-card">
      <h1 class="registration-title">Student Registration</h1>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fas fa-user"></i>
              </span>
            </div>
            <input
              v-model="student.name"
              type="text"
              class="form-control"
              placeholder="Full Name"
              required
            />
          </div>
        </div>
        <div class="form-group">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fas fa-envelope"></i>
              </span>
            </div>
            <input
              v-model="student.email"
              type="email"
              class="form-control"
              placeholder="Email Address"
              required
            />
          </div>
        </div>
        <div class="form-group">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fas fa-phone"></i>
              </span>
            </div>
            <input
              v-model="student.phone_number"
              type="text"
              class="form-control"
              placeholder="Phone Number"
              required
            />
          </div>
        </div>
        <div class="form-group">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fas fa-file-alt"></i>
              </span>
            </div>
            <input @change="handleFileUpload" type="file" class="form-control" required />
          </div>
        </div>
        <button type="submit" class="btn btn-success registration-btn">Register</button>
      </form>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      student: {
        name: '',
        email: '',
        phone_number: '', // Update to match backend field 'phone_number'
        cv: null, // For the uploaded CV
      },
      successMessage: '',
      errorMessage: '',
    };
  },
  methods: {
    handleFileUpload(event) {
      this.student.cv = event.target.files[0]; // Capture the uploaded CV file
    },
    async submitForm() {
      try {
        const formData = new FormData();
        formData.append('name', this.student.name);
        formData.append('email', this.student.email);
        formData.append('phone_number', this.student.phone_number); // Match the backend field 'phone_number'
        formData.append('cv', this.student.cv); // Append CV file

        // Log the FormData to verify the correct data is being sent
        for (var pair of formData.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }

        // Post data to the student registration API
        const response = await axios.post('http://192.168.15.67:8000/api/register/student', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Ensure proper handling of the form data
          },
        });

        // Log the response for debugging
        console.log('API Response:', response);

        // Check response and handle success
        if (response.data.status === 200) {
          this.successMessage = 'Registration successful! Please wait for admin approval.';
          this.clearForm();
        } else {
          throw new Error(response.data.message || 'Registration failed. Please try again.');
        }
      } catch (error) {
        console.error('Registration error:', error);
        this.errorMessage = error.response?.data?.message || 'Error during registration. Please try again.';
      }
    },
    clearForm() {
      this.student = { name: '', email: '', phone_number: '', cv: null };
    },
  },
};
</script>

<style scoped>
.registration-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('@/assets/3098169.jpg'); /* Use the background image */
  background-size: cover; /* Cover the entire area */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Avoid repeating the image */
}

.registration-card {
  background: rgba(44, 62, 80, 0.85); /* Semi-transparent background */
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
  transition: all 0.3s ease;
}

.registration-title {
  color: #f39c12;
  margin-bottom: 20px;
  font-size: 2rem;
}

.form-group {
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  align-items: center;
}

.input-group-prepend {
  background: #34495e;
  padding: 10px;
  border-radius: 5px 0 0 5px;
}

.form-control {
  border-radius: 0 5px 5px 0;
  background-color: #f9f9f9;
  padding: 10px;
  border: none;
}

.registration-btn {
  width: 100%;
  background: #f39c12;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.registration-btn:hover {
  background: #e67e22;
}

.success-message {
  color: #28a745;
  margin-top: 20px;
}

.error-message {
  color: #e3342f;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .registration-card {
    padding: 20px;
  }
}
</style>
