<template>
	<view class="container">
		<!-- 数据为空 -->
		<u-empty
			v-if="accomplish === true && addressList.length ===0"
			class="empty"
			mode="data"
			icon="http://cdn.uviewui.com/uview/empty/data.png"
			textSize="50"
			width="400"
			height="400"
		>
		</u-empty>
		<!-- 加载动画 -->
		<view class="loading" v-if="!accomplish">
			<u-loading-icon 
				size="100rpx"
				text="加载中" 
				textSize="40rpx"
				:vertical="true"
				:show="!accomplish"
			></u-loading-icon>
		</view>
		<template v-else>
			<scroll-view scroll-y="true" >
				<view class="address" v-for="item in addressList" :key="item.id">
					<view class="np">
						<view id='name'>{{item.name}}</view>
						<view id='phone'>{{item.phone}}</view>
					</view>
					<view id='address'>{{item.province+item.city+item.county+item.address}}</view>
					<!-- 右图标 -->
					<view class="address-icon iconfont icon-bianji" @click="toAddAddress(item)"></view>
					<view class="default" v-if="item.is_default">默认</view>
				</view>
			</scroll-view>
			<navigator url="/pages/address/addAddress">添加地址</navigator>
		</template>
	</view>
</template>

<script>
	import { apiGetAddress } from '@/config/api.js'
	export default {
		data() {
			return {
				accomplish: false, //请求信息结束前
				addressList:[], //地址列表
			}
		},
		onShow() {
			this.getAddress()
		},
		methods: {
			// 获取地址列表
			async getAddress(){
				let result = await apiGetAddress()
				this.addressList = result.data
				this.accomplish = true
			},
			// 去添加地址页
			toAddAddress(addressInfo){
				delete addressInfo.created_at
				delete addressInfo.updated_at
				this.$u.route({
					url:'pages/address/addAddress',
					params: {
						addressInfo:JSON.stringify(addressInfo)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	// 加载动画
	.loading{
		margin-top: 40%;
	}
	
	// 页面容器
	.container {
		position: relative;
		padding-top: 20rpx;
	}
	
	// 内容为空
	.empty {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
	}
	
	// 地址容器
	scroll-view {
		// height: 980rpx;
		height: 78vh;
		.address {
			position: relative;
			padding: 20rpx 40rpx 0;
			margin-bottom: 10rpx;
			border-bottom: solid 2rpx #dedede;
		
			.np {
				display: flex;
				font-size: 34rpx;
				margin-bottom:10rpx;
				#name {
					max-width: 350rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					margin-right: 30rpx;
				}
				#phone{
					font-size: 32rpx;
				}
			}
			
			#address {
				width: 550rpx;
				height: 50rpx;
				font-size:30rpx;
				color: #c2c2c2;
				margin-bottom: 10rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			
			.default {
				position: absolute;
				right: 30rpx;
				top: 0rpx;
				width: 70rpx;
				height: 40rpx;
				line-height: 40rpx;
				text-align: center;
				font-size:22rpx;
				color:#fff;
				border-radius:20rpx;
				background-color:#ff0000;
			}
		
			.address-icon {
				position: absolute;
				top: 50rpx;
				right: 40rpx;
				font-size: 50rpx;
			}
		}
	}
	
	
	// 跳转到添加地址页
	navigator {
		width: 500rpx;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		font-size: 40rpx;
		color: #fff;
		background-color: skyblue;
		border-radius: 20rpx;
		margin: 40rpx auto 0;
	}
</style>
