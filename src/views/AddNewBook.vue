<script setup>
import { ref } from 'vue';
import axios from 'axios';

import inputDate from '../components/inputDate.vue';

const selectedFiles = ref([]);
const preview = ref([]);
const name = ref('');
const category = ref('');
const author = ref('');
const issuer = ref('');
const releaseDate = ref('');
const price = ref(0);
const quantity = ref(0);
const description = ref('');

const arrayBufferToBase64 = (buffer) => {
	let binary = '';
	const bytes = new Uint8Array(buffer);
	const len = bytes.byteLength;
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return window.btoa(binary);
};

const onFileChange = (e) => {
	const files = Array.from(e.target.files);

	files.forEach((file) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const arrayBuffer = e.target.result;
			const base64String = arrayBufferToBase64(arrayBuffer);
			selectedFiles.value.push({
				name: file.name,
				type: file.type,
				data: base64String,
			});

			preview.value.push(URL.createObjectURL(file));
		};

		reader.readAsArrayBuffer(file);
	});
};

const clearForm = () => {
	name.value = '';
	category.value = '';
	author.value = '';
	issuer.value = '';
	releaseDate.value = '';
	price.value = 0;
	quantity.value = 0;
	description.value = '';
	selectedFiles.value = [];
	preview.value = [];
};

const addNewBook = () => {
	axios
		.post('/add-new/book', {
			name: name.value.trim(),
			category: category.value.trim(),
			author: author.value.split(/[,;]\s*|\s*[,;]/),
			issuer: issuer.value.trim(),
			releaseDate: releaseDate.value,
			price: +price.value.trim(),
			quantity: quantity.value.trim(),
			description: description.value.replace(/\n/g, '\\n'),
			images: selectedFiles.value,
		})
		.then((res) => {
			if (res?.data?.message === 'success') {
				clearForm();
			}
		})
		.catch((err) => console.log(err));
};
</script>
<template>
	<div class="w-full flex">
		<!-- Sidebar -->
		<div class="w-80 h-screen bg-red-400"></div>
		<!-- Main content -->
		<div class="flex-1 px-4 bg-white">
			<div class="w-full flex gap-4">
				<div class="input mt-4 text-lg flex-1">
					<input
						id="book-name"
						v-model="name"
						placeholder=""
						type="text"
					/>
					<label for="book-name">Tên sách</label>
				</div>
				<div class="input mt-4 text-lg flex-1">
					<input
						id="book-category"
						v-model="category"
						placeholder=""
						type="text"
					/>
					<label for="book-category">Thể loại</label>
				</div>
				<div class="input mt-4 text-lg flex-1">
					<input
						id="book-author"
						v-model="author"
						placeholder=""
						type="text"
					/>
					<label for="book-author">Tác giả</label>
				</div>
			</div>
			<div class="w-full flex gap-4">
				<div class="input mt-4 text-lg flex-1">
					<input
						id="book-issuer"
						v-model="issuer"
						placeholder=""
						type="text"
					/>
					<label for="book-issuer">Nhà phát hành</label>
				</div>
				<div class="input mt-4 text-lg flex-1">
					<label for="book-release-date">Ngày phát hành</label>
					<input
						id="book-release-date"
						v-model="releaseDate"
						placeholder=""
						type="date"
					/>
				</div>
				<div class="input mt-4 text-lg flex-1">
					<input
						id="book-price"
						v-model="price"
						placeholder=""
						type="text"
					/>
					<label for="book-price">Giá</label>
				</div>
				<div class="input mt-4 text-lg flex-1">
					<input
						id="book-quantity"
						v-model="quantity"
						placeholder=""
						type="text"
					/>
					<label for="book-quantity">Số lượng</label>
				</div>
			</div>
			<div class="w-full h-96 textarea mt-4 text-lg">
				<textarea
					id="book-description"
					v-model="description"
					placeholder=""
				></textarea>
				<label for="book-description">Mô tả</label>
			</div>
			<div class="w-full mt-4">
				<input
					id="book-image"
					accept="image/*"
					class="hidden"
					multiple
					type="file"
					@change="onFileChange"
				/>
				<label
					class="cursor-pointer text-lg text-blue-500 hover:text-blue-400"
					for="book-image"
				>Thêm hình ảnh</label
				>
				<button
					v-if="preview.length"
					class="ml-4 text-red-500 hover:text-red-400"
					@click="
						() => {
							preview = [];
							selectedFiles = [];
						}
					"
				>
					Xoá ảnh
				</button>
			</div>
			<div
				v-if="preview.length"
				class="w-full flex gap-4 items-center flex-wrap mt-2"
			>
				<img
					v-for="(image, index) in preview"
					:key="index"
					:src="image"
					alt="Image Preview"
					class="h-60 rounded"
				/>
			</div>
			<div
				class="w-full h-12 flex gap-4 items-center justify-center mt-8"
			>
				<button
					class="flex-1 h-full border border-red-500 rounded text-red-500 font-semibold hover:border-red-400 hover:text-red-400"
					@click="clearForm"
				>
					Làm mới
				</button>
				<button
					class="flex-1 h-full rounded bg-green-500 font-semibold text-white hover:bg-green-400"
					@click="addNewBook"
				>
					Thêm
				</button>
			</div>
		</div>
	</div>
</template>
