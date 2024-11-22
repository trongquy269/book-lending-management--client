<script lang="js" setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import { createSlug } from '../store/utils/createSlug.js';

const route = useRoute();
const router = useRouter();
const [bookSlug, bookId] = route.params.slug.split('-').slice(-2);

const book = ref({});
const sameBook = ref([]);
const imageActive = ref(0);
const lendingState = ref('');

// Fetch book data from the server
const fetchBookData = (bookId) => {
	axios.get('/book', {
		params: {
			bookId,
		},
	}).then((res) => {
		if (res?.data) {
			book.value = res.data.result;
			sameBook.value = res.data.same;
			// Ensure the first image is selected after loading data
			if (book.value.image && book.value.image.length > 0) {
				imageActive.value = 0; // set default active image
			}
		}
	}).catch((err) => {
		console.log(err);
	});

	axios.get('/check/lending', {
		params: {
			bookId,
		},
	}).then(res => {
		if (res?.data) {
			lendingState.value = res.data;
		}
	}).catch(err => {
		console.log(err);
	});
};

onMounted(() => {
	fetchBookData(bookId);
});

// Watch for changes in book.image and adjust active image if needed
watch(() => book.value.image, (newImage) => {
	if (newImage && newImage.length > 0 && imageActive.value >= newImage.length) {
		imageActive.value = 0; // Reset to the first image if the active index is out of bounds
	}
});

const setActiveImage = (index) => {
	imageActive.value = index;
};

const formattedDescription = computed(() => {
	return book.value.description ? book.value.description.replace(/\\n/g, '<br>') : '';
});

const viewBook = (title, author, id) => {
	const convertedAuthor = author.join(', ');
	const path = createSlug(`${title} - ${convertedAuthor} - ${id}`);
	router.push(`/view/${path}`);
};

// Hook for handling re-fetching when the route changes
watch(() => route.params.slug, (newSlug, oldSlug) => {
	const newBookId = newSlug.split('-').slice(-2)[1];
	const oldBookId = oldSlug.split('-').slice(-2)[1];

	if (newBookId !== oldBookId) {
		fetchBookData(newBookId); // Fetch new book data if the bookId changes
	}
});

// Re-fetch data when the route is updated (e.g., going back to a previous book)
router.beforeEach((to, from, next) => {
	if (!!!to.params.slug) {
		next();
	}
	const newBookId = to.params.slug.split('-').slice(-2)[1];
	if (newBookId !== bookId) {
		fetchBookData(newBookId); // Fetch new book data when going back to a different book
	}
	next();
});

const lendHandler = () => {
	if (lendingState.value?.state === 'waiting') {
		axios.post('/cancel/lend', {
			bookId,
		}).then(res => {
			if (res?.data) {
				fetchBookData(bookId);
			}
		}).catch(err => {
			console.log(err);
		});
	} else {
		axios.post('/lend', {
			bookId,
		}).then(res => {
			if (res?.data) {
				fetchBookData(bookId);
			}
		}).catch(err => console.log(err));
	}
};
</script>

<template>
	<Header/>
	<div class="w-[1200px] max-w-full m-auto">
		<div class="w-full flex gap-6">
			<div class="w-96 p-10 bg-white rounded-2xl">
				<!-- Active Image Display -->
				<div class="w-full h-96 px-10 py-4 flex items-center justify-center border rounded-xl">
					<!-- Only render image if book.image is defined and not empty -->
					<img
						v-if="book.image && book.image.length > 0"
						:src="book.image[imageActive]"
						alt="Book Image"
						class="h-80 object-cover border"
					/>
				</div>

				<!-- Thumbnails -->
				<div class="w-full flex items-center gap-2 overflow-x-auto">
					<!-- Loop through book images to display thumbnails -->
					<div
						v-for="(image, index) in book.image"
						:key="index"
						:class="{ 'border-blue-600': index === imageActive }"
						class="w-14 h-14 p-1 flex items-center justify-center border rounded-xl mt-2 cursor-pointer"
						@click="setActiveImage(index)"
					>
						<img
							:src="image"
							alt="Thumbnail"
							class="h-full object-cover"
						/>
					</div>
				</div>
			</div>
			<div class="flex-1 rounded-2xl bg-white px-4 py-6">
				<p class="text-sm">Tác giả:
					<span class="text-blue-600">{{ book?.author?.join(', ') }}</span>
				</p>
				<p class="text-2xl font-semibold mt-2">
					{{ book.title }}
				</p>
				<p class="text-xl font-semibold mt-2 text-red-500">
					{{
						new Intl.NumberFormat('vi-VN', {
							style: 'currency',
							currency: 'VND',
						}).format(book.price)
					}}
				</p>
				<p v-if="lendingState?.state === 'waiting'"
				   class="text-sm text-red-500 mt-4 mb-[-8px]"
				>
					Đang chờ xét duyệt
				</p>
				<button :class="lendingState?.state === 'waiting' && 'bg-red-500 text-white'"
				        class="px-4 py-2 bg-cyan-200 rounded hover:opacity-80 mt-4"
				        @click="lendHandler"
				>
					{{
						lendingState?.state === 'waiting' ? 'Huỷ' :
						lendingState?.state === 'approved' ? 'Đã duyệt' :
						lendingState?.state === 'lending' ? 'Đang mượn sách' :
						'Đăng ký mượn sách'
					}}
				</button>
			</div>
		</div>
		<div class="w-full bg-white rounded-2xl mt-6 px-4 py-6">
			<p class="text-2xl font-semibold mb-2">Mô tả</p>
			<p class="text-justify" v-html="formattedDescription"></p>
		</div>
		<div class="w-full bg-white px-4 py-6 rounded-xl mt-6">
			<p class="text-2xl font-semibold mb-2">Sách tương tự</p>
			<div class="w-full flex items-center gap-4 overflow-x-auto">
				<div v-for="book in sameBook"
				     :key="book.id"
				     class="min-w-40 max-w-40 h-fit bg-white p-4 border shadow-lg rounded
				     cursor-pointer"
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
	</div>
	<Footer/>
</template>
