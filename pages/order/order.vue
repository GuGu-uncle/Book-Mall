<template>
	<!-- 支付页 -->
	<view class="container">
		<template v-if="goodsInfo.length">
			<!-- 顶部 -->
			<view class="header">
				共计 {{goodsInfo.length}} 件商品
				<view class="status">待支付</view>
			</view>
			<!-- 个人信息 -->
			<scroll-view scroll-y="true" >
				<view class="address">
					<view class="np">
						<view id='name'>{{addressInfo.name}}</view>
						<view id='phone'>{{addressInfo.phone}}</view>
					</view>
					<view id='address'>{{addressInfo.province+addressInfo.city+addressInfo.county+addressInfo.address}}</view>
				</view>
				<!-- 商品信息 -->
				<view class="goodsInfo" v-for="item in goodsInfo" :key="item.id">
					<image :src="item.goods.cover_url"></image>
					<view class="goodsInfo-right">
						<view>{{item.goods.title}}</view>
						<view>{{item.goods.description}}</view>
						<view>
							￥<text>{{item.goods.price}}</text>
							<view>x{{item.num}}</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="orderNumber">订单编号:<text> {{orderInfo.order_no}}</text></view>
			<view class="orderCreateTime">创建时间:<text> {{orderInfo.created_at}}</text></view>
			<!-- 底部 -->
			<view class="bottom">
				<view class="money-settlement">
					<view class="total">
						合计<text class="money">
							￥<text class="number">{{orderInfo.amount}}</text>
						.00
						</text>
					</view>
					<view class="settlement" @click="pay">立即付款</view>
				</view>
			</view>
			<!-- 支付二维码 -->
			<u-modal :show="showPay"  title="支付" confirmText="稍后支付" @confirm="confirm">
				<view class="slot-content">
					<image :src="qrcode"></image>
				</view>
			</u-modal>
		</template>
		
		<!-- 加载中 -->
		<view class="loading" v-else>
			<u-loading-icon text="加载中" size="50" textSize="50"></u-loading-icon>
		</view>
	</view>
</template>

<script>
	import { apiorderDetail, apiPay, apiPayStatus } from '@/config/api.js'
	import QRCode from 'qrcode'
	export default {
		data() {
			return {
				orderInfo:{}, //订单信息
				addressInfo:{}, //地址信息
				goodsInfo:[], //商品信息
				showPay: false, //显示支付二维码
				qrcode:'', //二维码
				timer:'', //计时器
			}
		},
		onLoad(options){
			this.orderId = options.orderId
			this.getData(this.orderId)
		},
		methods: {
			async getData(orderId){
				let res = await apiorderDetail(orderId,{include: 'orderDetails.goods,address'})
				this.orderInfo = res
				this.addressInfo = res.address
				this.goodsInfo = res.orderDetails.data
			},
			// 支付
			async pay(){
				try{
					// 获取生成二维码的信息
					let res = await apiPay(this.orderId,{type:'aliyun'})
					this.qrcode = await QRCode.toDataURL(res.qr_code)
					// 显示支付二维码
					this.showPay = true
					// 查询状态的次数
					let number = 0
					let status
					// 查询支付状态
					this.timer = setInterval(async()=>{
						number++
						status = await apiPayStatus(this.orderId)
						// 请求30次时，中止请求
						if(number == 30){
							clearInterval(this.timer)
							// 关闭二维码
							this.showPay = false
						}
						// status等于2时,支付成功
						if(status == 2){
							clearInterval(this.timer)
							this.$u.route({
								type:'redirectTo',
								url:'pages/paySuccess/paySuccess'
							})
						}
					},2000)
				}catch(e){
					console.error(err)
				}
			},
			// 稍后支付
			confirm(){
				clearInterval(this.timer)
				this.showPay = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		position: relative;
		height: 87vh;
		padding: 30rpx;
	}
	
	// 顶部
	.header {
		font-size: 44rpx;
		
		.status {
			float: right;
			font-size: 34rpx;
			color: #fff;
			background-color: #ff0000;
			padding: 10rpx 30rpx;
			border-radius: 10rpx;
		}
	}
	
	// 个人信息
	.address {
		position: relative;
		padding: 20rpx 40rpx 0;
		margin-bottom: 10rpx;
	
		.np {
			display: flex;
			font-size:30rpx;
			margin-bottom:10rpx;
			font-size: 42rpx;
			
			#name {
				max-width: 350rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				margin-right: 30rpx;
			}
		}
		
		#address {
			width: 550rpx;
			height: 50rpx;
			font-size: 36rpx;
			color: #c2c2c2;
			margin-bottom: 10rpx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
	
	// 商品信息
	scroll-view {
		max-height: 55vh;
		
		.goodsInfo {
			display: flex;
			background-color: #FAFAFA;
			padding: 20rpx;
			
			// 图片
			image {
				width: 160rpx;
				height: 200rpx;
				margin-right: 20rpx;
			}
			
			// 商品信息右边
			.goodsInfo-right {
				width: 300rpx;
				flex-grow: 1;
				display: flex;
				justify-content: space-around;
				flex-direction: column;
				
				view:nth-child(1) {
					font-size: 36rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					margin-bottom: 8rpx;
				}
				view:nth-child(2) {
					width: 100%;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					color: #888;
				}
				view:nth-child(3) {
					display: flex;
					align-items: center;
					font-size: 40rpx;
					font-weight: 600;
					color: #f43148;
					padding-top: 20rpx;
					
					text {
						display: table-cell;
						font-size: 46rpx;
						vertical-align: bottom;
					}
					
					// 数量
					view {
						flex-grow: 1;
						font-size: 32rpx;
						text-align: end;
					}
				}
			}
		}
	}
	
	// 订单编号
	.orderNumber {
		font-size: 36rpx;
		margin: 20rpx 0;
		
		text {
			color: #909090;
			margin-left: 20rpx;
		}
	}
	
	// 创建时间
	.orderCreateTime {
		font-size: 36rpx;
		
		text {
			color: #909090;
			margin-left: 20rpx;
		}
	}
	
	// 底部
	.bottom {
		position: absolute;
		bottom: 0;
		right: 50rpx;
		display:flex;
		justify-content:space-between;
		align-items:center;
		margin-top:30rpx;
		
		.all {
			font-size:36rpx;
			margin-left:20rpx;
		}
		
		.money-settlement {
			display:flex;
			justify-content:space-between;
			align-items:center;
			font-size:34rpx;
			
			.total {
				width: 400rpx;
				text-align: end;
				margin-right: 30rpx;
				
				.money {
					font-weight: bold;
					color:red;
					
					.number {
						font-size: 44rpx;
					}
				}
			}
			
			.settlement {
				color:#fff;
				padding:20rpx 50rpx;
				margin-left:10rpx;
				border-radius:60rpx;
				background-color: red;
			}
		}
	}
	
	// 加载动画的位置
	.loading {
		margin-top: 400rpx;
	}
</style>
