<!-- src/components/SetPassword.vue -->
<template>
    <div class="auth-container">
      <div class="auth-card">
        <h2>Set Your Password</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="password">New Password</label>
            <input
              type="password"
              v-model="password"
              id="password"
              required
              class="form-control"
              placeholder="Enter new password"
            />
          </div>
          <div class="form-group">
            <label for="password_confirmation">Confirm Password</label>
            <input
              type="password"
              v-model="password_confirmation"
              id="password_confirmation"
              required
              class="form-control"
              placeholder="Confirm password"
            />
          </div>
          <button type="submit" class="btn btn-primary">Set Password</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        password: '',
        password_confirmation: '',
        email: '', // Assuming the email is passed via the URL or stored
        token: '', // Token extracted from the URL
      };
    },
    created() {
      // Extract token from the URL query parameters
      const queryParams = new URLSearchParams(window.location.search);
      this.token = queryParams.get('token'); // Extract token from ?token=<value>
      this.email = queryParams.get('email'); // Assuming email is also passed as a query param (if needed)
    },
    methods: {
      async submitForm() {
        if (this.password !== this.password_confirmation) {
          alert('Passwords do not match');
          return;
        }
  
        try {
          const payload = {
            password: this.password,
            password_confirmation: this.password_confirmation,
            email: this.email,
            token: this.token,
          };
  
          // Dispatch the action to set the password using the provided token
          await this.$store.dispatch('setManagerPassword', payload);
  
          alert('Password successfully set!');
          this.password = '';
          this.password_confirmation = '';
        } catch (error) {
          console.error('Error setting password:', error);
          alert('Failed to set password. Please try again.');
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(to right, #34495e, #2c3e50);
  }
  
  .auth-card {
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    width: 400px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-control {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .btn {
    width: 100%;
    padding: 10px;
    background-color: #34495e;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
  }
  
  .btn:hover {
    background-color: #2c3e50;
  }
  </style>
  