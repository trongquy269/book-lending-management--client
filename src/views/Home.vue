<script setup>
import { ref, computed, inject } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

import { createSlug } from '../store/utils/createSlug';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

const router = useRouter();

const books = ref([]);

axios.get('/books').then((response) => {
	console.log(response);
	books.value = response.data;
});

const getCategory = (books) => {
	const list = [];

	books.forEach((book) => {
		if (!list.includes(book.category)) {
			list.push(book.category);
		}
	});

	return list;
};

console.log(
	createSlug(
		'Thành Phố Thông Minh - Nền Tảng, Nguyên Lý Và Ứng Dụng - HouBing Song, Ravi Srinivasan, Tamim Sookoor, Sabina Jeschke',
	),
);

const viewBook = (title, author, id) => {
	const convertedAuthor = author.join(', ');
	const path = createSlug(`${title} - ${convertedAuthor} - ${id}`);
	router.push(`/view/${path}`);
};

</script>
<template>
	<Header/>
	<div class="w-[1200px] max-w-full m-auto flex justify-center gap-4 relative">
		<!-- Side bar -->
		<div class="w-72 h-fit max-h-screen overflow-y-auto bg-white p-4 rounded-xl
					sticky top-0 left-0"
		>
			<div class="text-2xl font-bold mb-2">DANH MỤC SÁCH</div>
			<div v-for="(category, index) in getCategory(books)"
			     :key="index"
			     class="text-base truncate cursor-pointer hover:text-red-500 pt-2 pb-2"
			>
				{{ category }}
			</div>
		</div>
		<!-- Main -->
		<div class="flex-1 min-h-screen flex flex-wrap gap-4 bg-white p-4 rounded-xl">
			<div v-for="book in books"
			     :key="book.id"
			     class="w-40 h-fit bg-white p-4 border shadow-lg rounded cursor-pointer"
			     @click="viewBook(book.title, book.author, book._id)">
				<div class="h-40 flex items-center justify-center flex-wrap mb-5">
					<img
						:src="book.image[0]"
						alt=""
						class="h-full object-contain"
					/>
				</div>
				<div class="text-base font-bold text-red-500 mb-1">
					{{
						new Intl.NumberFormat('vi-VN', {
							style: 'currency',
							currency: 'VND',
						}).format(book.price)
					}}
				</div>
				<div class="text-sm line-clamp-2">
					{{ book.title }}
				</div>
			</div>
		</div>
	</div>
	<Footer/>
</template>
