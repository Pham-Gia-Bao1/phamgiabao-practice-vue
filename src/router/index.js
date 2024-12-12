// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomeView.vue';
import DictionaryPage from '../views/DictionaryView.vue';
import CalculatorView from '@/views/CalculatorView.vue';
import EmployeesView from '@/views/EmployeesView.vue';

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/dictionary',
    name: 'DictionaryPage',
    component: DictionaryPage,
  },
  {
    path: '/calculator',
    name: 'CalculatorView',
    component: CalculatorView,
  },
  {
    path: '/employees',
    name: 'EmployeesView',
    component: EmployeesView,
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
