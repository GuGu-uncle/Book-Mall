const http = uni.$u.http

// 前台api
export const apiIndex = params => http.get('/api/index', {params})// get请求，获取首页数据
export const apiUserInfo = () => http.get('/api/user')// get请求获取用户信息
export const apiUpdateUserInfo = params => http.put('/api/user',params)// put请求，更改用户名
export const apiUpdateUserAvatar = params => http.post('/api/user/avatar',params)// post请求，更新头像
export const apiGoods = id => http.get(`/api/goods/${id}`)// 商品详情
export const apiCollectsGoods = id => http.post(`/api/collects/goods/${id}`)// 收藏或取消收藏
export const apiAddCart = params => http.post('/api/carts',params)// 加入购物车
export const apiCartList = params => http.get('/api/carts',{params})// 购物车列表
export const apiGoodsList = params => http.get('/api/goods',{params})// 商品列表
export const apiCartChecked = params => http.patch('/api/carts/checked',params)// 购物车改变选中
export const apiCartNum = (id,params) => http.put(`/api/carts/${id}`,params)// 购物车某个商品的数量
export const apiCartDelete = id => http.delete(`/api/carts/${id}`)// 移出购物车
export const apiTrade = () => http.get('/api/orders/preview')
export const apiAddAddress = (params) => http.post('/api/address',params)// 添加地址
export const apiDeleteAddress = (address) => http.delete(`/api/address/${address}`)// 删除地址
export const apiGetAddress = () => http.get('/api/address')// 获取地址列表
export const apiUpdateAddress = (id,params) => http.put(`/api/address/${id}`,params)// 更新地址信息
export const apiSubmitTrade = params => http.post(`/api/orders`,params)// 提交订单
export const apiTradeList = params => http.get(`/api/orders`,{params})// 订单列表
export const apiorderDetail = (order,params) => http.get(`/api/orders/${order}`,{params})// 订单详细
export const apiPay = (orderId,params) => http.get(`/api/orders/${orderId}/pay`,{params})// 订单支付
export const apiPayStatus = (orderId) => http.get(`/api/orders/${orderId}/status`)// 查询支付状态


// 认证api
export const apiRegister = params => http.post('/api/auth/register', params)// post请求，用户注册
export const apiLogin = params => http.post('/api/auth/login', params)// post请求，用户登录
export const apiLogout = () => http.post('/api/auth/logout')// post请求，用户退出登录
export const apiOssToken = () => http.get('/api/auth/oss/token')// 获取阿里云OSS Token，用于前端直传文件使用



