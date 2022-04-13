const http = uni.$u.http

// 前台api
const apiIndex = params => http.get('/api/index', {params})// get请求，获取首页数据
const apiUserInfo = () => http.get('/api/user')// get请求获取用户信息
const apiUpdateUserInfo = params => http.put('/api/user',params)// put请求，更改用户名
const apiUpdateUserAvatar = params => http.post('/api/user/avatar',params)// post请求，更新头像
const apiGoods = id => http.get(`/api/goods/${id}`)// 商品详情
const apiCollectsGoods = id => http.post(`/api/collects/goods/${id}`)// 收藏或取消收藏
const apiAddCart = params => http.post('/api/carts',params)// 加入购物车
const apiCartList = params => http.get('/api/carts',{params})// 购物车列表
const apiGoodsList = params => http.get('/api/goods',{params})// 商品列表
const apiCartChecked = params => http.patch('/api/carts/checked',params)// 购物车改变选中
const apiCartNum = (id,params) => http.put(`/api/carts/${id}`,params)// 购物车某个商品的数量
const apiCartDelete = id => http.delete(`/api/carts/${id}`)// 移出购物车


// 认证api
const apiRegister = (params) => http.post('/api/auth/register', params)// post请求，用户注册
const apiLogin = (params) => http.post('/api/auth/login', params)// post请求，用户登录
const apiLogout = () => http.post('/api/auth/logout')// post请求，用户退出登录
const apiOssToken = () => http.get('/api/auth/oss/token')// 获取阿里云OSS Token，用于前端直传文件使用

// 统一暴露
export {
	// 前台api
	apiIndex,
	apiUserInfo,
	apiUpdateUserInfo,
	apiUpdateUserAvatar,
	apiGoods,
	apiCollectsGoods,
	apiAddCart,
	apiCartList,
	apiGoodsList,
	apiCartChecked,
	apiCartNum,
	apiCartDelete,
	// 认证api
	apiRegister,
	apiLogin,
	apiLogout,
	apiOssToken
}


