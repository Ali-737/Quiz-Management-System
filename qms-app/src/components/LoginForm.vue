<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h1 class="login-title">Login</h1>
      <p class="success-message" v-if="successMessage">{{ successMessage }}</p>
      <p class="error-message" v-if="errors.length">{{ errors.join('. ') }}</p>

      <form @submit.prevent="loginUser">
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
              placeholder="Email"
              v-model="email"
              required
            />
          </div>
        </div>
        <div class="form-group">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fas fa-lock"></i>
              </span>
            </div>
            <input
              type="password"
              class="form-control"
              placeholder="Password"
              v-model="password"
              required
            />
          </div>
        </div>
        <button type="submit" class="btn btn-success login-btn">Login</button>
      </form>

      <p class="account-link">
        New here?
        <router-link to="/register" class="underline-link">Create an Account</router-link>
      </p>

      <!-- Forgot Password Link -->
      <p class="forgot-password-link">
        <router-link to="/forgot-password" class="underline-link">Forgot Password?</router-link>
      </p>

      <!-- Social Media Buttons -->
      <div class="social-login">
        <button class="btn btn-social btn-google d-flex align-items-center">
          <i class="fab fa-google me-2"></i> Google
        </button>
        <button class="btn btn-social btn-microsoft d-flex align-items-center">
          <i class="fab fa-microsoft me-2"></i> Microsoft
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const router = useRouter();
    const successMessage = ref('');
    const errors = ref([]);

    const loginUser = async () => {
      errors.value = []; // Clear any previous errors

      try {
        // Make a POST request to the login API
        const response = await axios.post('http://192.168.15.67:8000/api/login', {
          email: email.value,
          password: password.value,
        });

        if (response.data.status === 200) {
          const token = response.data.data.token; // Token from response body
          const role = response.data.data.role;   // Role from response body
          const studentId = response.data.data.id; 
          console.log(studentId);

          if (token) {
            // Store token, role, and student ID in localStorage
            localStorage.setItem('jwtToken', token);
            localStorage.setItem('userRole', role);
            localStorage.setItem('studentId', studentId); // Store student ID

            // Set success message
            successMessage.value = "Login Successful!";

            // Redirect based on the user's role
            console.log('User role:', role);
            switch (role) {
              case 'admin':
                await router.push('/admin-dashboard');
                break;
              case 'manager':
                await router.push('/manager-dashboard');
                break;
              case 'student':
                await router.push('/student-dashboard');
                break;
              default:
                await router.push('/');
            }
          } else {
            throw new Error('Token not received');
          }
        } else {
          throw new Error(response.data.message || 'Login failed. Please try again.');
        }
      } catch (error) {
        console.error('Login Error:', error.response ? error.response.data : error);
        errors.value.push(
          error.response?.data?.message || error.message || 'Login failed. Please try again.'
        );
      }
    };

    return {
      email,
      password,
      loginUser,
      successMessage,
      errors,
    };
  },
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('@/assets/3098169.jpg'); /* Use the background image */
  background-size: cover; /* Cover the entire area */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Avoid repeating the image */
}

.login-card {
  background: rgba(44, 62, 80, 0.85); /* Semi-transparent background */
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
  transition: all 0.3s ease;
}

.login-title {
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

.login-btn {
  width: 100%;
  background: #f39c12;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.login-btn:hover {
  background: #e67e22;
}

.account-link {
  margin-top: 20px;
  color: #f9f9f9;
}

.underline-link {
  color: rgb(84, 175, 208);
}

.forgot-password-link {
  margin-top: 10px;
  color: #f9f9f9;
}

.social-login {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
}

.btn-social {
  display: inline-block;
  padding: 10px;
  border-radius: 5px;
  color: white;
  width: 45%;
}

.btn-google {
  background-color: #db4437;
}

.btn-microsoft {
  background-color: #0078d7;
}

@media (max-width: 768px) {
  .login-card {
    padding: 20px;
  }
}
</style>
