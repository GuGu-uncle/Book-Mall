<template>
	<view class='container'>
		<!-- 轮播图 -->
		<view>
			<u-swiper
					:list="slidesImg"
					keyName="img_url"
					showTitle
					height="320rpx"
					@change="e => current = e.current"
					autoplay
			>
				<view
						slot="indicator"
						class="indicator"
				>
					<view
							class="indicator__dot"
							v-for="(item, index) in slidesImg"
							:key="item.id"
							:class="[index === current && 'indicator__dot--active']"
					>
					</view>
				</view>
			</u-swiper>
		</view>
		
		<!-- 导航 -->
		<u-tabs 
			class="navigation" 
			:list="classification" 
			:scrollable='false' 
			lineWidth="80rpx"
			lineHeight="7"
			:activeStyle="{
				color: '#303133',
				fontWeight: 'bold',
				transform: 'scale(1.05)',
				fontSize:'34rpx'
			}"
			@click="commodityClassification"
		></u-tabs>
		
		<!-- 商品 -->
		<view class="goods">
			<!-- 加载动画 -->
			<view class="loading" v-if="!indexList.length">
				<u-loading-icon 
					size="100rpx"
					text="加载中" 
					textSize="40rpx"
					:vertical="true"
					:show="!indexList.length"
				></u-loading-icon>
			</view>
			<!-- 商品列表 -->
		    <goods-cart :goodsList="indexList"></goods-cart><!-- 引入自定义组件 -->
		</view>
	</view>
</template>

<script>
	import {apiIndex, apiLogin,apiUserInfo} from '../../config/api.js';
	export default {
		data() {
			return {
				slidesImg:[],
				current:0,//轮播图圆点默认第一个亮
				classification:[
					{name:'默认'},
					{name:'销量'},
					{name:'推荐'},
					{name:'最新'}
				],
				indexList:[],
				index:0,//展示商品分类
				page:1,//商品页数
				isLast:false//判断当前获取的数据是否是最后一页
			}
		},
		 onLoad() {
			 // 获取初始化数据
			this.getData()
		},
		methods: {
			// 获取初始化数据调用的函数
			async getData(){
				const res=await apiIndex()
				this.slidesImg=res.slides
				this.indexList=res.goods.data
			},
			// 获取分类商品
			commodityClassification(classification){
				this.index=classification.index
				// 将商品列表置为空
				this.indexList=[]
				// 将页数置为1
				this.page=1
				// 获取商品列表
				this.addGoods()
			},
			// 增加商品列表
			async addGoods(){
				let page=this.page
				let res
				if(this.index===0) res = await apiIndex({page})
				if(this.index===1) res = await apiIndex({sales:1,page})
				if(this.index===2) res = await apiIndex({recommend:1,page})
				if(this.index===3) res = await apiIndex({new:1,page})
				this.indexList.push(...res.goods.data)
				//判断当前数据是否是最后一页
				this.isLast = res.goods.next_page_url?false:true
				this.page++
			},
		},
		async onReachBottom(){
			// 增加商品列表
			if(!this.isLast){
				this.addGoods()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		padding:20rpx;
	}
	
	
	// 轮播图
	.indicator {
		@include flex(row);
		justify-content: center;

		&__dot {
			 height: 6px;
			 width: 6px;
			 border-radius: 100px;
			 background-color: rgba(255, 255, 255, 0.35);
			 margin: 0 5px;
			 transition: background-color 0.3s;
	
			&--active {
				 background-color: #ffffff;
			 }
		}
	}
	
	
	// 导航
	.navigation{
		margin:40rpx 0 0 0;
	}
	
	
	// 商品
	.loading{
		margin-top:100rpx
	}
</style>
