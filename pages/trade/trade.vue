<template>
	<view>
		<!-- 个人信息 -->
		<view class="address" v-for="item in addressInfo" :key="item.id">
			<view id='address'>{{item.province+item.city+item.county+item.address}}</view>
			<view class="np">
				<view id='name'>{{item.name}}</view>
				<view id='phone'>{{item.phone}}</view>
			</view>
			<!-- 右图标 -->
			<view class="address-icon"><u-icon name="arrow-right" size="40" @click="toAddAddress(item)"></u-icon></view>
		</view>
		<!-- 商品信息 -->
		<scroll-view scroll-y>
			<view class="goodInfo" v-for="good in carts">
				<image :src="good.goods.cover_url"></image>
				<view class='goodName-price'>
					<view class="goodName">{{good.goods.title}}</view>
					<view class="price">￥<span id='price'>{{good.goods.price}}</span></view>
				</view>
				<view class="num">
					x<span>{{good.num}}</span>
				</view>
			</view>
		</scroll-view>
		<!-- 底部 -->
		<view class="bottom">
			<view class="total">
				<span>合计:</span>
			</view>
			<view class="price">
				￥<span class="price">{{total}}</span>.00
			</view>
			<view class="pay" @click="toPayment">提交订单并支付</view>
		</view>
		<!-- 支付二维码 -->
		<u-modal :show="showPay"  title="支付" confirmText="稍后支付" @confirm="confirm">
			<view class="slot-content">
				<image :src="qrcode"></image>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import { apiTrade, apiSubmitTrade, apiPay } from '../../config/api.js'
	import QRCode from 'qrcode'
	export default {
		data() {
			return {
				addressInfo:{}, //地址信息
				carts:[], //商品列表
				total:'', //总价
				showPay: false, //显示支付二维码
				qrcode:'', //二维码
			}
		},
		onShow(){
			this.getData()
		},
		methods: {
			// 获取订单页数据
			async getData(){
				let data = await apiTrade()
				// 获取默认地址
				let addressInfo = data.address
				this.addressInfo = addressInfo.filter(item=>{
					return item.is_default == 1
				})
				this.carts = data.carts
				// 计算总价
				let total = 0
				data.carts.map(item => {
					total += item.num * item.goods.price
				})
				this.total = total
			},
			// 去地址页
			toAddAddress(addressInfo){
				delete addressInfo.created_at
				delete addressInfo.updated_at
				this.$u.route({
					url:'pages/address/address',
					params: {
						addressInfo:JSON.stringify(addressInfo)
					}
				})
			},
			// 去支付
			async toPayment(){
				// 提交订单
				try{
					let order = await apiSubmitTrade({address_id:this.addressInfo[0].id})
					console.log(123)
					let qrcode = await apiPay(order.id,{ type:'aliyun' })
					this.qrcode = await QRCode.toDataURL(qrcode.qr_code)
					// 显示支付二维码
					this.showPay = true
				}catch(e){
					uni.$u.toast(e)
				}
			},
			// 稍后支付
			confirm(){
				this.showPay = false
				this.$u.route({
					type:'navigateBack'
				})
			},
		},
	}
</script>

<style lang='scss' scoped>
	/* 地址容器 */
	.address {
		position: relative;
		padding: 20rpx 40rpx 0;
		margin-bottom: 10rpx;
		border-bottom: solid 2rpx #dedede;
	
		.np {
			display: flex;
			font-size:30rpx;
			color: #c2c2c2;
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
			font-size: 34rpx;
			margin-bottom: 10rpx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	
		.address-icon {
			position: absolute;
			top: 50rpx;
			right: 40rpx;
		}
	}
	
	/* 商品信息 */
	scroll-view {
		height: 70vh;
	}
	.goodInfo {
		display:flex;
		padding:0 20rpx;
		/* justify-content:center; */
		align-items:center;
		height:200rpx;
		background-color: #eeeeee;
		image{
			width: 160rpx;
			height: 160rpx;
		}
		.goodName-price {
			display:flex;
			flex-direction: column;
			justify-content:space-between;
			flex-grow: 1;
			margin-left:30rpx;
			height: 160rpx;
			.goodName {
				font-size:38rpx;
			}
			.price {
				color:red;
			}
			#price {
				font-size:38rpx;
				color:red;
			}
			
		}
		.num {
			position:relative;
			left:-50rpx;
			top:50rpx;
		}
	}
	/* 底部 */
	.bottom {
		position:absolute;
		display:flex;
		align-items:center;
		width: 80%;
		left:100rpx;
		bottom:30rpx;
		.total {
			font-size:36rpx;
		}
		.price {
			flex-grow: 1;
			padding-left:0 10rpx;
			color:red;
			.price {
				font-size:40rpx;
			}
		}
		.pay {
			color:#fff;
			padding:20rpx 40rpx;
			border-radius:40rpx;
			background-color: red;
		}
	}
	
	/* 二维码位置 */
	.warp {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}
</style>
