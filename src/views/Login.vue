<script lang="js" setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

import eyeIcon from '../store/icons/eyeIcon.vue';
import eyeSlashIcon from '../store/icons/eyeSlashIcon.vue';

const router = useRouter();

const isShowPassword = ref(false);
const username = ref('');
const password = ref('');

const submit = () => {
	axios.post('/login', {
		username: btoa(username.value.trim()),
		password: btoa(password.value.trim()),
	})
	     .then((
		     res => {
			     if (res?.data?.message === 'Success') {
				     router.push('/');
			     }
		     }
	     ))
	     .catch((err) => {
		     console.log(err);
	     });
};
</script>

<template>
	<div class="w-full h-screen flex items-center justify-center">

		<div class="relative">
			<div class="w-full h-full absolute shadow-xl
					bg-gradient-to-r from-cyan-500 to-blue-500 rotate-12 rounded-3xl z-0"></div>
			<div class="w-fit p-20 relative flex items-center justify-center flex-col
						bg-white rounded-3xl z-10 shadow-xl"
			>
				<div class="w-full text-center text-3xl font-semiboldbold mb-8"
				>
					CHÀO MỪNG BẠN QUAY TRỞ LẠI!
				</div>
				<input v-model="username"
				       class="w-full h-11 outline-none border-b text-xl mb-4"
				       placeholder="Số điện thoại" type="text"/>
				<div class="w-full h-11 relative mb-4">
					<input v-model="password"
					       :type="isShowPassword ? 'text' : 'password'"
					       class="w-full h-full outline-none border-b text-xl"
					       placeholder="Mật khẩu"
					/>
					<eyeIcon v-if="!isShowPassword"
					         class="absolute top-1/2 right-0 translate-y-[-50%] cursor-pointer
								text-slate-300"
					         @click="isShowPassword = !isShowPassword"
					/>
					<eyeSlashIcon v-if="isShowPassword"
					              class="absolute top-1/2 right-0 translate-y-[-50%] cursor-pointer
								text-slate-300"
					              @click="isShowPassword = !isShowPassword"
					/>
				</div>
				<button class="w-full bg-cyan-400 p-3 mt-2 text-xl rounded"
				        @click="submit"
				>
					Đăng nhập
				</button>
				<button class="text-sx mt-8 text-cyan-800" @click="router.push('/register')">
					Tôi chưa có tài khoản
				</button>
			</div>
		</div>
	</div>
</template>