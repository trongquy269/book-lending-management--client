<script setup>
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { onMounted, provide, ref } from 'vue';

const router = useRouter();
const store = useStore();

axios.defaults.baseURL = import.meta.env.VITE_BASE_API;
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.interceptors.response.use(
	(res) => res,
	(err) => {
		if (err?.response?.status === 401) {
			if (err?.response?.data?.message === 'Unauthorized') {
				router.push('/login');
			}
		}
		return Promise.reject(err);
	},
);

const userData = ref(null);

provide('userData', userData);

onMounted(async () => {
	try {
		const response = await axios.get('/user/info');
		console.log('User data fetched:', response.data);
		userData.value = response.data;
	} catch (error) {
		console.error('Error fetching user:', error);
	}
});
</script>

<template>
	<div class="w-full min-h-screen bg-slate-100">
		<RouterView/>
	</div>
</template>
