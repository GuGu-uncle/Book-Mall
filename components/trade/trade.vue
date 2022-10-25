<template>
	<!-- 订单列表 -->
	<view>
		<view class="unpaid" v-for="item1 in tradeList" :key="item1.id">
			<view>共计 {{item1.orderDetails.data.length}} 件商品</view>
			<!-- 待支付订单信息 -->
			<view class="goodsInfo" v-for="item2 in item1.orderDetails.data" :key="item2.id">
				<image :src="item2.goods.cover_url"></image>
				<view class="goodsInfo-right">
					<view>{{item2.goods.title}}</view>
					<view>{{item2.goods.description}}</view>
					<view>
						￥<text>{{item2.price}}</text>
						<view>x{{item2.num}}</view>
					</view>
				</view>
			</view>
			<!-- 创建时间 -->
			<view class="createdTime">{{item1.created_at}}</view>
			<!-- 未支付 -->
			<view class="red" :style="{'--color_header': color.header}">{{content.header}}</view>
			<!-- 去付款 -->
			<view class="green" @click="handleClickFooter(item1.id)" :style="{'--color_footer': color.footer}">{{content.footer}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		// props:[ 'tradeList', 'color', 'content', 'handleClickFooter' ],
		props:{
			// 订单列表
			tradeList:Array,
			color:{
				header:String,
				footer:String
			},
			content:{
				header:String,
				footer:String
			},
			handleClickFooter:Function
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	// 订单容器
	.unpaid {
		position: relative;
		font-size: 38rpx;
		padding: 20rpx;
		margin-top: 20rpx;
		box-shadow: -2px 3px 10px 1px #bbb;
		
		view:first-child {
			margin-bottom: 20rpx;
		}
		
		// 商品信息
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
				flex-direction: column;
				
				view:nth-child(1) {
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
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
					font-weight: 600;
					color: #f43148;
					padding-top: 20rpx;
					
					text {
						font-size: 46rpx;
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
	
		// 创建时间
		.createdTime {
			color: #aaa;
			margin: 30rpx 0 10rpx;
		}
	
		// 待支付,去支付
		.red,.green {
			width:200rpx;
			height:60rpx;
			font-size: 34rpx;
			color: #fff;
			text-align: center;
			line-height: 60rpx;
			border-radius: 10rpx;
		}
		.red {
			position: absolute;
			top: 10rpx;
			right: 20rpx;
			background-color: var(--color_header); //传过来的颜色
		}
		.green {
			position: absolute;
			bottom: 20rpx;
			right: 20rpx;
			background-color: var(--color_footer); //传过来的颜色
		}
	}
</style>
