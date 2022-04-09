import {apiUserInfo} from '@/config/api.js'

// 存储跳转前页面的地址和参数
const beforeInfo=()=>{
	// 来自于哪个页面
	let currentPage = getCurrentPages().pop()
	const {route,options} = currentPage
	// 获取页面路径和请求参数
	const optionsKey = Object.keys(options)//参数的key(数组)
	let params=''
	if(optionsKey.length){
		// 参数列表
		params = optionsKey.reduce((accumulator,currentValue)=>{
			return `${accumulator}${currentValue}=${options[currentValue]}&`
		},'?').slice(0,-1)
	}
	uni.setStorageSync('route',route)//存储原先的页面路径
	uni.setStorageSync('params',params)//存储原先的请求参数
}


// 返回跳转前的页面
const toBack=()=>{
	// 获取页面路径和请求参数
	let route = uni.getStorageSync('route')||'pages/index/index'
	let params = uni.getStorageSync('params')
	setTimeout(()=>{
		uni.reLaunch({
			url:"/" + route + params //例：/pages/index/index?id=123&a=11
		})
	},1000)
}


// 判断是否需要用户登录
const login=()=>{
	if(!uni.getStorageSync('token')){
		// 存储跳转前页面的地址和参数
		beforeInfo()
		// 提示用户登录
		uni.showToast({
			title:'请登录',
			icon:'none',
			success() {
				setTimeout(()=>{
					// 跳转至登录界面
					uni.$u.route({
						type:'redirectTo',
						url:'pages/auth/login'
					})
				},1500)
			}
		})
		return true
	}
	return false
}


// 更新用户信息
const updateUser = async ()=>{
	let result = await apiUserInfo()//登录获取用户信息
	uni.setStorageSync('user',result)//将user存储到本地中
}

// 统一暴露
export {beforeInfo,toBack,login,updateUser}