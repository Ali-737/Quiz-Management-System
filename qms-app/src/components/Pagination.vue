<!-- src/components/Pagination.vue -->
<template>
    <div class="pagination-controls">
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="btn btn-secondary">
        &laquo; Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="btn btn-secondary">
        Next &raquo;
      </button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      totalItems: {
        type: Number,
        required: true,
      },
      itemsPerPage: {
        type: Number,
        default: 10,
      },
      currentPage: {
        type: Number,
        default: 1,
      },
    },
    computed: {
      totalPages() {
        return Math.ceil(this.totalItems / this.itemsPerPage);
      },
    },
    methods: {
      goToPage(page) {
        // Emit an event with the new page number to the parent component
        if (page > 0 && page <= this.totalPages) {
          this.$emit('page-changed', page);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .pagination-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
  
  .pagination-controls button {
    margin: 0 10px;
  }
  </style>
  