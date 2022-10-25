<template>
	<view>
		<view class="header">注册账号</view>
		<view class="content">
			<!-- 用户名输入框 -->
			<view>
				<u--input
				    placeholder="请输入用户名"
				    border="surround"
				    clearable
					fontSize="40rpx"
					v-model="name"
				></u--input>
			</view>
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
			<!-- 密码输入框 -->
			<view>
				<u--input
					type='password'
				    placeholder="请再次输入密码"
				    border="surround"
				    clearable
					fontSize="40rpx"
					v-model="password_confirmation"
				></u--input>
			</view>
			<!-- 登录按钮 -->
			<button :style="buttonStyle" @click='Register'>注册</button>
		</view>
	</view>
</template>

<script>
	import {apiRegister} from '../../config/api.js'
	export default {
		data() {
			return {
				name:'',
				email:'',
				password:'',
				password_confirmation:''
			}
		},
		onLoad(){
			
		},
		computed:{
			buttonStyle(){
				let style={}
				if(this.name&&uni.$u.test.email(this.email)&&this.password&&this.password_confirmation){
					style.color="#fff"
					style.backgroundColor="skyblue"
				}
				return style
			}
		},
		methods: {
			async Register(){
				// 如果用户名、邮箱、密码、二次密码有一个没输入则不执行下面的代码
				if(
					!this.name
					|| !uni.$u.test.email(this.email)
					|| !this.password
					|| !this.password_confirmation
				) return
				// 发送注册请求
				let res = await apiRegister({
					name:this.name,
					email:this.email,
					password:this.password,
					password_confirmation:this.password_confirmation
				})
				console.log(res)
				uni.showToast({
					title:'注册成功，跳转至登录页面！',
					icon:'success',
					success:()=>{
						setTimeout(()=>{
							uni.redirectTo({
								url:'/pages/auth/login'
							})
						},1500)
					}
				})
			}
		}
	}
</script>

<style lang='scss' scoped>
	.header{
		width: 260rpx;
		font-size:60rpx;
		margin:50rpx auto;
	}
	.content{
		display: flex;
		flex-direction: column;
		justify-content:space-between;
		width:600rpx ;
		height: 600rpx;
		margin:0 auto;
		button{
			width: 100%;
			background-color:#78aaaa;
		}
	}
</style>
