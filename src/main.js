import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import store from './store/utils/store.js';

createApp(App)
	.use(router)
	.use(store)
	.mount('#app');
