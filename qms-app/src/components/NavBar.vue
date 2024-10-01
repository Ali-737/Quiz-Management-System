<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <span class="navbar-title">Dashboard</span>
    </div>
    <div class="navbar-user">
      <!-- <span>Welcome, {{ userName }}</span> -->
    </div>
    <button class="logout-button" @click="logout">Logout</button>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  computed: {
    ...mapGetters(['userName']),
  },
  methods: {
    async logout() {
      try {
        const token = localStorage.getItem('jwtToken');
        if (token) {
          // Call the logout API
          await axios.post('http://192.168.15.67:8000/api/logout', {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        // Dispatch the Vuex logout action
        this.$store.dispatch('logout');

        // Redirect to the login page
        this.$router.push('/');
      } catch (error) {
        console.error('Error logging out:', error);
        alert('Logout failed. Please try again.');
      }
    },
  },
};
</script>

<style scoped>
.navbar {
  width: 100%;
  background-color: #2c3e50;
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
}

.navbar-title {
  font-size: 1.5rem;
  color: white;
}

.navbar-user {
  font-size: 1rem;
}

.logout-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
}

.logout-button:hover {
  background-color: #c0392b;
}
</style>
