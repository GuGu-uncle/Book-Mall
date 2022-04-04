<template>
	<view>
		<view class="header">欢迎登陆图书商城</view>
		<view class="content">
			<!-- 邮箱输入框 -->
			<view>
				<u--input
				    placeholder="请输入邮箱"
				    border="surround"
				    clearable
					fontSize="40rpx"
					v-model="email"
				></u--input>
			</view>
			<!-- 密码输入框 -->
			<view>
				<u--input
					type='password'
				    placeholder="请输入密码"
				    border="surround"
				    clearable
					fontSize="40rpx"
					v-model="password"
				></u--input>
			</view>
			<!-- 登录按钮 -->
			<button :style="buttonStyle" @click='Login'>登录</button>
			<view class='bottom'>
				<navigator url="">找回密码</navigator>
				<navigator url="/pages/auth/register">注册</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	import {apiLogin,apiUserInfo} from '../../config/api.js'
	export default {
		data() {
			return {
				email:'',
				password:'',
			}
		},
		onLoad(){
			
		},
		computed:{
			buttonStyle(){
				let style={}
				if(uni.$u.test.email(this.email)&&this.password){
					style.color="#fff"
					style.backgroundColor="skyblue"
				}
				return style
			}
		},
		methods: {
			async Login(){
				// 如果没有输入邮箱或者密码则不执行下面的代码
				if(!uni.$u.test.email(this.email) || !this.password) return
				let res1 = await apiLogin({email:this.email,password:this.password})
				uni.setStorageSync('token',res1.access_token)//将token存储到本地中
				let res2 = await apiUserInfo()
				uni.setStorageSync('user',res2)//将user存储到本地中
				uni.showToast({
					title:'登录成功',
					icon:'success',
					success:()=>{
						// 获取页面路径和请求参数
						let route = uni.getStorageSync('route')||'pages/index/index'
						let params = uni.getStorageSync('params')
						setTimeout(()=>{
							uni.reLaunch({
								url:"/" + route + params //例：/pages/index/index?id=123&a=11
							})
						},1000)
					}
				})
			}
		}
	}
</script>

<style lang='scss'>
	/* 顶部 */
	.header{
		font-size:60rpx;
		font-weight:bold;
		padding:100rpx;
	}
	
	/* 内容区 */
	.content{
		display: flex;
		flex-direction: column;
		justify-content:space-between;
		width:600rpx ;
		height: 460rpx;
		margin:0 auto;
		button{
			width: 100%;
			background-color:#78aaaa;
		}
		.bottom{
			display:flex;
			justify-content:space-between;
		}
	}
</style>
