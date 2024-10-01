<!-- src/components/ViewManagers.vue -->
<template>
  <div class="manager-list">
    <div v-if="managersArray.length">
      <div class="table-responsive">
        <table class="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Actions</th> <!-- Add a column header for actions -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="manager in paginatedManagers" :key="manager.id">
              <td>{{ manager.name }}</td>
              <td>{{ manager.email }}</td>
              <td>
                <!-- Delete button for each manager -->
                <button class="btn btn-danger btn-sm" @click="deleteManager(manager.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div class="pagination-controls">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
    <p v-else>No managers available.</p>
  </div>
</template>

<script>
export default {
  props: {
    refresh: Boolean, // This will tell the component to re-fetch managers when it changes
  },
  data() {
    return {
      managersArray: [], // Array to store all the managers
      currentPage: 1, // Track the current page number
      pageSize: 4, // Number of items to display per page
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.managersArray.length / this.pageSize); // Calculate total pages based on the number of managers and page size
    },
    paginatedManagers() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.managersArray.slice(startIndex, endIndex); // Return only the managers for the current page
    },
  },
  watch: {
    refresh: 'fetchManagers', // Watch for the refresh prop change to trigger the fetch
  },
  methods: {
    async fetchManagers() {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await this.$store.dispatch('fetchManagers', token);
        this.managersArray = response;
      } catch (error) {
        console.error('Error fetching managers:', error);
      }
    },
    // Method to delete a manager by their ID
    async deleteManager(managerId) {
      const confirmDelete = confirm('Are you sure you want to delete this manager?');
      if (!confirmDelete) return;

      try {
        const token = localStorage.getItem('jwtToken');
        await this.$store.dispatch('deleteManager', { id: managerId });
        alert('Manager deleted successfully!');
        this.fetchManagers(); // Refresh the list of managers after deletion
      } catch (error) {
        console.error('Error deleting manager:', error);
        alert('Failed to delete the manager. Please try again.');
      }
    },
    // Go to the previous page
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    // Go to the next page
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
  },
  created() {
    this.fetchManagers(); // Fetch managers when the component is created
  },
};
</script>

<style scoped>
.manager-list {
  margin-top: 20px;
}

.table-responsive {
  max-width: 100%;
  overflow-x: auto;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-controls button {
  padding: 5px 10px;
  margin: 0 5px;
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;
}

.pagination-controls button[disabled] {
  background-color: #ddd;
  cursor: not-allowed;
}

.pagination-controls span {
  font-weight: bold;
}
</style>
