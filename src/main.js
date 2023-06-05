import { createApp } from 'vue'
import './style.css'
import App from './App.vue';
import axios from 'axios';

const app = createApp(App);

axios.defaults.baseURL = 'http://127.0.0.1:8000/api'; // Configurar la URL base
app.config.globalProperties.$axios = axios;

app.mount('#app');
