<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import axios from 'axios';

import Header from '../components/Header.vue';

const router = useRouter();

const lends = ref([]);

const fetchData = () => {
	axios.get('/lends')
	     .then(res => {
		     if (res?.data) {
			     lends.value = res.data;
		     }
	     }).catch(err => console.log(err));
};

onMounted(() => {
	fetchData();
});

const formatTime = (timeString) => {
	if (!timeString) {
		return '';
	}

	const date = new Date(Number(timeString)); // Convert timeString to a number and create a Date object

	const hours = String(date.getHours()).padStart(2, '0'); // Format hours to 2 digits
	const minutes = String(date.getMinutes()).padStart(2, '0'); // Format minutes to 2 digits

	const day = String(date.getDate()).padStart(2, '0'); // Format day to 2 digits
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Format month to 2 digits (0-indexed)
	const year = date.getFullYear(); // Get the full year

	return `${hours}:${minutes} ${day}/${month}/${year}`; // Return formatted string
};

const approveHandler = (id) => {
	axios.post('/lend/approve', {
		id,
	}).then(res => {
		if (res?.data) {
			fetchData();
		}
	}).catch(err => console.log(err));
};

const returnHandler = (id) => {
	axios.post('/lend/return', {
		id,
	}).then(res => {
		if (res?.data) {
			fetchData();
		}
	}).catch(err => console.log(err));
};

const cancelLend = (id) => {
	axios.post('/cancel/lend', {
		id,
	}).then(res => {
		if (res?.data) {
			fetchData();
		}
	}).catch(err => {
		console.log(err);
	});
};
</script>

<template>
	<Header/>
	<div class="w-[1200px] max-w-full mx-auto flex items-center gap-4">
		<table class="table-auto border-collapse border border-slate-500">
			<thead>
			<tr>
				<th class="border border-slate-600">Tên sách</th>
				<th class="border border-slate-600">Tác giả</th>
				<th class="border border-slate-600">Tên khách hàng</th>
				<th class="border border-slate-600">SĐT khách hàng</th>
				<th class="border border-slate-600">Ngày mượn</th>
				<th class="border border-slate-600">Ngày duyệt</th>
				<th class="border border-slate-600">Ngày trả</th>
				<th class="border border-slate-600">Trạng thái</th>
				<th class="border border-slate-600">Duyệt</th>
				<th class="border border-slate-600">Huỷ</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="lend in lends"
			>
				<td class="border border-slate-600">{{ lend.bookTitle }}</td>
				<td class="border border-slate-600">{{ lend.bookAuthor.join(', ') }}</td>
				<td class="border border-slate-600">{{ lend.userName }}</td>
				<td class="border border-slate-600">{{ lend.userPhone }}</td>
				<td class="border border-slate-600">{{ formatTime(lend.lendingTime) }}</td>
				<td class="border border-slate-600">{{ formatTime(lend.approvedTime) }}</td>
				<td class="border border-slate-600">{{ formatTime(lend.returnTime) }}</td>
				<td class="border border-slate-600">{{ lend.state }}</td>
				<td class="border border-slate-600">
					<button
						v-if="lend.state === 'waiting'"
						@click="approveHandler(lend._id)"
					>
						Cho mượn
					</button>
					<button
						v-if="lend.state === 'approved'"
						@click="returnHandler(lend._id)"
					>
						Trả sách
					</button>
				</td>
				<td class="border border-slate-600">
					<button @click="cancelLend(lend._id)">Huỷ</button>
				</td>
			</tr>
			</tbody>
		</table>
	</div>
</template>