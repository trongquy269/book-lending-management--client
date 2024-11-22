import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
	state: {
		user: null,
	},
	getters: {
		getUser: state => state.user,
	},
	mutations: {
		setUser (state, user) {
			state.user = user;
		},
		clearUser (state) {
			state.user = null;
		},
	},
	actions: {
		async fetchUser ({ commit }) {
			try {
				const response = await axios.get('/user/info');
				commit('setUser', response.data);
			} catch (error) {
				console.error('Error fetching user:', error);
			}
		},
	},
});

export default store;
