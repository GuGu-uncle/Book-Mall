const http = uni.$u.http

// 前台api
const apiIndex = params => http.get('/api/index', {params})// get请求，获取首页数据
const apiUserInfo = () => http.get('/api/user')// get请求获取用户信息

// 认证api
const apiRegister = (params) => http.post('/api/auth/register', params)//post请求，用户注册
const apiLogin = (params) => http.post('/api/auth/login', params)// post请求，用户登录

// 统一暴露
export {
	apiIndex,
	apiUserInfo,
	apiRegister,
	apiLogin
}


