import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);//vue的插件机制

//Vuex.Store 构造器选项
const store = new Vuex.Store({
	state:{//存放状态
		"vuex_user":"",
		"vuex_token":"",
		"vuex_currentPage":''
	},
	mutations: {
		storageToken(state, token) {
			state.vuex_token = token
		},
		storageUserInfo(state, userInfo) {
			state.vuex_user = userInfo
		},
		storageFrom(state, currentPage) {
			state.vuex_currentPage = currentPage
		}
	}
})
export default store