import App from './App'


// #ifndef VUE3
import Vue from 'vue'
// 引入vuex
import store from './store'
Vue.prototype.$store = store
Vue.config.productionTip = false
// uview-ui
import uView from "uview-ui";
Vue.use(uView);
App.mpType = 'app'
const app = new Vue({
	store,
    ...App
})
// 引入请求封装，将app参数传递到配置中
require('@/config/request.js')(app)
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
