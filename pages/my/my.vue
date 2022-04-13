<template>
	<view class='container'>
		<view class="user">
			<!-- 头像 -->
			<u--image 
				shape="circle" 
				:showLoading="true" 
				:src="user.avatar_url||'../../static/logo.png'"
				width="160rpx" 
				height="160rpx"
			></u--image>
			<!-- 用户信息 -->
			<view class="info">
				<view class="name">{{user.name}}</view>
				<view class="email">邮箱: {{user.email}}</view>
			</view>
		</view>
		<navigator class="list marginTop" url="/pages/my/baseInfo" @click="pageInfo">
			<text class='iconfont icon-gerenxinxi_o'></text>
			<view class='font'>个人信息</view>
			<u-icon name="arrow-right"  size="40rpx"></u-icon>
		</navigator>
		<view class="marginTop">
			<view class="list" v-for="item in list" :key="item.text">
				<text :class='item.name'></text>
				<view class='font'>{{item.text}}</view>
				<u-icon name="arrow-right"  size="40rpx"></u-icon>
			</view>
		</view>
		<view class="list marginTop" @click="logout">
			<text class='iconfont icon-tuichudenglu'></text>
			<view class='font'>退出登录</view>
			<u-icon name="arrow-right"  size="40rpx"></u-icon>
		</view>
	</view>
</template>

<script>
	import {apiLogout} from '@/config/api.js'
	import {login,beforeInfo} from '@/config/utils.js'//引入自定义工具
	export default {
		data() {
			return {
				userName:'',//用户名
				user:{},//用户信息
				list:[
					{name:'iconfont icon-shouye',text:'所有订单'},
					{name:'iconfont icon-shoucang',text:'商品收藏'},
					{name:'iconfont icon-dizhi',text:'收货地址'}
				]
			}
		},
		onShow() {
			// 判断用户的token是否为空,为空则跳转至登录页面
			this.getData()
		},
		methods: {
			getData(){
				if(login()) return
				this.user = uni.getStorageSync('user')
			},
			pageInfo(){
				// 获取当前页面的路径跟参数
				beforeInfo()
			},
			logout(){
				uni.showModal({
					title: '提示',
					content: '确定要退出登录吗？',
					success: async (res)=> {
						if (res.confirm) {
							let result= await apiLogout()//退出登录
							// 清除本地缓存
							uni.removeStorageSync('user')
							uni.removeStorageSync('token')
							// 跳转至首页
							uni.$u.route({
								type:'reLaunch',
								url:'/pages/index/index'
							})
						} 
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.container{
		height: 100vh;
		background-color:#ddd;
		.user{
			display:flex;
			background-color:#fff;
			padding:40rpx;
			.info{
				margin-left:20rpx;
				display:flex;
				flex-direction:column;
				justify-content:space-around;
				.name{
					font-size:40rpx;
				}
				.email{
					font-size:34rpx;
					color:#C0C0C0;
				}
			}
		}
		.list{
			display:flex;
			padding:20rpx;
			background-color:#fff;
			justify-content:space-around;
			&:active{
				background-color: rgb(235, 237, 238);
			}
			text{
				font-size:60rpx;
			}
			.font{
				width: 500rpx;
				font-size:40rpx;
			}
		}
		.marginTop{
			margin-top:20rpx;
		}
	}
</style>
