<script setup>
import { useRouter } from 'vue-router';

import Header from '../components/Header.vue';

const router = useRouter();
</script>

<template>
	<Header/>
	<div class="w-[1200px] max-w-full mx-auto flex items-center gap-4">
		<div class="w-52 h-52 flex items-center justify-center bg-white rounded-xl cursor-pointer"
		     @click="router.push('/admin/add-new/book')"
		>
			<p>Thêm sách</p>
		</div>
		<div class="w-52 h-52 flex items-center justify-center bg-white rounded-xl cursor-pointer"
		     @click="router.push('/admin/manager/lending')"
		>
			<p>Quản lý mượn sách</p>
		</div>
	</div>
</template>