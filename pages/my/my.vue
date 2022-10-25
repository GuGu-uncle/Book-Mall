<template>
	<view class='container'>
		<view class="user">
			<!-- 头像 -->
			<view @click="uploadPictures">
				<u-avatar :src="user.avatar_url" size="160"></u-avatar>
			</view>
			<!-- 用户信息 -->
			<view class="info">
				<view class="name">{{user.name}}</view>
				<view class="email">邮箱: {{user.email}}</view>
			</view>
		</view>
		<navigator class="list marginTop" url="/pages/my/baseInfo" @click="pageInfo">
			<text class='iconfont icon-gerenxinxi'></text>
			<view class='font'>个人信息</view>
			<u-icon name="arrow-right"  size="40rpx"></u-icon>
		</navigator>
		<view class="marginTop">
			<navigator class="list"  url="/pages/trade/allTrade">
				<text class='iconfont icon-dingdan'></text>
				<view class='font'>所有订单</view>
				<u-icon name="arrow-right"  size="40rpx"></u-icon>
			</navigator>
			<navigator class="list">
				<text class='iconfont icon-shoucang'></text>
				<view class='font'>商品收藏</view>
				<u-icon name="arrow-right"  size="40rpx"></u-icon>
			</navigator>
			<navigator class="list" url="/pages/address/address">
				<text class='iconfont icon-dizhi'></text>
				<view class='font'>收货地址</view>
				<u-icon name="arrow-right"  size="40rpx"></u-icon>
			</navigator>
		</view>
		<navigator class="list marginTop" @click="logout">
			<text class='iconfont icon-tuichu'></text>
			<view class='font'>退出登录</view>
			<u-icon name="arrow-right"  size="40rpx"></u-icon>
		</navigator>
	</view>
</template>

<script>
	import { apiLogout, apiOssToken, apiUpdateUserAvatar, apiUserInfo } from '@/config/api.js'
	import { login, beforeInfo } from '@/config/utils.js'//引入自定义工具
	export default {
		data() {
			return {
				userName:'',//用户名
				user:{},//用户信息
				uploadInfo:{},//上传图片所需信息
			}
		},
		onShow() {
			// 判断用户的token是否为空,为空则跳转至登录页面
			this.getData()
		},
		methods: {
			// 获取用户信息
			getData(){
				// 如果没登陆则跳转到登录页面
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
			},
			// 获取图片上传所需参数
			async getUploadInfo(){
				this.uploadInfo = await apiOssToken()
			},
			// 上传图片（头像）
			async uploadPictures(){
				// 获取上传图片所需信息
				this.getUploadInfo()
				uni.chooseImage({
					success: (chooseImageRes) => {
						// 获取要上传的文件路径跟文件名后缀
						const tempFilePaths = chooseImageRes.tempFilePaths
						
						// #ifdef H5
						let fileName = chooseImageRes.tempFiles[0].name
						// #endif
						
						// #ifndef H5
						let fileName = chooseImageRes.tempFiles[0].path
						// #endif
						
						// 设置唯一文件名
						fileName = this.$u.guid(20) + fileName.slice(fileName.lastIndexOf('.'))
						// 上传图片
						uni.uploadFile({
							url: this.uploadInfo.host, //阿里云
							filePath: tempFilePaths[0],
							formData: {
								'key': fileName,
								'policy': this.uploadInfo.policy,
								'OSSAccessKeyId': this.uploadInfo.accessid,
								'success_action_status': '200',
								'signature': this.uploadInfo.signature
							},
							success: async (uploadFileRes) => {
								// 更新头像信息
								await apiUpdateUserAvatar({avatar: fileName})
								// 获取头像信息
								let res = await apiUserInfo()
								uni.setStorageSync('user',res)//将user存储到本地中
								// 重新获取用户信息（头像）
								this.getData()
							}
						})
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
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
			.list {
				border:2rpx solid #ddd;
			}
		}
		
		navigator {
			height: 7vh;
			align-items: center;
		}
	}
</style>
