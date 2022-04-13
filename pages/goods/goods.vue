<template>
	<view class="container">
		<!-- 输入框 -->
		<view class="search">
			<u-search 
				placeholder="输入商品名称" 
				v-model="keyword" 
				@custom="handleSearch"
				@search="handleSearch"
			></u-search>
		</view>
		<!-- tabs标签 -->
		<u-tabs :list="list" lineWidth="30" :scrollable="false" @click="handleTabs"></u-tabs>
		<!-- 商品分类 -->
		<view class="content">
			<scroll-view class="classificationSrcoll" scroll-y>
				<view v-for="item in categories" @click="handleclassification($event)">
					<!-- 分类名 -->
					<view 
						v-for="(classificationName,index) in item.children"
						:key="index"
						:id="classificationName.id"
						class="classification" 
						:style="classificationName.id==categoriesId?style:''"
					>
						{{classificationName.name}}
					</view>
				</view>
			</scroll-view>
			<!-- 商品列表 -->
			<scroll-view class="goodsList" scroll-y @scrolltolower="addGoods">
				<u-grid
						:border="false"
						col="2"
				>
					<!-- 商品 -->
					<u-grid-item
							v-for="(item,index) in goods"
							:key="index"
							 
					>	
						<!-- 点击时跳转到商品详情页 -->
						<navigator class="goods" :url="`/pages/goods/show?id=${item.id}`">
							<u--image
								:showLoading="true" 
								:src="item.cover_url" 
								width="120rpx" 
								height="120rpx"
								class="margin"
							></u--image>
							<view class="goodsName margin">{{item.title}}</view>
						</navigator>
					</u-grid-item>
				</u-grid>
				<u-empty
					v-if="!goods.length"
					mode="search"
					icon="http://cdn.uviewui.com/uview/empty/car.png"
				>
				</u-empty>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {apiGoodsList} from '@/config/api.js'
	export default {
		data() {
			return {
				keyword:'', //搜索输入
				list: [ //tabs标签
					{ name: '默认'},
					{name: '销量'}, 
					{name: '推荐'},
					{name: '价格'},
					{name: '评论'},
				],
				index:0, //选中的tabs
				page:1, //获取商品数据的页数
				isLast:false, //判断是否是最后一页商品
				params:{}, //获取数据时传入的参数
				categories:[], //分类列表
				categoriesId:'', //分类的id
				style:{backgroundColor:'#fff'}, //选中的分类名的样式
				goods:[], //默认数据
			}
		},
		onLoad() {
			// 获取初始化数据
			this.init()
		},
		methods:{
			// 初始化页面时调用的函数
			async init(){
				// 获取商品分类和默认商品数据
				let res = await apiGoodsList()
				console.log(res)
				this.categories = res.categories
				this.goods.push(...res.goods.data)
				this.page++
			},
			// 将数据重置
			reset(){
				// 将商品列表置为空
				this.goods = []
				// 将页数page置为1，获取第一页数据
				this.page = 1
			},
			// 获取商品列表数据
			async getData(params){
				let res
				let page = this.page
				if(this.index===0) res = await apiGoodsList({page,...params})
				if(this.index===1) res = await apiGoodsList({sales:1,page,...params})
				if(this.index===2) res = await apiGoodsList({recommend:1,page,...params})
				if(this.index===3) res = await apiGoodsList({price:1,page,...params})
				if(this.index===4) res = await apiGoodsList({comments_count:1,page,...params})
				this.goods.push(...res.goods.data)
				this.page++
				this.isLast = res.goods.next_page_url?false:true
			},
			// 点击搜索时调用的函数
			handleSearch(){
				this.reset()
				this.categoriesId = ''
				// 设置params参数
				this.params = {title:this.keyword}
				this.getData(this.params)
			},
			// 选中不同tabs时调用的函数，默认选中第一个
			handleTabs(goods){
				this.index = goods.index
				// 重置数据
				this.reset()
				// 获取商品列表
				this.getData(this.params)
			},
			// 点击商品分类时调用的函数
			handleclassification(data){
				// 重置数据
				this.reset()
				// 令选中的商品分类名区域颜色变成白色
				this.categoriesId = data.target.id
				// 设置params参数
				this.params = {category_id:this.categoriesId}
				this.getData(this.params)
				
			},
			// 商品列表滚动到底部时调用的函数
			addGoods(){
				// 增加商品列表中的数据
				if(!this.isLast){
					this.getData(this.params)
				}
			}
		}

	}
</script>

<style lang="scss">
	// 搜索框
	.search{
		padding:20rpx;
	}
	// 商品分类名
	.content{
		display:flex;
		margin-top:20rpx;
		.classificationSrcoll{
			width: 180rpx;;
			height: 900rpx;
			background-color:#d0d0d0;
			.classification{
				padding:20rpx 0;
				text-align:center;
			}
		}
		// 商品
		.goodsList{
			height: 900rpx;
			.goods{
				display:flex;
				flex-direction:column;
				align-items:center;
				margin-top:30rpx;
				width: 300rpx;
				.goodsName{
					font-size:28rpx;
				}
			}
		}
	}
</style>
