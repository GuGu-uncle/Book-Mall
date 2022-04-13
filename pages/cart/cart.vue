<template>
	<view class="container">
		<!-- 购物车列表 -->
		<scroll-view scroll-y class="goodsList">
			<view 
				class="goodsItem" 
				v-for="item in goodsList" 
				:key="item.id"
			>
				<!-- 单选 -->
				<radio 
					:checked="item.is_checked===1 && item.goods.stock !=0"
					:disabled="item.goods.stock === 0"
					@click="handleCartChecked(item.id)"
				></radio>
				<view class="goods">
					<!-- 图片 -->
					<view class="img">
						<u--image 
							:showLoading="true" 
							:src="item.goods.cover_url" 
							width="160rpx" 
							height="200rpx"
						></u--image>
					</view>
					<!-- 商品信息 -->
					<view class="info">
						<!-- 商品介绍 -->
						<view class="content">
							<view class="title">{{item.goods.title}}</view>
							<view class="description">{{item.goods.description}}</view>
						</view>
						<!-- 库存 -->
						<view class="stock">
							库存:{{item.goods.stock}}
						</view>
						<!-- 商品价格数量 -->
						<view class="price-number">
							<!-- 价格 -->
							<view class="price">￥{{item.goods.price}}</view>
							<!-- 进步器 -->
							<u-number-box 
								:min="1" 
								:max="item.goods.stock?item.goods.stock:100" 
								v-model="item.num"
								buttonSize="24" 
								inputWidth="30"
								bgColor="#f4f4f4"
								:name="item.id"
								@change="handleNum"
							></u-number-box>
							<!-- 删除按钮 -->
							<u-icon 
								name="trash" 
								size="50rpx"
								color="red"
								 @click="handleDelete(item.id)"
							></u-icon>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view id="aaa" @click="a"></view>
	
		<!-- 底部 -->
		<view class="bottom">
			<radio 
				:checked="isWholeChecked"
				:disabled="disable"
				 @click="handleWholeChecked"
			><view class="all">全选</view></radio>
			<view class="money-settlement">
				<view class="total">合计<text class="money">￥{{money}}</text></view>
				<view class="settlement">去结算</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {apiCartList,apiCartChecked,apiCartNum,apiCartDelete} from '@/config/api.js'
	export default {
		data() {
			return {
				goodsList:[], //商品列表
				money:0, //商品总的金额
				Arr:[], //被选中商品的购物车id的数组
				isWholeChecked:false, //是否全选
				disable:true, //是否禁用全选按钮
			}
		},
		onShow() {
			// 获取购物车商品列表
			this.getData()
		},
		methods:{
			// 每次页面显示时调用的会函数
			async getData(){
				let res = (await apiCartList({include:'goods'})).data
				this.goodsList = res
				// console.log(this.goodsList)
				// 价格
				let price = []
				// 数量
				let num = []
				// 获取购物车中选中的商品的id
				// 先将数组置空
				this.Arr = []
				let disable = false
				res.map(item => {
					// 商品被选中时
					if(item.is_checked && item.goods.stock != 0){
						price.push(item.goods.price)
						num.push(item.num)
					}
					if(item.is_checked===1 && item.goods.stock != 0)
					this.Arr.push(item.id)
					if(!item.goods.stock)
					disable = true
				})
				// allow = false 则不允许全选
				this.disable = disable
				// 计算总的金额
				// 先将总的金额置为0
				this.money = 0
				for(let i = 0; i < price.length; i++){
					this.money += price[i] * num[i]
				}
				
				// 如果商品列表的数量跟选中的数量相等则全选
				this.isWholeChecked = res.length == this.Arr.length
			},
			// 商品勾点击勾选时触发
			async handleCartChecked(id){
				let cutOff = false //判断该商品是变成选中还是不选中
				
				let stock //库存数量
				this.goodsList.map(item => {
					if(item.id == id)
					stock = item.goods.stock
				})
				// 判断是否还有库存，没有则不执行下面代码
				if(!stock){
					// 提示商品库存不够
					uni.showToast({
						title:'商品库存不足',
						icon:'error'
					})
					return
				}
				this.Arr.map((item,index) => {
					if(item == id){
						cutOff = index
					}else{
						return item
					}
				})
				if(cutOff ===0 || cutOff){
					this.Arr.splice(cutOff,1)
				}else{
					this.Arr.push(id)
				}
				// 发送更改选中的请求
				await apiCartChecked({cart_ids:this.Arr})
				// 更新数据
				this.getData()
			},
			// 商品数量改变时触发
			async handleNum(info){
				// 发送更改商品数量的请求
				await apiCartNum(info.name,{num:info.value})
				// 更新数据
				this.getData()
			},
			// 将商品移出购物车时触发
			handleDelete(id){
				// 提示框，点击确定后移出商品，点击取消不移出
				uni.showModal({
					content:'是否将商品移出购物车？',
					success:async (info)=>{
						if(info.confirm){
							// 发送请求将商品移出购物车
							await apiCartDelete(id)
							// 更新数据
							this.getData()
						}
					}
				})
			},
			// 全选按钮点击时触发
			async handleWholeChecked(){
				if(this.isWholeChecked){
					// 选中变成不选中
					// 发送更改选中的请求
					await apiCartChecked({cart_ids:[]})
				}else{
					// 不选中变成选中
					let arr = this.goodsList.map(item => {
						return item.id
					})
					await apiCartChecked({cart_ids:arr})
				}
				// 更新数据
				this.getData()
			}
		}
	}
</script>

<style lang="scss">
	.container{
		height: 79vh;
		margin:40rpx;
		// 商品列表
		.goodsList{
			height: 960rpx;
			.goodsItem{
				display:flex;
				align-items:center;
				// 商品
				.goods{
					display:flex;
					flex-grow: 1;
					margin-left:20rpx;
					background-color: #dcdcdc;
					// 商品图片
					.img{
						padding:20rpx;
					}
					.info{
						display:flex;
						flex-direction:column;
						flex-grow: 1;
						justify-content:space-between;
						margin:20rpx 10rpx;
						// 商品信息
						.content{
							font-size:28rpx;
							.title{
								padding-bottom:10rpx;
							}
							.description{
								color:#939393;
							}
						}
						// 商品价格、数量、删除图标
						.price-number{
							display:flex;
							justify-content:space-between;
							.price{
								width: 90rpx;
								font-size:32rpx;
								font-weight: bold;
								color:red;
							}
						}
					}
				}
			}
		}
		
		// 底部结算栏
		.bottom{
			display:flex;
			justify-content:space-between;
			align-items:center;
			margin-top:20rpx;
			// 全部
			.all{
				font-size:36rpx;
				margin-left:20rpx;
			}
			// 金额、结算
			.money-settlement{
				display:flex;
				justify-content:space-between;
				align-items:center;
				font-size:34rpx;
				// 合计、金额
				.total{
					width: 220rpx;
					.money{
						font-weight: bold;
						color:red;
					}
				}
				// 结算
				.settlement{
					color:#fff;
					padding:20rpx 50rpx;
					margin-left:10rpx;
					border-radius:60rpx;
					background-color: red;
				}
			}
		}
	}
</style>
