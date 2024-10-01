<template>
  <div class="manager-registration-form">
    <h2>Add Manager or Supervisor</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Full Name</label>
        <input type="text" v-model="name" id="name" required class="form-control" />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" v-model="email" id="email" required class="form-control" />
      </div>
      <div class="form-group">
        <label for="role">Role</label>
        <select v-model="role" id="role" required class="form-control">
          <option value="Manager">Manager</option>
          <option value="Supervisor">Supervisor</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary">Add {{ role }}</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '', // Full Name
      email: '', // Email
      role: 'Manager', // Default role selected
    };
  },
  methods: {
    async submitForm() {
      try {
        // Send name, email, and role to the backend
        await this.$store.dispatch('registerManager', {
          name: this.name,
          email: this.email,
          role: this.role, // Include role in the payload
        });
        alert(`${this.role} successfully added!`);
        this.name = '';
        this.email = '';
        this.role = 'Manager'; // Reset the form after successful submission

        // Emit event to notify parent to refresh manager list
        this.$emit('managerAdded');
      } catch (error) {
        console.error(`Error registering ${this.role}:`, error);
        alert(`Failed to add ${this.role}. Please try again.`);
      }
    },
  },
};
</script>

<style scoped>
.manager-registration-form {
  max-width: 500px;
  margin: 20px auto;
}
.form-group {
  margin-bottom: 15px;
}
</style>
