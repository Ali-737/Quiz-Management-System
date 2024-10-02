// store/index.js
import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
  state: {
    pendingStudents: {},
    acceptedStudents: {},
    rejectedStudents: {},
    managers: [], // Stores both Managers and Supervisors
    quizzes: [],
    assignedQuizzes: [],
    studentAssignedQuizzes: [], // Assigned quizzes for the logged-in student
    pendingQuizzes: [], // Pending quizzes for the student
    attemptedQuizzes: [], // Attempted quizzes by the student
    quizResults: [], // Quiz results for the student
    quizDetails: {}, // Store details of a specific quiz
    user: {
      role: '',
      name: '',
      email: '',
      student_id: '', // Student ID to filter quizzes
    },
    isAuthenticated: false, // Tracks if the user is authenticated
  },
  mutations: {
    setPendingStudents(state, students) {
      state.pendingStudents = students;
    },
    setAcceptedStudents(state, students) {
      state.acceptedStudents = students;
    },
    setRejectedStudents(state, students) {
      state.rejectedStudents = students;
    },
    setManagers(state, managers) {
      state.managers = managers;
    },
    removeManager(state, managerId) {
      state.managers = state.managers.filter(manager => manager.id !== managerId);
    },
    setQuizzes(state, quizzes) {
      state.quizzes = quizzes;
    },
    setAssignedQuizzes(state, assignedQuizzes) {
      state.assignedQuizzes = assignedQuizzes;
    },
    setStudentAssignedQuizzes(state, assignedQuizzes) {
      state.studentAssignedQuizzes = assignedQuizzes;
    },
    setPendingQuizzes(state, pendingQuizzes) {
      state.pendingQuizzes = pendingQuizzes;
    },
    setAttemptedQuizzes(state, attemptedQuizzes) {
      state.attemptedQuizzes = attemptedQuizzes;
    },
    setQuizResults(state, quizResults) {
      state.quizResults = quizResults;
    },
    setQuizDetails(state, quizDetails) {
      state.quizDetails = quizDetails;
    },
    setUser(state, userData) {
      state.user = userData;
      state.isAuthenticated = true; // Set user as authenticated
      localStorage.setItem('jwtToken', userData.token); // Store JWT token
    },
    logout(state) {
      state.user = { role: '', name: '', email: '', student_id: '' };
      state.isAuthenticated = false; // User is no longer authenticated
      localStorage.removeItem('jwtToken'); // Remove token from local storage
    },
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await axios.post('http://192.168.15.67:8000/api/login', credentials);
        const userData = {
          role: response.data.data.role,
          name: response.data.data.name,
          email: response.data.data.email,
          token: response.data.data.token,
          student_id: response.data.data.student_id || '',
        };
        commit('setUser', userData); // Store user data and token
        return response.data;
      } catch (error) {
        console.error('Error logging in:', error);
        throw error;
      }
    },
    async fetchPendingStudents({ commit }) {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('http://192.168.15.67:8000/api/students?status=pending', {
          headers: { Authorization: `Bearer ${token}` },
        });
        commit('setPendingStudents', response.data.data || {});
      } catch (error) {
        console.error('Error fetching pending students:', error);
      }
    },

    async fetchAcceptedStudents({ commit }) {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('http://192.168.15.67:8000/api/students?status=accepted', {
          headers: { Authorization: `Bearer ${token}` },
        });
        commit('setAcceptedStudents', response.data.data || {});
      } catch (error) {
        console.error('Error fetching accepted students:', error);
      }
    },

    async fetchRejectedStudents({ commit }) {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('http://192.168.15.67:8000/api/students?status=rejected', {
          headers: { Authorization: `Bearer ${token}` },
        });
        commit('setRejectedStudents', response.data.data || {});
      } catch (error) {
        console.error('Error fetching rejected students:', error);
      }
    },

    async fetchManagers({ commit }) {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('http://192.168.15.67:8000/api/managers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const managersData = response.data.data.map(manager => ({
          id: manager.id,
          name: manager.name,
          email: manager.email,
          role: manager.role || 'Unknown', // Fallback for missing role
        }));
        commit('setManagers', managersData);
      } catch (error) {
        console.error('Error fetching managers:', error);
        throw error;
      }
    },

    async deleteManager({ commit }, managerId) {
      try {
        const token = localStorage.getItem('jwtToken');
        await axios.post(
          'http://192.168.15.67:8000/api/delete-manager',
          { id: managerId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        commit('removeManager', managerId);
      } catch (error) {
        console.error('Error deleting manager:', error);
        throw error;
      }
    },

    async fetchQuizzes({ commit }) {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('http://192.168.15.67:8000/api/quizzes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        commit('setQuizzes', response.data.data || []);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        throw error;
      }
    },

    async fetchAssignedQuizzesForStudent({ commit, state }) {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`http://192.168.15.67:8000/api/student/${state.user.student_id}/assigned-quizzes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        commit('setStudentAssignedQuizzes', response.data.data || []);
      } catch (error) {
        console.error('Error fetching assigned quizzes for student:', error);
      }
    },

    async fetchPendingQuizzesForStudent({ commit, state }) {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`http://192.168.15.67:8000/api/student/${state.user.student_id}/pending-quizzes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        commit('setPendingQuizzes', response.data.data || []);
      } catch (error) {
        console.error('Error fetching pending quizzes:', error);
      }
    },

    async fetchAttemptedQuizzesForStudent({ commit, state }) {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`http://192.168.15.67:8000/api/student/${state.user.student_id}/attempted-quizzes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        commit('setAttemptedQuizzes', response.data.data || []);
      } catch (error) {
        console.error('Error fetching attempted quizzes:', error);
      }
    },

    async fetchQuizResultsForStudent({ commit, state }) {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`http://192.168.15.67:8000/api/student/${state.user.student_id}/quiz-results`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        commit('setQuizResults', response.data.data || []);
      } catch (error) {
        console.error('Error fetching quiz results:', error);
      }
    },

    async fetchQuizDetails({ commit }, quizId) {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`http://192.168.15.67:8000/api/take-quiz?id=${quizId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        commit('setQuizDetails', response.data.data || {});
      } catch (error) {
        console.error('Error fetching quiz details:', error);
      }
    },

    async submitQuizAttempt({ state }, { quizId, answers }) {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.post(
          'http://192.168.15.67:8000/api/submit-quiz-attempt',
          { quiz_id: quizId, answers },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
      } catch (error) {
        console.error('Error submitting quiz attempt:', error);
        throw error;
      }
    },

    async acceptStudent({ dispatch }, student) {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.post(
          'http://192.168.15.67:8000/api/add-student',
          { email: student.email },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Student accepted:', response.data);
        await dispatch('fetchPendingStudents');
        await dispatch('fetchAcceptedStudents');
      } catch (error) {
        console.error('Error accepting student:', error);
      }
    },

    async rejectStudent({ dispatch }, student) {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.post(
          'http://192.168.15.67:8000/api/reject-student',
          { email: student.email },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Student rejected:', response.data);
        await dispatch('fetchPendingStudents');
        await dispatch('fetchRejectedStudents');
      } catch (error) {
        console.error('Error rejecting student:', error);
      }
    },

    async registerManager({ commit }, managerData) {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.post(
          'http://192.168.15.67:8000/api/add-manager',
          { name: managerData.name, email: managerData.email, role: managerData.role },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(`${managerData.role} registered:`, response.data);
        return response.data;
      } catch (error) {
        console.error(`Error registering ${managerData.role}:`, error);
        throw error;
      }
    },

    async setManagerPassword({ commit }, payload) {
      try {
        const response = await axios.post(
          'http://192.168.15.67:8000/api/set-password',
          { password: payload.password, password_confirmation: payload.password_confirmation, email: payload.email, token: payload.token }
        );
        console.log('Password set successfully:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error setting password:', error);
        throw error;
      }
    },

    async assignQuiz({ dispatch }, { studentId, quizId }) {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.post(
          'http://192.168.15.67:8000/api/assign-quiz',
          { student_id: studentId, quiz_id: quizId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Quiz assigned successfully:', response.data);
        await dispatch('fetchAssignedQuizzesForStudent'); // Fetch updated assigned quizzes after assignment
        return response.data;
      } catch (error) {
        console.error('Error assigning quiz:', error);
        throw error;
      }
    },

    login({ commit }, userData) {
      commit('setUser', userData);
    },

    async logout({ commit }) {
      try {
        const token = localStorage.getItem('jwtToken');
        if (token) {
          await axios.post('http://192.168.15.67:8000/api/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
        }
      } catch (error) {
        console.error('Error logging out:', error);
      } finally {
        commit('logout');
      }
    },
  },
  getters: {
    pendingStudents(state) {
      return state.pendingStudents;
    },
    acceptedStudents(state) {
      return state.acceptedStudents;
    },
    rejectedStudents(state) {
      return state.rejectedStudents;
    },
    managers(state) {
      return state.managers;
    },
    quizzes(state) {
      return state.quizzes;
    },
    assignedQuizzes(state) {
      return state.assignedQuizzes;
    },
    isAuthenticated(state) {
      return state.isAuthenticated;
    },
    userRole(state) {
      return state.user.role;
    },
    userName(state) {
      return state.user.name;
    },
    userEmail(state) {
      return state.user.email;
    },
  },
});

export default store;
