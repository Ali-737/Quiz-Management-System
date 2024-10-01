<!-- src/components/ForgotPassword.vue -->
<template>
    <div class="forgot-password-wrapper">
      <div class="forgot-password-card">
        <h2>Forgot Password</h2>
        <p v-if="message" class="message">{{ message }}</p>
        <p v-if="errors.length" class="error-message">{{ errors.join('. ') }}</p>
  
        <form @submit.prevent="submitEmail">
          <div class="form-group">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="fas fa-envelope"></i>
                </span>
              </div>
              <input
                type="email"
                class="form-control"
                placeholder="Enter your email"
                v-model="email"
                required
              />
            </div>
          </div>
          <button type="submit" class="btn btn-primary">Send Reset Link</button>
        </form>
  
        <router-link to="/" class="back-to-login">Back to Login</router-link>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { ref } from 'vue';
  
  export default {
    setup() {
      const email = ref('');
      const message = ref('');
      const errors = ref([]);
  
      const submitEmail = async () => {
        errors.value = [];
        try {
          // Send the email to the backend to initiate the password reset process
          const response = await axios.post('http://192.168.15.67:8000/api/forgot-password', {
            email: email.value,
          });
          message.value = 'A password reset link has been sent to your email.';
          email.value = ''; // Clear the input
        } catch (error) {
          errors.value.push(error.response?.data?.message || 'Failed to send reset link. Please try again.');
        }
      };
  
      return {
        email,
        message,
        errors,
        submitEmail,
      };
    },
  };
  </script>
  
  <style scoped>
  .forgot-password-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #0f2027, #203a43, #2c5364, #2e495e);
    background-size: 300% 300%;
    animation: gradientAnimation 15s ease infinite;
  }
  
  .forgot-password-card {
    background: #2c3e50;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 400px;
    text-align: center;
  }
  
  .message {
    color: #4caf50;
    margin-bottom: 20px;
  }
  
  .error-message {
    color: #f44336;
    margin-bottom: 20px;
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
  
  .btn {
    width: 100%;
    padding: 10px;
    background-color: #f39c12;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .back-to-login {
    display: block;
    margin-top: 20px;
    color: #f9f9f9;
  }
  
  @keyframes gradientAnimation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  </style>
  