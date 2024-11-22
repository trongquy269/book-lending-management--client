<script setup>
import { ref } from 'vue';

import canConvertStr2Num from '../store/utils/canConvertStr2Num';

defineProps({
	label: String,
	required: true,
});

const dateVal = ref('Ngày');
const monthVal = ref('tháng');
const yearVal = ref('năm');
const isDateFocus = ref(false);
const isMonthFocus = ref(false);
const isYearFocus = ref(false);

const getMaxDateOfMonth = (year, month) => {
	const date = new Date(year, month, 1);

	date.setDate(date.getDate() - 1);

	return date.getDate();
};

const moveCursorToEnd = (element) => {
	const range = document.createRange();
	const selection = window.getSelection();

	// Set the range to the end of the element's content
	range.selectNodeContents(element);
	range.collapse(false);

	// Clear previous selection and set new one
	selection.removeAllRanges();
	selection.addRange(range);
};

const inputHandler = (e, type) => {
	// Extract only the numeric part from the string
	const numericValue = +e.target.innerText.replace(/\D+/g, '');

	if (type === 'date') {
		if (e.target.innerText === '') {
			dateVal.value = 'Ngày';
			moveCursorToEnd(e.target);
			return;
		}

		if (!numericValue) {
			e.target.innerText = 'Ngày';
			moveCursorToEnd(e.target);
			return;
		}

		if (dateVal.value === 'Ngày') {
			e.target.innerText = numericValue.toString();
			dateVal.value = numericValue.toString();
		}
		moveCursorToEnd(e.target);
		dateVal.value = e.target.innerText;
	} else if (type === 'month') {
		if (e.target.innerText === '') {
			monthVal.value = 'tháng';
			moveCursorToEnd(e.target);
			return;
		}

		if (!numericValue) {
			e.target.innerText = 'tháng';
			moveCursorToEnd(e.target);
			return;
		}

		if (monthVal.value === 'tháng') {
			e.target.innerText = numericValue.toString();
			monthVal.value = numericValue.toString();
		}
		moveCursorToEnd(e.target);
		monthVal.value = e.target.innerText;
	} else if (type === 'year') {
		if (e.target.innerText === '') {
			yearVal.value = 'năm';
			moveCursorToEnd(e.target);
			return;
		}

		if (!numericValue) {
			e.target.innerText = 'năm';
			moveCursorToEnd(e.target);
			return;
		}

		if (yearVal.value === 'năm') {
			e.target.innerText = numericValue.toString();
			yearVal.value = numericValue.toString();
		}
		moveCursorToEnd(e.target);
		yearVal.value = e.target.innerText;
	}

	if (!canConvertStr2Num(monthVal) || !canConvertStr2Num(yearVal)) {
		return;
	}

	if (parseInt(dateVal.value) < 1) {
		dateVal.value = '1';
	} else if (
		parseInt(dateVal.value) >
		getMaxDateOfMonth(parseInt(yearVal.value), parseInt(monthVal.value))
	) {
		dateVal.value = getMaxDateOfMonth(
			parseInt(yearVal.value),
			parseInt(monthVal.value)
		).toString();
	}

	if (parseInt(monthVal.value) < 1) {
		monthVal.value = '1';
	} else if (parseInt(monthVal.value) > 12) {
		monthVal.value = '12';
	}
	console.log(monthVal.value, yearVal.value, dateVal.value);
};
</script>
<template>
	<input
		type="text"
		id="--date"
		placeholder=""
	/>
	<label for="--date">{{ label }}</label>
	<div class="w-full flex ml-[-4px]">
		<div
			contenteditable="true"
			class="outline-none"
			@focus="isDateFocus = true"
			@blur="isDateFocus = false"
			@input="(e) => inputHandler(e, 'date')"
			:class="{ 'text-slate-400': isDateFocus }"
		>
			{{ dateVal }}
		</div>
		<span class="mx-1">/</span>
		<div
			contenteditable="true"
			class="outline-none"
			@focus="isDateFocus = true"
			@blur="isDateFocus = false"
			@input="(e) => inputHandler(e, 'month')"
			:class="{ 'text-slate-400': isDateFocus }"
		>
			{{ monthVal }}
		</div>
		<span class="mx-1">/</span>
		<div
			contenteditable="true"
			class="outline-none"
			@focus="isDateFocus = true"
			@blur="isDateFocus = false"
			@input="(e) => inputHandler(e, 'year')"
			:class="{ 'text-slate-400': isDateFocus }"
		>
			{{ yearVal }}
		</div>
	</div>
</template>
