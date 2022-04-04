// 判断是否需要用户登录
const Login=()=>{
	if(!uni.getStorageSync('token')){
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
		console.log(route,params)
		uni.setStorageSync('route',route)//存储原先的页面路径
		uni.setStorageSync('params',params)//存储原先的请求参数
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

// 统一暴露
export {Login}