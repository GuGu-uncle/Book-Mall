<template>
	<!-- 商品详情 -->
	<view class="container" >
		<!-- 顶部 -->
		<view class="top">
			<view class="img padding">
				<u--image :showLoading="true" :src="goods.cover_url" width="340rpx" height="400rpx" @click="click"></u--image>
			</view>
			<view class="title">{{goods.title}}</view>
			<view class="price-sales">
				<view class="price">￥ {{goods.price}}</view>
				<view class="sales">销量 {{goods.sales}}</view>
			</view>
		</view>
		
		<!-- tabs标签 -->
		<view class="tabs">
			<u-tabs
				:list="list" 
				:scrollable="false" 
				lineWidth="150rpx"
				lineHeight="7"
				lineColor="#f56c6c"
				:activeStyle="{
					color: '#303133',
					fontWeight: 'bold',
					transform: 'scale(1.05)',
					fontSize:'34rpx'
				}"
				itemStyle="margin-top: 10px;height: 50px;"
				@click="change"
			></u-tabs>
		</view>
		
		<!-- 商品详情 -->
		<view class="details self-adaption" v-show="isShow===0">
			<u-parse :content="content"></u-parse>
		</view>
		
		<!-- 商品评论 -->
		<scroll-view scroll-y class="commentList self-adaption" v-show="isShow===1" ref="comment">
			<view class="comment" v-for="item in commentList" :key="item.id">
				<u--image :showLoading="true" :src="item.user.avatar_url" width="80rpx" height="80rpx" @click="click"></u--image>
				<view class="info">
					<view class="userName">{{item.user.name}}</view>
					<view class="content">{{item.content}}</view>
					<view class="time">{{item.created_at}}</view>
				</view>
			</view>
		</scroll-view>
		
		<!-- 推荐商品 -->
		<view class="recommend self-adaption" v-show="isShow===2">
			<goods-cart :goodsList="like_goods"></goods-cart>
		</view>
		
		<!-- 底部 -->
		<view class="bottom">
			<view class="collect" @click="collect">
				<block v-if="!is_collect">
					<u-icon name="star" size="50rpx"></u-icon>
					<view class="content">收藏</view>
				</block>
				<block v-else>
					<u-icon name="star" size="50rpx" color="red"></u-icon>
					<view class="content" style="color:red">已收藏</view>
				</block>
			</view>
			<view class="cart" @click="toCart">
				<view class="cartIconNumber">
					<u-icon name="shopping-cart" size="50rpx"></u-icon>
					<u-badge 
						type="success" 
						max="99" 
						:value="value" 
						absolute
						:offset="[0,20]"
					></u-badge>
				</view>
				<view class="content">购物车</view>
			</view>
			<view class="add style" @click="addCart">加入购物车</view>
			<view class="buy style">立即购买</view>
		</view>
	</view>
</template>

<script>
	import {apiGoods,apiCollectsGoods,apiAddCart,apiCartList} from '@/config/api.js'
	export default {
		data() {
			return {
				goods:{},//商品信息
				like_goods:[],//推荐商品列表
				list: [{name: '商品详情'}, {name: '商品评论',badge: {value: 0}}, {name: '推荐商品'}],
				isShow:0,//tabs标签切换
				content: '',//商品详情
				commentList:[],//商品评论
				is_collect:0,//商品是否被收藏
				value:0 //购物车中的商品数量
			}
		},
		onLoad(option) {
			this.getData(option.id)//获取商品信息
		},
		methods: {
			// 初始化页面时执行的函数
			async getData(id){
				let res = (await apiGoods(id))
				this.goods = res.goods // 获取商品信息
				this.like_goods = res.like_goods //获取推荐商品列表
				this.commentList = res.goods.comments
				this.list[1].badge.value = res.goods.comments.length // 获取商品评论数量
				this.content = res.goods.details // 获取商品详情
				this.is_collect = res.goods.is_collect//获取商品是否被收藏
				let token = uni.getStorageSync('token')
				// 用户登录后才能获取购物车的商品数量
				if(token){
					this.value = (await apiCartList()).data.length//获取购物车里商品的数量
				}
			},
			// 点击tabs调用的函数
			change(event){
				this.isShow=event.index// 当点击不同的tabs标签时，改变isShow
			},
			// 点击收藏调用的函数
			async collect(){
				//如果商品未被收藏则收藏，反之则取消收藏
				await apiCollectsGoods(this.goods.id)
				if(!this.is_collect){
					this.is_collect = 1 
				}else{
					this.is_collect = 0
				}
			},
			// 点击加入购物车调用的函数
			addCart(){
				uni.showToast({
					title:'添加成功',
					icon:'none',
					success:async ()=>{
						let token = uni.getStorageSync('token')
						// 用户登录后才能获取购物车的商品数量
						if(token){
							await apiAddCart({goods_id:this.goods.id})
							this.value = (await apiCartList()).data.length//获取购物车里商品的数量
						}
					}
				})
			},
			toCart(){
				uni.$u.route({
					type:'switchTab',
					url: '/pages/cart/cart'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		height: 94vh;
		display: flex;
		flex-direction: column;
		
		.self-adaption {
			flex-grow: 1;
		}
		
		.top{
			padding:0 20rpx;
			// 商品图片
			.img{
				width: 400rpx;
				margin:0 auto;
			}
			// 商品名称
			.title{
				font-size:46rpx;
			}
			// 商品价格跟销量
			.price-sales{
				margin-top:20rpx;
				display:flex;
				justify-content:space-between;
				align-items:flex-end;
				.price{
					color:red;
					font-size:42rpx;
				}
				.sales{
					width: 160rpx;
					font-size:36rpx;
				}
			}
		}
		
		// tabs标签
		.tabs{
			margin-bottom:20rpx;
		}
		// 商品评论
		.commentList{
			padding:20rpx;
			.comment{
				display:flex;
				margin-bottom:20rpx;
				.info{
					margin-left:20rpx;
					.userName{
						font-size:40rpx;
						color:#11b8ff;
					}
					.content{
						font-size:38rpx;
						margin:10rpx 0;
					}
					.time{
						font-size:30rpx;
						color:#aaa;
					}
				}
			}
		}
		
		// 底部
		.bottom{
			position:sticky;
			bottom:0;
			display:flex;
			height: 100rpx;
			padding:10rpx;
			background-color:#fff;
			justify-content:space-around;
			align-items:center;
			z-index: 10;
			.collect{
				width: 100rpx;
			}
			.add{
				background-color:#ffaa00;
			}
			.buy{
				background-color:#ff0000;
			}
			.style{
				color:#fff;
				font-size:34rpx;
				padding:16rpx 30rpx;
				border-radius:50rpx;
			}
			.cart{
				width: 120rpx;
				.cartIconNumber{
					position:relative;
					display:flex;
				}
			}
		}
	}
</style>
