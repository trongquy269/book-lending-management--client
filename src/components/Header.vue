<script setup>
import { useRouter } from 'vue-router';
import { inject, computed } from 'vue';
import axios from 'axios';

const userData = inject('userData');
const userInfo = computed(() => userData?.value || {});
const router = useRouter();

const logout = () => {
	axios.post('/logout')
	     .then(res => {
		     if (res?.data?.message === 'Success') {
			     router.push('/login');
		     }
	     });
};

</script>

<template>
	<div class="w-full h-16 bg-white mb-5">
		<div class="w-[1200px] max-w-full h-full mx-auto flex items-center justify-between">
			<div class="flex items-center gap-3" @click="router.push('/')">
				<img alt="logo" class="w-14 h-14 cursor-pointer" src="/logo.png">
				<p class="text-3xl font-semibold text-slate-500">BOOK LENDING</p>
			</div>
			<div class="px-4 py-2 border border-transparent hover:border-cyan-500
				cursor-pointer hover:text-cyan-700 rounded-xl"
			     @click="logout"
			>
				{{ userInfo.name }}
			</div>
		</div>
	</div>
</template>