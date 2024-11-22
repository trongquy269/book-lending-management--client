import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import 'dotenv/config';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	server: {
		port: process.env.VITE_PORT,
	},
	preview: {
		port: process.env.VITE_PORT,
	},
});
