<template>
	<u-grid
			:border="false"
			col="2"
	>
		<u-grid-item
				v-for="(item,index) in goodsList"
				:key="index"
		>
			<u-icon
					:customStyle="{paddingTop:20+'rpx'}"
					:size="22"
			></u-icon>
			<!-- 自定义组件 -->
			<navigator :url="`/pages/goods/show?id=${item.id}`">
				<u--image :showLoading="true" :src="item.cover_url" width="280rpx" height="320rpx"></u--image>
				<view class='title u-line-1'>{{item.title}}</view>
				<view class='price-sales'>
					<view class='price'>￥{{item.price}}</view>
					<view class='sales'>月销量:{{item.sales}}</view>
				</view>
			</navigator>
		</u-grid-item>
	</u-grid>
</template>

<script>
	export default {
		name:"goods-cart",
		props: ['goodsList'],
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
