import store from '@/store'
import {login} from './utils.js'
// 此vm参数为页面的实例，可以通过它引用vuex中的变量
module.exports = (vm) => {
    // 初始化请求配置
    uni.$u.http.setConfig((config) => {
        /* config 为默认全局配置*/
        config.baseURL = `https://api.shop.eduwork.cn`; /* 根域名 */
        return config
    })
    // 请求拦截器
    uni.$u.http.interceptors.request.use((config) => { // 可使用async await 做异步操作
    	// 引用token
    	// 方式一：存放在vuex的token，假设使用了uView封装的vuex方式
    	config.header.Authorization='Bearer '+ uni.getStorageSync('token')
    	// config.header.Authorization='Bearer '+'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvYXBpLnNob3AuZWR1d29yay5jblwvYXBpXC9hdXRoXC9sb2dpbiIsImlhdCI6MTY0ODYxODM3NywiZXhwIjoxNjQ4OTc4Mzc3LCJuYmYiOjE2NDg2MTgzNzcsImp0aSI6IjlBZ2htZ0lKeEk5MkRNUEQiLCJzdWIiOjcwNTEsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.WFpxM3QPmeHhCbWXVjIbmVN6gNn26hcRYA8Gr3gHwJ8'
    	
    	// 方式二：如果没有使用uView封装的vuex方法，那么需要使用$store.state获取
    	// config.header.token=vm.$store.state.token
    	
    	// 方式三：如果token放在了globalData，通过getApp().globalData获取
    	// config.header.token=getApp().globalData.token
    	
    	// 方式四：如果token放在了Storage本地存储中，拦截是每次请求都要执行的
    	// 所以哪怕您重新登录修改了Storage，下一次的请求将会是最新值
    	// const token=uni.getStorageSync('token')
    	// config.header.token=token
    	
    	return config
    }, config => { // 可使用async await 做异步操作
    	return Promise.reject(config)
    })
    // 响应拦截器
    uni.$u.http.interceptors.response.use((response) => {
		// 响应状态码跟数据
    	// console.log(response)
		const {data}=response
		return data
    }, (response) => {
    	/*  对响应错误做点什么 （statusCode !== 200）*/
    	// console.log(response)
		const {statusCode,data}=response
		if(statusCode===400){
			// 错误的请求
			uni.showToast({
				title:data.message,
				icon:'error'
			})
		}else if(statusCode===401){
			// TOOO 401有两种情况，一种是认证未通过，一种是token没有或过期
			if(data.message==='Unauthorized'){
				uni.showToast({
					title:'账号或密码错误',
					icon:'error'
				})
			}else{
				// 请求了需要登录获取token的api,跳转至登录页面
				uni.removeStorageSync('token')
				uni.removeStorageSync('user')
				login()
			}
		}else if(statusCode===422){
			const {errors}=data
			// 表单验证未通过
			uni.showToast({
				title:Object.values(errors)[0][0],
				icon:'error'
			})
		}
    	return Promise.reject(response)
    })
	// 增加patch请求
	vm.$u.http.patch=( url, params = {} )=>{
		// 模拟patch请求
		const _params={
			...params,
			_method:'PATCH'
		}
		return uni.$u.http.post( url, _params )
	}
}