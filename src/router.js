import { createRouter, createWebHashHistory } from 'vue-router';
import store from './store/utils/store.js';

import Home from './views/Home.vue';
import Admin from './views/Admin.vue';
import AddNewBook from './views/AddNewBook.vue';
import LendingManager from './views/lendingManager.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import NotFound from './views/NotFound.vue';
import ViewBook from './views/ViewBook.vue';

const routes = [
	{ path: '/admin', component: Admin },
	{ path: '/admin/add-new/book', component: AddNewBook },
	{ path: '/admin/manager/lending', component: LendingManager },
	{ path: '/login', component: Login },
	{ path: '/register', component: Register },
	{ path: '/view/:slug', component: ViewBook },
	{ path: '/', component: Home },
	{ path: '/:pathMatch(.*)*', component: NotFound },
];

const router = createRouter({
	history: createWebHashHistory(import.meta.env.VITE_BASE_URL),
	routes,
});

// Navigation Guard for Role-Based Access
//router.beforeEach((to, from, next) => {
//	const user = store.getters.getUser;
//	console.log(store);
//
//	if (to.path.startsWith('/admin')) {
//		if (user.role === 'admin' || user.role === 'staff') {
//			next();
//		} else {
//			next({ path: to.path, component: NotFound });
//		}
//	} else {
//		next();
//	}
//});

export default router;
