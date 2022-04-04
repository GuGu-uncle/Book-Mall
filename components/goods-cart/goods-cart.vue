<template>
	<navigator url="">
		<u--image :showLoading="true" :src="goods.cover_url" width="280rpx" height="320rpx" @click="click"></u--image>
		<view class='title u-line-1'>{{goods.title}}</view>
		<view class='price-sales'>
			<view class='price'>￥{{goods.price}}</view>
			<view class='sales'>月销量:{{goods.sales}}</view>
		</view>
	</navigator>
</template>

<script>
	export default {
		name:"goods-cart",
		props: {
			goods: {
				type: Object,
				default(){
					return {}
				}
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
	navigator{
		padding:20rpx;
		margin-top:20rpx;
		box-shadow:0 12rpx 20rpx rgba(0,0,0,.15);
		.title{
			font-size:30rpx;
			margin:20rpx;
		}
		.price-sales{
			width: 100%;
			display:flex;
			justify-content:space-between;
			.price{
				color:red;
				font-size:36rpx;
			}
			.sales{
				color:#888;
			}
		}
	}
	
	
</style>
